import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest, clearAuthError } from '../../redux/users/userReducer';

import { Col, Container, Row } from 'reactstrap';
import { Spinner } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useTranslation } from 'react-i18next';


export default function Auth() {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const user = useSelector((state) => state.account.value);
    const {error} = useSelector((state) => state.account);
    const loading = useSelector((state) => state.account.loading);
    
    const handleLogin = (username, password) => {
        dispatch(loginRequest({ username, password, navigate }));
    }

    useEffect( () => {
        if (error) {
            if(error.includes('404')) {
                toast.error("Utilisateur non trouvé");
            } else if (error.includes('401')) {
                toast.error("Identifiants invalides");
            }
            dispatch(clearAuthError());
        }
    }, [error])

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
                        <h1 className='title'>{t("connection")}</h1>
                        <form 
                            className='loginForm'
                            onSubmit={(e) => {
                                e.preventDefault();
                                const username = e.target.username.value;
                                const password = e.target.password.value;
                                handleLogin(username, password);
                                }
                            }
                        >
                            <div className='inputGroupForm'>
                                <label className='labelForm' htmlFor="username">{t("username")}</label>
                                <input className='inputForm' type="text" id="username" name="username" required />
                            </div>
                            <div className='inputGroupForm'>
                                <label className='labelForm' htmlFor="username">{t("password")}</label>
                                <input className='inputForm' type="password" id="password" name="password" required />
                            </div>
                            {loading ? (
                                <Spinner className='mt-3 spinnerAuth' />
                            ) : (
                               <button   className='submitBtn' type="submit">{t("login")}</button>
                            )}
                        </form>

                    </Col>

                    <ToastContainer />
                </Row>
            </Container>

        </>
    )
}