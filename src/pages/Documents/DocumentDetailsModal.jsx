import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Badge,
    Button,
    Card,
    CardBody,
    Col,
    Container,
    FormGroup,
    Input,
    Label,
    Row,
    Spinner,
} from 'reactstrap';
import { apiClient } from '../../helpers/apiHelper';
import { getCleanDocumentsRequest, getCuratedDocumentsRequest, getRawDocumentsRequest } from '../../redux/documents/documentsReducer';

const statusOptions = ['queued', 'processing', 'processed', 'needs_validation', 'validated', 'rejected'];

const getStatusColor = (status) => {
    switch (status) {
        case 'validated':
            return 'success';
        case 'rejected':
            return 'danger';
        case 'needs_validation':
            return 'warning';
        case 'processing':
            return 'info';
        case 'processed':
            return 'primary';
        default:
            return 'secondary';
    }
};

const excludedKeys = ['_id', '__v', 'rawId', 'cleanId', 'enterpriseId', 'processingHistory', 'file_url', 'anomalies'];

const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date);
};

const normalizeStatus = (value, t) => {
    const matched = statusOptions.find((status) => status === value || t(status) === value);
    return matched || 'queued';
};

const revokePreviewUrls = (previewMap = {}) => {
    Object.values(previewMap).forEach((preview) => {
        if (preview?.url) {
            URL.revokeObjectURL(preview.url);
        }
    });
};

const displayValue = (key, value, t) => {
    if (value === null || value === undefined || value === '') {
        return t('notAvailable');
    }

    if (['dateEmission', 'dateExpiration', 'dateEcheance', 'validationDate', 'validatedAt', 'uploadDate', 'extractionDate', 'createdAt'].includes(key)) {
        return formatDate(value) || t('notAvailable');
    }

    if (typeof value === 'boolean') {
        return value ? t('yes') : t('no');
    }

    if (key === 'numeroDocument' && typeof value === 'object') {
        return [value?.numero, value?.ref].filter(Boolean).join(' · ') || t('notAvailable');
    }

    if (key === 'address' && typeof value === 'object') {
        return value?.full || t('notAvailable');
    }

    if ((key === 'montantTTC' || key === 'montantHT') && typeof value === 'number') {
        return `${value} €`;
    }
    if (key === 'detectedType' && typeof value === 'string') {
        return t(value) || t('notAvailable');
    }

    if (key === 'status') {
        return t(value) || t('notAvailable');
    }

    if (key === 'validationStatus') {
        return t(value) || t('notAvailable');
    }

    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(', ') : t('notAvailable');
    }

    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch {
            return t('notAvailable');
        }
    }

    return String(value);
};

