import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import { apiClient } from '../helpers/apiHelper';

/* -------------------------------------- */
import Dashboard from '../pages/Dashboard';
import Documents from '../pages/Documents';
import AddDocument from '../pages/Documents/addDocument';
import DocumentDetailsModal from '../pages/Documents/DocumentDetailsModal';
import Enterprise from '../pages/Enterprise';
import Layout from '../components/Layout';
import Auth from '../pages/Auth';
import AdminPanel from '../pages/AdminPanel';
import IndexPage from '../pages/Index';



const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={
                <IndexPage />
            } />
            <Route path="/login" element={
                <Auth />
            } />
            <Route path="/dashboard" element={
                <Layout>
                    <Dashboard />
                </Layout>
                } />
            <Route path="/documents" element={
                <Layout>
                    <Documents />
                </Layout>
                } />
            <Route path="/documents/add" element={
                <Layout>
                    <AddDocument />
                </Layout>
                } />
            <Route path="/document/:siret" element={
                <Layout>
                    <DocumentDetailsModal />
                </Layout>
                } />
            <Route path="/enterprise" element={
                <Layout>
                    <Enterprise />
                </Layout>
                } />
            <Route path="/adminpanel" element={
                <Layout>
                    <AdminPanel />
                </Layout>
                } />
            <Route path="*" element={
                <h1>404 - Page Not Found</h1>
            } />
        </Routes>
    );
}

export default AppRouter;