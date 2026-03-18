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

} from 'reactstrap';
import { faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fr from 'date-fns/locale/fr';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getCleanDocumentsRequest, getCuratedDocumentsRequest, getRawDocumentsRequest } from '../../redux/documents/documentsReducer';
import TableList from '../../components/ui/tables/TableList';
import { apiClient } from '../../helpers/apiHelper';
// Importer et configurer la locale française
registerLocale('fr', fr);



export default function Documents() {

    const { t } = useTranslation()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.account.value);

    const hasEnterprise = Boolean(user?.enterpriseId?._id || user?.enterpriseId);

    const { cleanDocuments, curatedDocuments, rawDocuments } = useSelector((state) => state.documents);

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
        { label: t('detectedType'), field: 'detectedType', type: 'text' },
        { label: t('client'), field: 'client', type: 'text' },
        { label: t('validationStatus'), field: 'validationStatus', type: 'text' },
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



    const [curatedFormattedDocuments, setCuratedFormattedDocuments] = useState([]);
    const [cleanFormattedDocuments, setCleanFormattedDocuments] = useState([]);
    const [rawFormattedDocuments, setRawFormattedDocuments] = useState([]);


    useEffect( () => {

        if (curatedDocuments && curatedDocuments.length > 0) {
            const formatted = curatedDocuments
            .map(doc => ({
                ...doc,
                detectedType: t(doc.detectedType),
                dateEmission: doc.dateEmission ? new Date(doc.dateEmission) : null,
                montantTTC: doc.montantTTC ? `${doc.montantTTC} €` : t('unknown'),
                status: doc?.validationStatus == "invalid" ? t("youCannotValidate") : t(doc.status),
                validationStatus: t(doc.validationStatus),
            }))
            .sort((a, b) => {
                if (!a.createdAt) return 1;
                if (!b.createdAt) return -1;
                return b.createdAt - a.createdAt;
            });
            setCuratedFormattedDocuments(formatted);
        }


        if (cleanDocuments &&  cleanDocuments.length > 0) {
            const formatted = cleanDocuments.map(doc => ({
                ...doc,
                extractionDate: doc.extractionDate ? new Date(doc.extractionDate) : null,
                status: t(doc.status),
            }));
            setCleanFormattedDocuments(formatted);
        }

        if (rawDocuments &&  rawDocuments.length > 0) {
            const formatted = rawDocuments.map(doc => ({
                ...doc,
                uploadDate: doc.uploadDate ? new Date(doc.uploadDate) : null,
                status: t(doc.status),
            }));
            setRawFormattedDocuments(formatted);
        }

    }, [curatedDocuments, cleanDocuments, rawDocuments] );





    const [activeTab, setActiveTab] = useState('1');

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    }

    const openDocumentDetailsPage = (document) => {
        if (!document?.siret) {
            return;
        }

        navigate(`/document/${document.siret}`, { state: { docId: document._id } });
    };
    const handleDownloadDoc = async (doc) => {
        if (!doc?._id) {
            return;
        }
        try {
            const response = await apiClient.get(`documents/raw/${doc._id}`, { responseType: 'blob' });
            const mimetype = response?.headers?.['content-type'] || 'application/octet-stream';
            const url = URL.createObjectURL(new Blob([response.data], { type: mimetype }));
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.filename || 'document';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
        }
    }

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
                                                data={curatedFormattedDocuments || []} 
                                                columns={curatedDocumentColumns} 
                                                onRowClick={(row) => openDocumentDetailsPage(row)} 
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
                                                data={cleanFormattedDocuments || []} 
                                                columns={cleanDocumentColumns} 
                                                onRowClick={(row) => openDocumentDetailsPage(row)} 
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
                                                data={rawFormattedDocuments || []} 
                                                columns={rawDocumentColumns} 
                                                onRowClick={(row) => handleDownloadDoc(row)} 
                                            />
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </Container>
    );
}