export default function DocumentDetailsModal() {
    const { t } = useTranslation();
    const { siret } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { docId } = location.state || {};

    const user = useSelector((state) => state.account.value);
    const { curatedDocuments } = useSelector((state) => state.documents);
    const [enterpriseOwnerId, setEnterpriseOwnerId] = useState(null);
    const [statusById, setStatusById] = useState({});
    const [statusLoadingById, setStatusLoadingById] = useState({});
    const [statusErrorById, setStatusErrorById] = useState({});
    const [previewsByDocumentId, setPreviewsByDocumentId] = useState({});
    const previewsRef = useRef({});

    const currentUserId = user?._id || user?.id;
    const currentEnterpriseId = user?.enterpriseId?._id || user?.enterpriseId;
    const isEnterpriseOwner = Boolean(
        currentUserId &&
        enterpriseOwnerId &&
        String(currentUserId) === String(enterpriseOwnerId)
    );

    useEffect(() => {
        dispatch(getCuratedDocumentsRequest());
    }, [dispatch]);

    useEffect(() => {
        const fetchEnterpriseOwner = async () => {
            if (!currentEnterpriseId) {
                setEnterpriseOwnerId(null);
                return;
            }

            try {
                const response = await apiClient.get(`/enterprises/${currentEnterpriseId}`);
                const ownerId = response?.data?.enterprise?.ownerId?._id || response?.data?.enterprise?.ownerId || null;
                setEnterpriseOwnerId(ownerId);
            } catch {
                setEnterpriseOwnerId(null);
            }
        };

        fetchEnterpriseOwner();
    }, [currentEnterpriseId]);

    const documentsForSiret = useMemo(() => {
        if (!Array.isArray(curatedDocuments) || !siret) {
            return [];
        }

        const filtered = curatedDocuments.filter((doc) => String(doc?.siret || '') === String(siret));

        return filtered.sort((a, b) => {
            if (docId) {
                if (a._id === docId) return -1;
                if (b._id === docId) return 1;
            }
            const dateA = new Date(a?.dateEmission || 0).getTime();
            const dateB = new Date(b?.dateEmission || 0).getTime();
            return dateB - dateA;
        });
    }, [curatedDocuments, siret, docId]);

    useEffect(() => {
        if (!documentsForSiret.length) {
            return;
        }

        const initialStatusMap = {};
        documentsForSiret.forEach((doc) => {
            initialStatusMap[doc._id] = normalizeStatus(doc?.status, t);
        });

        setStatusById(initialStatusMap);
    }, [documentsForSiret, t]);

    useEffect(() => {
        previewsRef.current = previewsByDocumentId;
    }, [previewsByDocumentId]);

    useEffect(() => {
        return () => {
            revokePreviewUrls(previewsRef.current);
        };
    }, []);

    useEffect(() => {
        let isCancelled = false;

        const fetchPreviews = async () => {
            if (!documentsForSiret.length) {
                setPreviewsByDocumentId((prev) => {
                    revokePreviewUrls(prev);
                    return {};
                });
                return;
            }

            const loadingState = {};
            documentsForSiret.forEach((doc) => {
                loadingState[doc._id] = {
                    loading: true,
                    error: null,
                    url: null,
                    mimetype: null,
                };
            });
            setPreviewsByDocumentId(loadingState);

            const entries = await Promise.all(
                documentsForSiret.map(async (doc) => {
                    if (!doc?.rawId) {
                        return [
                            doc._id,
                            {
                                loading: false,
                                error: 'No rawId found',
                                url: null,
                                mimetype: null,
                            },
                        ];
                    }

                    try {
                        const response = await apiClient.get(`documents/raw/${doc.rawId}`, { responseType: 'blob' });
                        const mimetype = response?.headers?.['content-type'] || 'application/octet-stream';
                        const url = URL.createObjectURL(new Blob([response.data], { type: mimetype }));

                        return [
                            doc._id,
                            {
                                loading: false,
                                error: null,
                                url,
                                mimetype,
                            },
                        ];
                    } catch {
                        return [
                            doc._id,
                            {
                                loading: false,
                                error: 'Preview fetch failed',
                                url: null,
                                mimetype: null,
                            },
                        ];
                    }
                })
            );

            if (isCancelled) {
                revokePreviewUrls(Object.fromEntries(entries));
                return;
            }

            const nextMap = Object.fromEntries(entries);
            setPreviewsByDocumentId((prev) => {
                revokePreviewUrls(prev);
                return nextMap;
            });
        };

        fetchPreviews();

        return () => {
            isCancelled = true;
        };
    }, [documentsForSiret]);

    const updateStatusForDocument = async (documentId) => {
        const selectedStatus = statusById[documentId] || 'queued';

        try {
            setStatusLoadingById((prev) => ({ ...prev, [documentId]: true }));
            setStatusErrorById((prev) => ({ ...prev, [documentId]: null }));

            await apiClient.patch(`/documents/curated/${documentId}/status`, { status: selectedStatus });

            dispatch(getCleanDocumentsRequest());
            dispatch(getCuratedDocumentsRequest());
            dispatch(getRawDocumentsRequest());
        } catch (error) {
            setStatusErrorById((prev) => ({
                ...prev,
                [documentId]: error?.response?.data?.error || 'Failed to update status',
            }));
        } finally {
            setStatusLoadingById((prev) => ({ ...prev, [documentId]: false }));
        }
    };

    return (
        <Container fluid className="dashboard-page px-4 py-4 h-100">
            <Row className="mb-4">
                <Col>
                    <Card className="border-0 shadow-sm">
                        <CardBody className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                            <div>
                                <h1 className="mb-1">{t('documentDetails')}</h1>
                                <div className="text-muted">SIRET : {siret}</div>
                            </div>
                            <Button color="secondary" onClick={() => navigate('/documents')}>
                                {t('back') || 'Retour'}
                            </Button>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {!documentsForSiret.length && (
                <Alert color="warning">
                    {t('notAvailable')} - Aucun document trouvé pour ce SIRET.
                </Alert>
            )}

            {documentsForSiret.map((document, index) => {
                const currentStatus = normalizeStatus(document?.status, t);
                const selectedStatus = statusById[document._id] || currentStatus;
                const isLoading = Boolean(statusLoadingById[document._id]);
                const statusError = statusErrorById[document._id];
                const preview = previewsByDocumentId[document._id];

                return (
                    <div key={document._id || index}>
                        <Card className="mb-3 border-0 shadow-sm document-details-card">
                            <CardBody>
                                <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                                    <h5 className="mb-0">{document?.numeroDocument?.numero || t('unknown')}</h5>
                                    {
                                         document.validationStatus !== 'invalid' ? 
                                         (

                                             <Badge color={getStatusColor(currentStatus)} pill>
                                            {t(currentStatus)}
                                        </Badge>
                                        ) : (
                                            <Badge color="danger" pill>
                                                {t('invalid')}
                                            </Badge>
                                        )
                                    }
                                </div>

                                <Row className="g-4 mb-4">
                                    <Col lg={7}>
                                        <h6 className="mb-2">{t('documentPreview')}</h6>
                                        {preview?.loading ? (
                                            <div style={{ height: '520px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                                                <Spinner />
                                            </div>
                                        ) : preview?.url ? (
                                            preview?.mimetype?.includes('image') ? (
                                                <img
                                                    src={preview.url}
                                                    style={{ width: '100%', maxHeight: '720px', border: '1px solid #ddd', borderRadius: '8px', objectFit: 'contain', backgroundColor: '#fff' }}
                                                    alt="Document Preview"
                                                />
                                            ) : (
                                                <iframe
                                                    src={preview.url}
                                                    style={{ width: '100%', height: '720px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}
                                                    title={`Document Preview ${document._id}`}
                                                />
                                            )
                                        ) : (
                                            <div style={{ height: '520px', border: '1px solid #ddd', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                                                <p className="mb-0 text-muted">{t('noPreviewAvailable') || 'No preview available'}</p>
                                            </div>
                                        )}
                                    </Col>

                                    <Col lg={5}>
                                        <Card className="h-100 border bg-light-subtle ">
                                            <CardBody>
                                                <h6 className="mb-3">{t('documentDetails')}</h6>
                                                <div style={{ maxHeight: '720px', overflowY: 'auto', paddingRight: '6px' }} className='overflow-x-hidden'>
                                                    <Row>
                                                        {Object.entries(document)
                                                            .filter(([key]) => !excludedKeys.includes(key))
                                                            .map(([key, value]) => (
                                                                <Col xs={12} key={`${document._id}-${key}`} className="mb-3">
                                                                    <Label className="text-muted mb-1">{t(key)}</Label>
                                                                    <div className="fw-semibold">{displayValue(key, value, t)}</div>
                                                                </Col>
                                                            ))}
                                                    </Row>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>

                                { document.validationStatus !== 'invalid' ? ( 
                                <Card className="border-0 bg-light">
                                    <CardBody>
                                        <h6 className="mb-3">{t('changeStatus')}</h6>

                                        {isEnterpriseOwner ? (
                                            <Row className="g-3 align-items-end">
                                                <Col md={8}>
                                                    <FormGroup className="mb-0">
                                                        <Label for={`status-${document._id}`}>{t('status')}</Label>
                                                        <Input
                                                            id={`status-${document._id}`}
                                                            type="select"
                                                            value={selectedStatus}
                                                            onChange={(event) => {
                                                                const value = event.target.value;
                                                                setStatusById((prev) => ({
                                                                    ...prev,
                                                                    [document._id]: value,
                                                                }));
                                                            }}
                                                            disabled={isLoading}
                                                        >
                                                            {statusOptions.map((status) => (
                                                                <option key={status} value={status}>{t(status)}</option>
                                                            ))}
                                                        </Input>
                                                    </FormGroup>
                                                </Col>

                                                <Col md={4}>
                                                    <Button
                                                        color="primary"
                                                        className="w-100"
                                                        onClick={() => updateStatusForDocument(document._id)}
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <Spinner size="sm" className="me-2" />
                                                                {t('updating')}
                                                            </>
                                                        ) : t('updateStatus')}
                                                    </Button>
                                                </Col>

                                                {statusError && (
                                                    <Col xs={12}>
                                                        <Alert color="danger" className="mb-0">
                                                            {t(statusError)}
                                                        </Alert>
                                                    </Col>
                                                )}
                                            </Row>
                                        ) : (
                                            <Alert color="info" className="mb-0">
                                                {t('onlyEnterpriseOwnerCanChangeStatus')}
                                            </Alert>
                                        )}
                                    </CardBody>
                                </Card>) : (
                                    <Card className="border-0 bg-light">
                                    <CardBody>
                                        <Alert color="danger" className="mb-0">
                                            {t('anomalies')}
                                            <ul>
                                                {
                                                    document?.anomalies?.map((anomaly, idx) => (
                                                        <li key={`${anomaly.type || 'anomaly'}-${anomaly.message}-${idx}`}>{t(anomaly.type)} : {t(anomaly.message)}</li>
                                                    ))
                                                }
                                            </ul>
                                        </Alert>
                                    </CardBody>
                                    </Card>
                                )}
                            </CardBody>
                        </Card>
                        {index === 0 && documentsForSiret.length > 1 && docId === document._id && (
                            <>
                            <hr className="my-4 mx-5 mt-5" />
                            <h5 className="mb-3 w-100 text-center fs-2 mb-4">{t('otherDocumentsWithSameSiret')}</h5>
                            </>
                        )}
                    </div>
                );
            })}
        </Container>
    );
};
