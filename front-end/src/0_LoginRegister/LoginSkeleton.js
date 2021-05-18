import React, { useEffect } from 'react';

import './styles.css';
import MyNavbar from '../0_Bars/MyNavbar';
import Login from './Login';
import Register from './Register';
import { isLogged } from '../api/api';

function LoginSkeleton(props) {

    useEffect(() => {
        if (localStorage.getItem('token')) {
            isLogged()
            .then(response => {
                window.location.href='/';
            })
            .catch(err => {
                ;
            })
        }
    }, [])
    return(
        <div className="home-page-desktop main flex-layout">
            
                <MyNavbar />
                { props.case==='login' &&
                    <Login />
                }
                {props.case==='register' &&
                    <Register />
                }
        </div>
    )
}

export default LoginSkeleton;