import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, registerRequest, clearAuthError } from '../../redux/users/userReducer';

import { Col, Container, Row } from 'reactstrap';
import { Spinner } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';


export default function Auth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [isEnterpriseOwner, setIsEnterpriseOwner] = useState(false);
    const {error, value} = useSelector((state) => state.account);
    const loading = useSelector((state) => state.account.loading);
    
    const handleLogin = (username, password) => {
        dispatch(loginRequest({ username, password }));
    }

    const handleRegister = ({ username, password, fullName }) => {
        dispatch(registerRequest({
            username,
            password,
            fullName,
            isEnterpriseOwner,
        }));
    }

    // Navigate after successful login/register
    useEffect(() => {
        if (value && value.username && !loading) {
            navigate('/dashboard');
        }
    }, [value, loading, navigate]);

    useEffect( () => {
        if (error) {
            if(error.includes('404')) {
                toast.error(t('authUserNotFound'));
            } else if (error.includes('401')) {
                toast.error(t('authInvalidCredentials'));
            } else if (error.toLowerCase().includes('409')) {
                toast.error(t('authUserAlreadyExists'));
            } else {
                toast.error(error);
            }
            dispatch(clearAuthError());
        }
    }, [error, dispatch, t])

    return (
        <>
            <Container className='w-100 vh-100 d-flex justify-content-center align-items-center p-0' id="authenticationPage">
                <Row className='w-100 h-100 p-0'>
                    <Col lg={3} xl={3} className='p-0 d-none d-xl-block'>
                        <div className='authSideBanner h-100 d-flex flex-column justify-content-center align-items-end p-5'>
                            <h1 className='bannerTitle'>Hackathon</h1>
                            <p className='bannerText'>{t('authBannerText')}</p>
                        </div>
                    </Col>
                    <Col xs={12} xl={9} className='h-100 d-flex flex-column justify-content-center align-items-center p-3 pt-4'>
                        <h1 className='title'>{isRegisterMode ? t('createAccount') : t('connection')}</h1>
                        <form 
                            className='loginForm'
                            onSubmit={(e) => {
                                e.preventDefault();
                                const username = e.target.username.value;
                                const password = e.target.password.value;
                                if (isRegisterMode) {
                                    const fullName = e.target.fullName.value;
                                    handleRegister({ username, password, fullName });
                                } else {
                                    handleLogin(username, password);
                                }
                                }
                            }
                        >
                            {isRegisterMode && (
                                <div className='inputGroupForm'>
                                    <label className='labelForm' htmlFor="fullName">{t('fullName')}</label>
                                    <input className='inputForm' type="text" id="fullName" name="fullName" required />
                                </div>
                            )}
                            <div className='inputGroupForm'>
                                <label className='labelForm' htmlFor="username">{t("username")}</label>
                                <input className='inputForm' type="text" id="username" name="username" required />
                            </div>
                            <div className='inputGroupForm'>
                                <label className='labelForm' htmlFor="password">{t("password")}</label>
                                <input className='inputForm' type="password" id="password" name="password" minLength={6} required />
                            </div>

                            {isRegisterMode && (
                                <div className='inputGroupForm roleSwitchGroup'>
                                    <div className='form-check form-switch roleSwitch'>
                                        <input
                                            className='form-check-input'
                                            type='checkbox'
                                            role='switch'
                                            id='accountTypeSwitch'
                                            checked={isEnterpriseOwner}
                                            onChange={(e) => setIsEnterpriseOwner(e.target.checked)}
                                        />
                                        <label className='form-check-label' htmlFor='accountTypeSwitch'>
                                            {isEnterpriseOwner ? t('enterpriseOwner') : t('employee')}
                                        </label>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <Spinner className='mt-3 spinnerAuth' />
                            ) : (
                               <button className='submitBtn' type="submit">{isRegisterMode ? t('createAccount') : t("login")}</button>
                            )}

                            <button
                                type='button'
                                className='switchAuthModeBtn mt-3'
                                onClick={() => setIsRegisterMode((prev) => !prev)}
                            >
                                {isRegisterMode ? t('alreadyHaveAccount') : t('dontHaveAccount')}
                            </button>
                        </form>

                    </Col>

                    <ToastContainer />
                </Row>
            </Container>

        </>
    )
}