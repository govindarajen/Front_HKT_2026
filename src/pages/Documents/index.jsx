import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    Button,

} from 'reactstrap';
import { faFileImport, faFileCirclePlus } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';

import DatePicker, { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fr from 'date-fns/locale/fr';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
    const fileFromState = useSelector((state) => state.documents?.uploadedFile ?? state.documents?.value?.uploadedFile ?? state.documents?.selectedFile ?? null);

    /* ---------------------------------------------------------- */

    return (
        <Container fluid className="dashboard-page px-4 py-4 h-100">
            <Row>
                <div className='w-100'>
                    <Card className="mb-4">
                        <CardBody className='d-flex justify-content-between align-items-center'>
                            <h1>{t('documents')}</h1>
                            <Button onClick={() => navigate('/documents/add')}><FontAwesomeIcon icon={faFileCirclePlus} /> {t('addDocument')}</Button>
                        </CardBody>
                    </Card>
                </div>
            </Row>
            <Row>
                <Col md={12}>
                    
                </Col>
            </Row>
        </Container>
    );
}