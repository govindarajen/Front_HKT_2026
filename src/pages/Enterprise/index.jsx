import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container,
    Card,
    CardBody,
    Col,
    Row,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';

import { useTranslation } from 'react-i18next';
import { getUsersRequest } from '../../redux/users/userReducer';
import { apiClient } from '../../helpers/apiHelper';
import TableList from '../../components/ui/tables/TableList';
import { ToastContainer, toast } from 'react-toastify';

export default function Enterprise() {
    const dispatch = useDispatch();

    const { t } = useTranslation();

    const user = useSelector((state) => state.account.value);
    const users = useSelector((state) => state.account.users) || [];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isRemoving, setIsRemoving] = useState(false);
    const [removeError, setRemoveError] = useState(null);

    useEffect(() => {
        dispatch(getUsersRequest());
    }, [dispatch]);

    const ownerRights = ['enterprise_d', 'enterprise_r', 'enterprise_w', 'enterprise_c'];
    const isOwner = ownerRights.every((right) => (user?.rights || []).includes(right));

    const enterpriseId = user?.enterpriseId?._id || user?.enterpriseId || null;

    const enterpriseUsers = useMemo(() => {
        if (!enterpriseId) return [];

        return users.filter((candidate) => {
            const candidateEnterpriseId = candidate?.enterpriseId?._id || candidate?.enterpriseId || null;
            return String(candidateEnterpriseId || '') === String(enterpriseId);
        });
    }, [enterpriseId, users]);

    const availableUsers = useMemo(() => {
        return users.filter((candidate) => {
            const candidateEnterpriseId = candidate?.enterpriseId?._id || candidate?.enterpriseId || null;
            return !candidateEnterpriseId;
        });
    }, [users]);

    const tableColumns = [
        { label: t('fullName'), field: 'fullName', type: 'text' },
        { label: t('username'), field: 'username', type: 'text' },
    ];

    const toggleModal = () => {
        setIsModalOpen((prev) => !prev);
        setError(null);
        setSelectedUserId('');
    };

    const handleAddMember = async () => {
        if (!selectedUserId || !enterpriseId) {
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await apiClient.post('/membership-requests', {
                targetUserId: selectedUserId,
            });

            dispatch(getUsersRequest());
            toggleModal();
            toast.success(t('addMemberRequestSuccess'));
        } catch (apiError) {
            const message = apiError?.response?.data?.message || t('addMemberRequestError');
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const openRemoveModal = (member) => {
        if (!isOwner || !member?._id || String(member._id) === String(user?._id)) { // Prevent owners from removing themselves or non-members
            toast.error(t('cannotRemoveMember'));
            return;
        }

        setSelectedMember(member);
        setRemoveError(null);
        setIsRemoveModalOpen(true);
    };

    const closeRemoveModal = () => {
        setIsRemoveModalOpen(false);
        setSelectedMember(null);
        setRemoveError(null);
    };

    const handleRemoveMember = async () => {
        if (!selectedMember?._id) {
            return;
        }

        try {
            setIsRemoving(true);
            setRemoveError(null);

            await apiClient.put('/users/updateUser', {
                userId: selectedMember._id,
                fields: {
                    enterpriseId: null,
                },
            });

            

            dispatch(getUsersRequest());
            closeRemoveModal();

            toast.success(t('removeMemberSuccess'));
        } catch (apiError) {
            const message = apiError?.response?.data?.message || t('removeMemberError');
            setRemoveError(message);
        } finally {
            setIsRemoving(false);
        }
    };

    return (
        <Container fluid className="dashboard-page px-4 py-4">
            <Row>
                <Col xl={12} sm={12}>
                    <Card className="b-4">
                        <CardBody>
                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                <h5 className='mb-0'>{t('enterpriseMembers')}</h5>

                                {isOwner && (
                                    <Button color='primary' onClick={toggleModal}>
                                        {t('addEnterpriseMember')}
                                    </Button>
                                )}
                            </div>

                            {enterpriseUsers.length > 0 ? (
                                <TableList
                                    data={enterpriseUsers}
                                    columns={tableColumns}
                                    onRowClick={openRemoveModal}
                                />
                            ) : (
                                <p className='mb-0'>
                                    {isOwner ? t('noEnterpriseMembers') : t('notMemberOfAnyEnterprise')}
                                </p>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal isOpen={isModalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>{t('addEnterpriseMember')}</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for='enterprise-user-select'>{t('selectUser')}</Label>
                        <Input
                            id='enterprise-user-select'
                            type='select'
                            value={selectedUserId}
                            onChange={(event) => setSelectedUserId(event.target.value)}
                        >
                            <option value=''>{t('selectUser')}</option>
                            {availableUsers.map((candidate) => (
                                <option key={candidate._id} value={candidate._id}>
                                    {candidate.fullName} ({candidate.username})
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                    {error && <p className='text-danger mb-0'>{error}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={toggleModal}>
                        {t('cancel')}
                    </Button>
                    <Button
                        color='primary'
                        onClick={handleAddMember}
                        disabled={isSubmitting || !selectedUserId}
                    >
                        {isSubmitting ? t('uploading') : t('sendRequest')}
                    </Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={isRemoveModalOpen} toggle={closeRemoveModal}>
                <ModalHeader toggle={closeRemoveModal}>{t('removeEnterpriseMemberTitle')}</ModalHeader>
                <ModalBody>
                    <p className='mb-2'>
                        {t('removeEnterpriseMemberMessage', {
                            fullName: selectedMember?.fullName || '-',
                            username: selectedMember?.username || '-',
                        })}
                    </p>
                    {removeError && <p className='text-danger mb-0'>{removeError}</p>}
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={closeRemoveModal} disabled={isRemoving}>
                        {t('cancel')}
                    </Button>
                    <Button color='danger' onClick={handleRemoveMember} disabled={isRemoving || !selectedMember?._id}>
                        {isRemoving ? t('uploading') : t('removeMember')}
                    </Button>
                </ModalFooter>
            </Modal>
            <ToastContainer 
                position="top-right"
                autoClose={5000}

            />
        </Container>
    );
}