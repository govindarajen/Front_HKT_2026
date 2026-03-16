import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    Button,

} from 'reactstrap';
import Footer from '../../components/Layout/Footer';
import { useNavigate } from 'react-router-dom';

export default function IndexPage() {

    const navigate = useNavigate();

    return (
        <>
        <Container className="indexPage p-0 m-0 vh-100 d-flex flex-column">
        </Container>
        </>
    );
}   