import React from 'react';
import NavBar from './Navbar';
import { Container } from 'reactstrap';
import ProtectedRoute from './ProtectedRoute';
import Footer from './Footer';
import { useSelector } from 'react-redux';
import PendingEnterpriseInviteModal from './PendingEnterpriseInviteModal';

export default function Layout({ children }) {

        const { pref } = useSelector((state) => state.account.value);

    return (
        <Container id="layoutContainer" className="d-flex flex-column vh-100 w-100 m-0 p-0">
            <ProtectedRoute>
                <NavBar />
                <PendingEnterpriseInviteModal />
                        {children}
                <Footer />
            </ProtectedRoute>
        </Container>
    )
}