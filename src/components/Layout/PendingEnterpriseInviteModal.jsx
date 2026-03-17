import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { apiClient } from '../../helpers/apiHelper';
import { setUserEnterprise } from '../../redux/users/userReducer';

export default function PendingEnterpriseInviteModal() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const user = useSelector((state) => state.account.value);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const hasEnterprise = Boolean(user?.enterpriseId?._id || user?.enterpriseId);

    const activeRequest = useMemo(() => {
        return requests.length > 0 ? requests[0] : null;
    }, [requests]);

    const fetchPendingRequests = async () => {
        if (!user?._id || hasEnterprise) {
            setRequests([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await apiClient.get('/membership-requests/my-pending');
            setRequests(response?.data?.requests || []);
        } catch (apiError) {
            const message = apiError?.response?.data?.message || t('membershipRequestLoadError');
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, [user?._id, hasEnterprise]);

    const handleResponse = async (decision) => {
        if (!activeRequest?._id) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.post(`/membership-requests/${activeRequest._id}/respond`, {
                decision,
            });

            if (decision === 'accepted') {
                const nextEnterpriseId = response?.data?.user?.enterpriseId;
                if (nextEnterpriseId) {
                    dispatch(setUserEnterprise(nextEnterpriseId));
                }
            }

            await fetchPendingRequests();
        } catch (apiError) {
            const message = apiError?.response?.data?.message || t('membershipRequestResponseError');
            setError(message);
            setLoading(false);
        }
    };

    if (!activeRequest || hasEnterprise) {
        return null;
    }

    return (
        <Modal isOpen={Boolean(activeRequest)} backdrop='static' keyboard={false}>
            <ModalHeader>{t('enterpriseInvitationTitle')}</ModalHeader>
            <ModalBody>
                <p className='mb-2'>
                    {t('enterpriseInvitationMessage', {
                        enterprise: activeRequest?.enterpriseId?.lib || '-',
                        requestedBy: activeRequest?.requestedBy?.fullName || activeRequest?.requestedBy?.username || '-',
                    })}
                </p>
                {error && <p className='text-danger mb-0'>{error}</p>}
            </ModalBody>
            <ModalFooter>
                <Button color='secondary' onClick={() => handleResponse('rejected')} disabled={loading}>
                    {t('reject')}
                </Button>
                <Button color='primary' onClick={() => handleResponse('accepted')} disabled={loading}>
                    {loading ? t('uploading') : t('accept')}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
