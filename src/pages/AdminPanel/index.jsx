import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    Button,

} from 'reactstrap';

export default function AdminPanel() {


    return (
        <Container className='w-100 h-100 d-flex m-0 p-0 justify-content-center'>
            <Row className="w-100">
                <Col>
                    <Card>
                        <CardBody className='p-0'>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}   