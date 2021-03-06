import React, { useState, useEffect } from 'react';

import { isLogged } from '../api/api';

import '../0_MainPages/styles.css';
import '../generalStyles.css';
import home from '../images/home.png';
import album from '../images/album.png';
import track from '../images/track.png';
import fav from '../images/fav.png';
import user_icon from '../images/user.png';
import logout_icon from '../images/logout.png';
import search from '../images/search.png';

import { createNotification } from '../createNotification';

function MyNavLink(props) {
    const redirect = () => {
        switch(props.name) {
            case('Favourites'):
                if (props.user) window.location.href=props.dest;
                else createNotification('danger', 'Sorry,', "You cannot have a favourites list without an account.");
                break;
            case('Logout'):
                localStorage.setItem('token', null);
                window.location.href='/';
                break;  
            default:
                window.location.href=props.dest;
                break;
        }
    }

    return(
        <button className={window.innerWidth>800 ? 'flex-layout navbar-link-side' : 'navbar-link-bottom'} onClick={redirect}>
            {props.icon &&
                <img src={props.icon} className='navbar-icon' alt={props.alt} />
            }
            {window.innerWidth>800 &&
                <div style={{'margin': '10px 5px'}}>
                    {props.name}
                </div>  
            }
        </button>
    )

}

function MyNavbar() {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        if (localStorage.getItem('token')) {
            isLogged()
            .then(response => {
                setUser(response.data);
            })
            .catch(err => {
                setUser(null);
            })    
        }
        else {
            setUser(null);
        }
    }, [])
    return(
        <div className={window.innerWidth > 800 ? 'my-navbar-side center-content' : 'my-navbar-bottom flex-layout center-content'}>
            <MyNavLink name='Johnify' dest='/' icon={home} user={user} alt='home' />
            <MyNavLink name='Albums' dest='/albums' icon={album} user={user} alt='albums' />
            <MyNavLink name='Tracks' dest='/tracks' icon={track} user={user} alt='tracks' />
            <MyNavLink name='Favourites' dest='/favs' icon={fav} user={user} alt='favourites' />
            <MyNavLink name='Search' dest='/search' icon={search} user={user} alt='search' />
            <MyNavLink case='user' name={user ? user.username: `Log in`} dest={user ? `/users/${user.id}`: '/login'} icon={user_icon}  user={user} alt='login/profile' />
            {user &&
                <MyNavLink name='Logout' icon={logout_icon} alt='logout' />
            }
        </div>
    )
}

export default MyNavbar; 