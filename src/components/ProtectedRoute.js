import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Route, useNavigate } from 'react-router-dom';
import Login from '../pages/login/Login';

const ProtectedRoute = ({ children, ...rest }) => {
    const navigate = useNavigate()
    // Simulate authentication check, replace with your actual authentication logic
    //   const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const auth = useSelector(
        state => state.user
    )
    useEffect(() => {
        if (!auth) {
            // Simulate login, replace with your actual login logic
            navigate("/login");
        }
    }, [auth])

    return auth ? children : <></>
};

export default ProtectedRoute;


