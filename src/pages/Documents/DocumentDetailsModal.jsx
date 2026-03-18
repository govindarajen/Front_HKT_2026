import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { apiClient } from '../../helpers/apiHelper';

const DocumentDetailsModal = ({ isOpen, onClose, document, setNextStatus, documentType, nextStatus, onStatusUpdate, statusError, statusLoading }) => {
    
    const { t } = useTranslation();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewMimetype, setPreviewMimetype] = useState(null);

    const statusOptions = ['queued', 'needs_validation', 'validated', 'rejected']; 
    console.log(document)

    useEffect(() => {
        if (!isOpen || !document || documentType !== 'curated' || !document.rawId) {
            setPreviewUrl(null);
            setPreviewMimetype(null);
            return;
        }

        apiClient.get(`documents/raw/${document.rawId}`, { responseType: 'blob' })
            .then(response => {
                const url = URL.createObjectURL(new Blob([response.data]));
                const mimetype = response.headers['content-type'] || 'application/octet-stream';
                setPreviewUrl(url);
                setPreviewMimetype(mimetype);
            })
            .catch(error => {
                console.error('Error fetching document preview:', error);
                setPreviewUrl(null);
                setPreviewMimetype(null);
            });

        // Cleanup blob URL when modal closes
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [isOpen, document, documentType])
    
    return (
            <Modal isOpen={isOpen} toggle={onClose} size={"xl"}>
                <ModalHeader toggle={onClose}>{t('updateStatusModalTitle')}</ModalHeader>
                <ModalBody>

                    <Row>
                        <div className="col-md-6 h-100">
                            <h5>{t('documentPreview')}</h5>
                            {previewUrl ? (
                                previewMimetype?.includes('image') ? (
                                    <img
                                        src={previewUrl}
                                        style={{ width: '100%', maxHeight: '850px', border: '1px solid #ddd', objectFit: 'contain' }}
                                        alt="Document Preview"
                                    />
                                ) : (
                                    <iframe
                                        src={previewUrl}
                                        style={{ width: '100%', height: '850px', border: '1px solid #ddd' }}
                                        title="Document Preview"
                                    />
                                )
                            ) : (
                                <div style={{ height: '650px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                                    <p>{t('noPreviewAvailable') || 'No preview available'}</p>
                                </div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <h5>{t('documentDetails')}</h5>
                            {document &&
                            Object.entries(document).map(([key, value]) => {
                                const exceptions = [
                                    'id',
                                    '_id',
                                    'rawId',
                                    'cleanId',
                                    'file_url',
                                    'processingHistory',
                                    '__v',
                                    'status',
                                    'enterpriseId',
                                    "dateEcheance",
                                    "validated"
                                ];
                                if (exceptions.includes(key)) return null;
                                switch (key) {
                                    case 'dateEmission':
                                    case 'dateExpiration':
                                    case 'validatedAt':
                                        return (
                                            <FormGroup key={key}>
                                                <Label>{t(key)}</Label>
                                                <Input type="text" value={new Date(value).toLocaleDateString()} disabled />
                                            </FormGroup>
                                        );
                                    case 'is_validated': // example boolean key
                                        return (
                                            <FormGroup key={key} switch className="mb-2">
                                                <Input type="switch" checked={!!value} disabled readOnly />
                                                <Label check>{t(key)}</Label>
                                            </FormGroup>
                                        );
                                    case 'numeroDocument':
                                        return (
                                            <React.Fragment key={key}>
                                                <FormGroup>
                                                    <Label>{t('numero')}</Label>
                                                    <Input type="text" value={value?.numero ?? t('notAvailable')} disabled />
                                                </FormGroup>
                                                {value?.ref && (
                                                    <FormGroup>
                                                        <Label>{t('ref')}</Label>
                                                        <Input type="text" value={value?.ref ?? t('notAvailable')} disabled />
                                                    </FormGroup>
                                                )}
                                            </React.Fragment>
                                        );
                                    case 'validationStatus':
                                        return (
                                            <FormGroup key={key} className="mb-2">
                                                <Label>{t(key)}</Label>
                                                <Input type="text" value={t(value)} disabled />
                                            </FormGroup>
                                        );
                                    case 'address':
                                        return (
                                            <FormGroup key={key} className="mb-2">
                                                <Label>{t(key)}</Label>
                                                <Input type="text" value={value?.full ?? t('notAvailable')} disabled />
                                            </FormGroup>
                                        );
                                    default:
                                        if (typeof value === 'boolean') {
                                            return (
                                                <FormGroup key={key} switch className="mb-2">
                                                    <Input type="switch" checked={value} disabled readOnly />
                                                    <Label check>{t(key)}</Label>
                                                </FormGroup>
                                            );
                                        }
                                        return (
                                            <FormGroup key={key}>
                                                <Label>{t(key)}</Label>
                                                <Input type="text" value={value ?? t('notAvailable')} disabled />
                                            </FormGroup>
                                        );
                                }
                            })}
                        </div>

                    </Row>

                            <hr></hr>
                    <FormGroup>
                        <Label for="statusSelect">{t('changeStatus')}</Label>
                        <Input
                            id="statusSelect"
                            type="select"
                            value={nextStatus}
                            onChange={(event) => setNextStatus(event.target.value)}
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>{t(status)}</option>
                            ))}
                        </Input>
                    </FormGroup>

                    {statusError && (
                        <Alert color="danger" className="mb-0">{t(statusError)}</Alert>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={onClose} disabled={statusLoading}>{t('cancel')}</Button>
                    <Button color="primary" onClick={onStatusUpdate} disabled={statusLoading}>
                        {statusLoading ? t('updating') : t('updateStatus')}
                    </Button>
                </ModalFooter>
            </Modal>
    );
};

export default DocumentDetailsModal;