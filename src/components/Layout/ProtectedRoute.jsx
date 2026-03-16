import React from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children }) {
    
    
    const token = localStorage.getItem('token');
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const pathname = useLocation().pathname;

    if (!token) {
        window.location.replace('/login'); // Prevent rendering children if token is expired
        return null;
    }
    
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp < currentTime) { // Check if token is expired
            console.error("ProtectedRoute: Token is expired, redirecting to login.");
            window.location.replace('/login'); // Prevent rendering children if token is expired
            localStorage.removeItem('token'); // Remove expired token
            return null;
        }
    } catch (error) {
         window.location.replace('/login'); // Prevent rendering children if token is expired
        return null;
    }

    return (
        <>
            {children}
        </>
    );
}