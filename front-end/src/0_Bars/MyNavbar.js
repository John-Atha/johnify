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
    return(
        <div className='flex-layout navbar-link'>
            {props.icon &&
                <img src={props.icon} className='navbar-icon' />
            }
            {props.name==='Logout' &&
                <a className='navbar-link'
                   onClick={()=>{localStorage.setItem('token', null); window.location.href='/';}}>
                    {props.name}
                </a>
            }
            { props.name!=='Logout' && props.name==='Favourites' &&
                <a className='navbar-link'
                        onClick={()=> {
                             if (props.user) window.location.href=props.dest;
                             else createNotification('danger', 'Sorry,', "You cannot have a favourites list without an account.");
                        }}>
                    Favourites
                </a>
            }
            { props.name!=='Logout' && props.name!=='Favourites' && props.case==='user' &&
                <a className='navbar-link' href={props.dest}>{props.name}</a>
            }
            { props.name!=='Logout' && props.name!=='Favourites' &&props.case!=='user' &&
                <a className='navbar-link' href={props.dest}>{props.name}</a>
            }
        </div>
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
        <div className='my-navbar center-content'>
            <MyNavLink name='Johnify' dest='/' icon={home} user={user} />
            <MyNavLink name='Albums' dest='/albums' icon={album} user={user} />
            <MyNavLink name='Tracks' dest='/tracks' icon={track} user={user} />
            <MyNavLink name='Favourites' dest='/favs' icon={fav} user={user} />
            <MyNavLink name='Search' dest='/search' icon={search} user={user} />
            <MyNavLink case='user' name={user ? user.username: `Log in`} dest={user ? `/users/${user.id}`: '/login'} icon={user_icon}  user={user}/>
            {user &&
                <MyNavLink name='Logout' icon={logout_icon} />
            }
        </div>
    )
}

export default MyNavbar; 