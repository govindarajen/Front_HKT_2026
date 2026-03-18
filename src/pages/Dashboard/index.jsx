import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    CardTitle,
    Spinner,
    Alert,
    Table,
} from 'reactstrap';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, BarElement);
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import FormEnterpriseModal from './formCreateEnteprise';
import {
    fetchStatsRequest,
    fetchAnomaliesBySeverityRequest,
    fetchTopAnomaliesRequest,
    fetchDocumentsByTypeRequest,
    fetchAnomaliesRateByDocTypeRequest,
    fetchSuppliersAtRiskRequest,
    fetchValidationStatusRequest,
    fetchProcessingStatusRequest,
} from '../../redux/dashboard/dashboardReducer';

const CHART_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];

const toLabelsData = (value, t) => {
    if (!value) return null;

    if (Array.isArray(value?.labels) && Array.isArray(value?.data)) {
        return value;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
        const labels = Object.keys(value).map((key) => t(key));
        const data = Object.keys(value).map((key) => Number(value[key] ?? 0));
        return labels.length ? { labels, data } : null;
    }

    return null;
};

const toLabelsDataFromArray = (value, labelKey, dataKey) => {
    if (!Array.isArray(value) || value.length === 0) {
        return null;
    }

    return {
        labels: value.map((item) => item?.[labelKey] ?? 'N/A'),
        data: value.map((item) => Number(item?.[dataKey] ?? 0)),
    };
};

const toOrderedLabelsData = (value, orderedLabels, t) => {
    const normalized = toLabelsData(value, t);
    if (!normalized) return null;

    const byLabel = normalized.labels.reduce((acc, label, index) => {
        acc[label] = normalized.data[index] ?? 0;
        return acc;
    }, {});

    return {
        labels: orderedLabels.map((label) => t(label)),
        data: orderedLabels.map((label) => Number(byLabel[t(label)] ?? 0)),
    };
};

