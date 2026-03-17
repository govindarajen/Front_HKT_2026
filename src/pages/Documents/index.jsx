import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    Button,
    TabContent, TabPane, Nav, NavItem, NavLink,
    Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Alert,

} from 'reactstrap';
import { faFileImport, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fr from 'date-fns/locale/fr';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCleanDocumentsRequest, getCuratedDocumentsRequest, getRawDocumentsRequest } from '../../redux/documents/documentsReducer';
import TableList from '../../components/ui/tables/TableList';
import { apiClient } from '../../helpers/apiHelper';

const initialFormData = {
    documentType: 'autre',
    siret: '',
    nomEntreprise: '',
    fournisseur: '',
    tva: null,
    montantHT: null,
    montantTTC: null,
    dateEmission: null,
    dateExpiration: null,
    anomalies: [],
    validated: false,
    validationDate: null,
    status: 'queued',
};

// Importer et configurer la locale française
registerLocale('fr', fr);



export default function Documents() {

    const { t } = useTranslation()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.account.value);

    const hasEnterprise = Boolean(user?.enterpriseId?._id || user?.enterpriseId);
    const currentUserId = user?._id || user?.id;
    const currentEnterpriseId = user?.enterpriseId?._id || user?.enterpriseId;

    const { cleanDocuments, curatedDocuments, rawDocuments } = useSelector((state) => state.documents);

    const [enterpriseOwnerId, setEnterpriseOwnerId] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusError, setStatusError] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedDocumentType, setSelectedDocumentType] = useState('curated');
    const [nextStatus, setNextStatus] = useState('queued');

    const statusOptions = ['queued', 'processing', 'processed', 'needs_validation', 'validated', 'rejected'];
    const isEnterpriseOwner = true
    /* Boolean(
        currentUserId &&
        enterpriseOwnerId &&
        String(currentUserId) === String(enterpriseOwnerId)
    );
 */
    // Column definitions for different document types
    const rawDocumentColumns = [
        { label: t('filename'), field: 'filename', type: 'text' },
        { label: t('documentType'), field: 'type', type: 'text' },
        { label: t('fullName'), field: 'uploadedBySnapshot.fullName', type: 'text' },
        { label: t('uploadDate'), field: 'uploadDate', type: 'date' },
        { label: t('status'), field: 'status', type: 'text' },
    ];

    const cleanDocumentColumns = [
        { label: t('extractionDate'), field: 'extractionDate', type: 'date' },
        { label: t('status'), field: 'status', type: 'text' },
    ];

    const curatedDocumentColumns = [
        { label: t('documentType'), field: 'documentType', type: 'text' },
        { label: t('nomEntreprise'), field: 'nomEntreprise', type: 'text' },
        { label: t('fournisseur'), field: 'fournisseur', type: 'text' },
        { label: t('montantTTC'), field: 'montantTTC', type: 'text' },
        { label: t('dateEmission'), field: 'dateEmission', type: 'date' },
        { label: t('validated'), field: 'validated', type: 'switch' },
        { label: t('status'), field: 'status', type: 'text' },
    ];

    useEffect( () => {

        dispatch(getCleanDocumentsRequest());
        dispatch(getCuratedDocumentsRequest());
        dispatch(getRawDocumentsRequest());

    }, [user?.enterpriseId] );

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
            } catch (error) {
                setEnterpriseOwnerId(null);
            }
        };

        fetchEnterpriseOwner();
    }, [currentEnterpriseId]);


    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    const openStatusModal = (document, documentType) => {
        if (!isEnterpriseOwner) {
            return;
        }

        setSelectedDocument(document);
        setSelectedDocumentType(documentType);
        setNextStatus(document?.status || 'queued');
        setStatusError(null);
        setIsStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setIsStatusModalOpen(false);
        setSelectedDocument(null);
        setStatusError(null);
        setStatusLoading(false);
    };

    const handleStatusUpdate = async () => {
        if (!selectedDocument?._id || !selectedDocumentType) {
            return;
        }

        try {
            setStatusLoading(true);
            setStatusError(null);
            await apiClient.patch(`/documents/${selectedDocumentType}/${selectedDocument._id}/status`, { status: nextStatus });

            dispatch(getCleanDocumentsRequest());
            dispatch(getCuratedDocumentsRequest());
            dispatch(getRawDocumentsRequest());
            closeStatusModal();
        } catch (error) {
            setStatusError(error?.response?.data?.error || 'Failed to update status');
            setStatusLoading(false);
        }
    };


    /* ---------------------------------------------------------- */

    return (
        <Container fluid className="dashboard-page px-4 py-4 h-100">
            <Row>
                <div className='w-100'>
                    <Card className="mb-4">
                        <CardBody className='d-flex justify-content-between align-items-center'>
                            <h1>{t('documents')}</h1>
                            <Button disabled={!hasEnterprise} onClick={() => navigate('/documents/add')}><FontAwesomeIcon icon={faFileCirclePlus} /> {t('addDocument')}</Button>
                        </CardBody>
                    </Card>
                </div>
            </Row>
            <Row>
                <Col md={12}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink

                                className={activeTab === '1' ? 'active' : ''}
                                onClick={() => toggleTab('1')}
                            >
                            {t('curatedDocuments')}
                            </NavLink>
                        </NavItem>

                        <NavItem>
                            <NavLink
                                className={activeTab === '3' ? 'active' : ''}
                                onClick={() => toggleTab('3')}
                                >
                                {t('rawDocuments')}
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeTab}>
                        
                        <TabPane tabId="1">
                            <Row>
                                <Col md={12}>
                                    <Card className="mt-3">
                                        <CardBody>
                                            <h3>{t('curatedDocuments')}</h3>
                                            <TableList 
                                                data={curatedDocuments || []} 
                                                columns={curatedDocumentColumns} 
                                                onRowClick={(row) => openStatusModal(row, 'curated')} 
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="2">
                            <Row>
                                <Col md={12}>
                                    <Card className="mt-3">
                                        <CardBody>
                                            <h3>{t('cleanDocuments')}</h3>
                                            <TableList 
                                                data={cleanDocuments || []} 
                                                columns={cleanDocumentColumns} 
                                                onRowClick={(row) => openStatusModal(row, 'clean')} 
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>

                        <TabPane tabId="3">
                            <Row>
                                <Col md={12}>
                                    <Card className="mt-3">
                                        <CardBody>
                                            <h3>{t('rawDocuments')}</h3>
                                            <TableList 
                                                data={rawDocuments || []} 
                                                columns={rawDocumentColumns} 
                                                onRowClick={(row) => openStatusModal(row, 'raw')} 
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>

                    {!isEnterpriseOwner && hasEnterprise && (
                        <Alert color="info" className="mt-3 mb-0">
                            Only the enterprise owner can update document status.
                        </Alert>
                    )}
                </Col>
            </Row>

            <Modal isOpen={isStatusModalOpen} toggle={closeStatusModal}>
                <ModalHeader toggle={closeStatusModal}>Update document status</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="statusSelect">Status</Label>
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
                    <Button color="secondary" onClick={closeStatusModal} disabled={statusLoading}>Cancel</Button>
                    <Button color="primary" onClick={handleStatusUpdate} disabled={statusLoading}>
                        {statusLoading ? 'Updating...' : 'Update'}
                    </Button>
                </ModalFooter>
            </Modal>
        </Container>
    );
}