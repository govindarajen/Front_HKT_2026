import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    Button,
    CardTitle,

} from 'reactstrap';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, BarElement);
import DatePicker, { registerLocale } from "react-datepicker";
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import fr from 'date-fns/locale/fr';
import { useTranslation } from 'react-i18next';

// Configuration des jours et mois en français pour le DatePicker
const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

const locale = {
    localize: {
        day: n => days[n],
        month: n => months[n]
    },
    formatLong: {
        date: () => 'dd/MM/yyyy'
    }
};

// Importer et configurer la locale française
registerLocale('fr', fr);



export default function Dashboard() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { t } = useTranslation()

    const { pref } = useSelector((state) => state.account.value);
    const user = useSelector((state) => state.account.value);

    const [filterDate, setFilterDate] = useState(new Date());

    const date = moment(filterDate).format("DD/MM/YYYY");

    /* ---------------------------------------------------------- */

    return (
        <Container fluid className="dashboard-page px-4 py-4">

        </Container>
    );
}   