export default function Dashboard() {
    const dispatch = useDispatch();
    
    const { t } = useTranslation()
    
    const user = useSelector((state) => state.account.value);
    const dashboard = useSelector((state) => state.dashboard.value);

    const [isCreatingEnterprise, setIsCreatingEnterprise] = useState(false);

    useEffect(() => {
        const rights = user?.rights || [];
        if (rights.includes('document_validation') && user?.enterpriseId == null) {
            setIsCreatingEnterprise(true);
        }   
    }, [user])

    useEffect(() => {
        dispatch(fetchStatsRequest());
        dispatch(fetchAnomaliesBySeverityRequest());
        dispatch(fetchTopAnomaliesRequest({ limit: 10 }));
        dispatch(fetchDocumentsByTypeRequest());
        dispatch(fetchAnomaliesRateByDocTypeRequest());
        dispatch(fetchSuppliersAtRiskRequest({ limit: 10 }));
        dispatch(fetchValidationStatusRequest());
        dispatch(fetchProcessingStatusRequest());
    }, [dispatch]);

    const getDocumentsByTypeChart = () => {
        const formatted = toLabelsData(dashboard.documentsByType, t);
        if (!formatted) return null;

        return {
            labels: formatted.labels,
            datasets: [{
                data: formatted.data,
                backgroundColor: CHART_COLORS,
                borderColor: 'rgba(255, 255, 255, 0.38)',
                borderWidth: 2,
            }],
        };
    };

    const getAnomaliesBySeverityChart = () => {
        const formatted = toOrderedLabelsData(dashboard.anomaliesBySeverity, ['CRITIQUE', 'AVERTISSEMENT', 'INFO'], t);
        if (!formatted) return null;

        return {
            labels: formatted.labels,
            datasets: [{
                data: formatted.data,
                backgroundColor: ['#e74c3c', '#f39c12', '#f1c40f'],
                borderColor: 'rgba(255, 255, 255, 0.38)',
                borderWidth: 2,
            }],
        };
    };

    const getValidationStatusChart = () => {
        const formatted = toOrderedLabelsData(dashboard.validationStatus, ['valid', 'invalid', 'pending'], t);
        if (!formatted) return null;

        return {
            labels: formatted.labels,
            datasets: [{
                data: formatted.data,
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c'],
                borderColor: 'rgba(255, 255, 255, 0.38)',
                borderWidth: 2,
            }],
        };
    };

    const getProcessingStatusChart = () => {
        const formatted = toOrderedLabelsData(dashboard.processingStatus, ['queued', 'processing', 'processed', 'needs_validation', 'validated', 'rejected'], t);
        if (!formatted) return null;

        return {
            labels: formatted.labels,
            datasets: [{
                data: formatted.data,
                backgroundColor: ['#6c757d', '#3498db', '#2ecc71', '#f39c12', '#198754', '#e74c3c'],
                borderColor: 'rgba(255, 255, 255, 0.38)',
                borderWidth: 2,
            }],
        };
    };

    // Prepare chart data for Anomalies Rate by Doc Type
    const getAnomaliesRateChart = () => {
        const formatted = Array.isArray(dashboard.anomaliesRateByDocType)
            ? toLabelsDataFromArray(dashboard.anomaliesRateByDocType, 'docType', 'rate')
            : toLabelsData(dashboard.anomaliesRateByDocType, t);

        if (!formatted) return null;

        return {
            labels: formatted.labels,
            datasets: [{
                label: t('anomalyRate') || 'Anomaly Rate (%)',
                data: formatted.data,
                backgroundColor: '#e74c3c',
                borderColor: '#c0392b',
                borderWidth: 2,
            }],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                },
            },
        },
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };

    return (
        <Container fluid className="dashboard-page px-4 py-4">
            <FormEnterpriseModal isOpen={isCreatingEnterprise} toggle={() => setIsCreatingEnterprise(false)} />

            {dashboard.error && (
                <Alert color="danger" className="mb-4">
                    {typeof dashboard.error === 'string' ? dashboard.error : dashboard.error?.message || 'An error occurred'}
                </Alert>
            )}

            {dashboard.loading && (
                <div className="text-center py-5">
                    <Spinner color="primary" />
                </div>
            )}

            {!dashboard.loading && (
                <>
                    {/* Stats Cards */}
                    {dashboard.stats && (
                        <Row className="mb-4">
                            <Col md="3" className="mb-3">
                                <Card className="h-100 shadow-sm">
                                    <CardBody>
                                        <h5 className="text-muted">{t('totalDocuments') || 'Total Documents'}</h5>
                                        <h2 className="text-primary">{dashboard.stats.totalDocuments}</h2>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="3" className="mb-3">
                                <Card className="h-100 shadow-sm">
                                    <CardBody>
                                        <h5 className="text-muted">{t('conformityRate') || 'Conformity Rate'}</h5>
                                        <h2 className="text-success">{dashboard.stats.conformityRate}%</h2>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="3" className="mb-3">
                                <Card className="h-100 shadow-sm">
                                    <CardBody>
                                        <h5 className="text-muted">{t('anomaliesRate') || 'Anomalies Rate'}</h5>
                                        <h2 className="text-danger">{dashboard.stats.anomaliesRate}%</h2>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="3" className="mb-3">
                                <Card className="h-100 shadow-sm">
                                    <CardBody>
                                        <h5 className="text-muted">{t('totalAnomalies') || 'Total Anomalies'}</h5>
                                        <h2 className="text-warning">{dashboard.stats.totalAnomalies}</h2>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    <Row className="mb-4">
                        <Col md="3" className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <CardBody>
                                    <CardTitle>{t('documentsByType') || 'Documents by Type'}</CardTitle>
                                    {getDocumentsByTypeChart() ? (
                                        <Doughnut data={getDocumentsByTypeChart()} options={chartOptions} />
                                    ) : (
                                        <p className="text-muted">{t('noData') || 'No data available'}</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="3" className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <CardBody>
                                    <CardTitle>{t('anomaliesBySeverity') || 'Anomalies by Severity'}</CardTitle>
                                    {getAnomaliesBySeverityChart() ? (
                                        <Doughnut data={getAnomaliesBySeverityChart()} options={chartOptions} />
                                    ) : (
                                        <p className="text-muted">{t('noData') || 'No data available'}</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="3" className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <CardBody>
                                    <CardTitle>{t('validationStatus') || 'Validation Status'}</CardTitle>
                                    {getValidationStatusChart() ? (
                                        <Doughnut data={getValidationStatusChart()} options={chartOptions} />
                                    ) : (
                                        <p className="text-muted">{t('noData') || 'No data available'}</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="3" className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <CardBody>
                                    <CardTitle>{t('processingStatus') || 'Processing Status'}</CardTitle>
                                    {getProcessingStatusChart() ? (
                                        <Doughnut data={getProcessingStatusChart()} options={chartOptions} />
                                    ) : (
                                        <p className="text-muted">{t('noData') || 'No data available'}</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md="6">
                            <Card className="shadow-sm">
                                <CardBody>
                                    <CardTitle>{t('anomalyRateByDocType') || 'Anomaly Rate by Document Type'}</CardTitle>
                                    {getAnomaliesRateChart() ? (
                                        <Bar data={getAnomaliesRateChart()} options={barChartOptions} />
                                    ) : (
                                        <p className="text-muted">{t('noData') || 'No data available'}</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="3">
                            <Card className="shadow-sm">
                                <CardBody>
                                    <CardTitle>{t('topAnomalies') || 'Top Anomalies'}</CardTitle>
                                    {dashboard.topAnomalies && Array.isArray(dashboard.topAnomalies) && dashboard.topAnomalies.length > 0 ? (
                                        <Table striped hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>{t('type') || 'Type'}</th>
                                                    <th>{t('count') || 'Count'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboard.topAnomalies.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{typeof item.type === 'string' ? t(item.type) : typeof item.name === 'string' ? t(item.name): 'N/A'}</td>
                                                        <td>
                                                            <span className="">{item.count ? item.count : 0}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted">{t('noData') || 'No data available'}</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>

                        <Col md="3">
                            <Card className="shadow-sm">
                                <CardBody>
                                    <CardTitle>{t('suppliersAtRisk') || 'Suppliers at Risk'}</CardTitle>
                                    {dashboard.suppliersAtRisk && Array.isArray(dashboard.suppliersAtRisk) && dashboard.suppliersAtRisk.length > 0 ? (
                                        <Table striped hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>{t('supplier') || 'Supplier'}</th>
                                                    <th>{t('anomalies') || 'Anomalies'}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dashboard.suppliersAtRisk.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{typeof item.name === 'string' ? item.name : typeof item.supplier === 'string' ? item.supplier : 'N/A'}</td>
                                                        <td>
                                                            <span className="badge badge-warning">{typeof item.anomalyCount === 'number' ? item.anomalyCount : typeof item.count === 'number' ? item.count : 0}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    ) : (
                                        <p className="text-muted">{t('noData')}</p>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
}