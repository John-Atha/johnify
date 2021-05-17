import React, { useEffect } from 'react';

import './styles.css';
import MyNavbar from '../0_Bars/MyNavbar';
import MusicPlayer from '../0_Bars/MusicPlayer';
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
        <div className="home-page-desktop">
            
            <div className="main flex-layout">
                <MyNavbar />
                { props.case==='login' &&
                    <Login />
                }
                {props.case==='register' &&
                    <Register />
                }
            </div>

            <MusicPlayer />
        </div>
    )
}

export default LoginSkeleton;