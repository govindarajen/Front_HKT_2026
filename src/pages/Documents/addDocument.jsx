import { useEffect, useState } from 'react';
import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    Button,

} from 'reactstrap';
import { faFileImport, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../helpers/apiHelper';

const DOCUMENT_SLOTS = [
    { key: 'devis', documentType: 'devis', labelKey: 'devis' },
    { key: 'facture', documentType: 'facture_fournisseur', labelKey: 'facture_fournisseur' },
    { key: 'attestation', documentType: 'attestation_urssaf', labelKey: 'attestation_urssaf' },
];

export default function AddDocument() {

    const { t } = useTranslation()

    /* ---------------------------------------------------------- */

    const [selectedFiles, setSelectedFiles] = useState({
        devis: null,
        facture: null,
        attestation: null,
    });
    const [previewUrls, setPreviewUrls] = useState({
        devis: null,
        facture: null,
        attestation: null,
    });
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [uploadResults, setUploadResults] = useState({});

    const hasAnyPreview = DOCUMENT_SLOTS.some((slot) => Boolean(selectedFiles[slot.key]));

    useEffect(() => {
        const nextPreviewUrls = {
            devis: null,
            facture: null,
            attestation: null,
        };

        DOCUMENT_SLOTS.forEach((slot) => {
            const file = selectedFiles[slot.key];
            if (file) {
                nextPreviewUrls[slot.key] = URL.createObjectURL(file);
            }
        });

        setPreviewUrls(nextPreviewUrls);

        return () => {
            Object.values(nextPreviewUrls).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [selectedFiles]);

    // Handle file selection
    const handleFileChange = (slotKey, e) => {
        const file = e.target.files?.[0] ?? null;
        setSelectedFiles((prev) => ({ ...prev, [slotKey]: file }));
        setUploadResults((prev) => ({ ...prev, [slotKey]: null }));
        setError(null);
    };

    // Upload file and extract data
    const handleUpload = async () => {
        const selectedSlots = DOCUMENT_SLOTS.filter((slot) => Boolean(selectedFiles[slot.key]));

        if (selectedSlots.length === 0) {
            setError(t('noFileSelectedText'));
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const results = await Promise.all(
                selectedSlots.map(async (slot) => {
                    const formPayload = new FormData();
                    formPayload.append('file', selectedFiles[slot.key]);
                    formPayload.append('documentType', slot.documentType);

                    const response = await apiClient.post('/documents/upload', formPayload, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    return [slot.key, response?.data ?? null];
                })
            );

            setUploadResults(Object.fromEntries(results));
        } catch (err) {
            setError(t('uploadError'));
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container fluid className="dashboard-page px-4 py-4 h-100">
            <Row>
                <Col xl={12} sm={12} className='h-100'>
                    <Card className="b-4 h-100">
                        <CardBody className='d-flex w-100 align-items-center flex-column p-3 h-100'>
                            <div className='w-75 h-25 d-flex align-items-center justify-content-center flex-column uploadSection'>
                                <h5>{t('addDocument')}</h5>
                                <div className="mb-3 w-100 d-flex align-items-center justify-content-center flex-column">
                                    {DOCUMENT_SLOTS.map((slot) => (
                                        <div className='w-75 d-flex align-items-center justify-content-center flex-row mb-2' key={slot.key}>
                                            <span className='me-2 fw-semibold' style={{ minWidth: 140 }}>{t(slot.labelKey)}</span>
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                value={selectedFiles[slot.key]?.name ?? ''}
                                                placeholder={t('chooseFile')}
                                                readOnly
                                                style={{ cursor: 'pointer', background: '#fff' }}
                                                onClick={() => document.getElementById(`real-file-input-${slot.key}`).click()}
                                                disabled={true}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => document.getElementById(`real-file-input-${slot.key}`).click()}
                                                disabled={uploading}
                                            >
                                                {t('selectFile')}
                                            </button>

                                            <input
                                                id={`real-file-input-${slot.key}`}
                                                type="file"
                                                accept="application/pdf,image/*"
                                                onChange={(e) => handleFileChange(slot.key, e)}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    color="primary"
                                    className='mb-3'
                                    onClick={handleUpload}
                                    disabled={uploading || !hasAnyPreview}
                                >
                                    {uploading ? t('uploading') : t('importDocument')}
                                    <FontAwesomeIcon icon={faFileCirclePlus} className="ms-2" />
                                </Button>
                                {error && <div className="text-danger">{error}</div>}
                            </div>
                            <div className='h-75 w-100 d-flex justify-content-center align-items-stretch mt-3'>
                                <Row className='w-100 g-3'>
                                    {hasAnyPreview ? (
                                        DOCUMENT_SLOTS.map((slot) => {
                                            const file = selectedFiles[slot.key];
                                            const previewUrl = previewUrls[slot.key];
                                            const isImage = file?.type?.startsWith('image/');
                                            const uploadOk = Boolean(uploadResults[slot.key]);

                                            return (
                                                <Col xs={12} md={4} key={slot.key}>
                                                    <div className='uploadedDataForm p-3 h-100 d-flex flex-column'>
                                                        <h6 className='fw-semibold text-center'>{t(slot.labelKey)}</h6>
                                                        <div className='file-preview mt-2 h-100 d-flex align-items-center justify-content-center border rounded p-3'>
                                                            {file ? (
                                                                isImage ? (
                                                                    <img
                                                                        src={previewUrl}
                                                                        alt={slot.key}
                                                                        className="img-fluid rounded"
                                                                    />
                                                                ) : (
                                                                    <div className="pdf-preview d-flex flex-column align-items-center w-100 justify-content-center">
                                                                        {file.type === 'application/pdf' ? (
                                                                            <iframe
                                                                                src={previewUrl}
                                                                                title={file.name}
                                                                                width="100%"
                                                                                height="300px"
                                                                                style={{ border: 'none', borderRadius: '8px' }}
                                                                            />
                                                                        ) : (
                                                                            <>
                                                                                <FontAwesomeIcon icon={faFileImport} size="3x" />
                                                                                <span className="mt-2 fw-semibold text-center">{file.name}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )
                                                            ) : (
                                                                <div className='text-muted text-center'>{t('noFileSelectedText')}</div>
                                                            )}
                                                        </div>
                                                        {uploadOk && <span className='text-success small mt-2 text-center'>{t('done')}</span>}
                                                    </div>
                                                </Col>
                                            )
                                        })
                                    ) : (
                                        <div className='w-100 uploadedDataForm p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center'>
                                            <div className='d-flex flex-column justify-content-center align-items-center border rounded w-100 h-100 py-5 px-4'>
                                                <FontAwesomeIcon icon={faFileImport} size="4x" className="mb-3" />
                                                <h5 className='mb-2'>{t('noFileSelectedTitle')}</h5>
                                                <p className='mb-1 text-muted'>{t('noFileSelectedText')}</p>
                                                <p className='mb-0 text-muted'>{t('emptyFormText')}</p>
                                            </div>
                                        </div>
                                    )}
                                </Row>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}