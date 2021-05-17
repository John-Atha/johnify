import React, { useState, useEffect } from 'react';

import { isLogged } from '../api/api';

import '../0_MainPages/styles.css';
import '../generalStyles.css';
import home from '../images/home.png';
import album from '../images/album.png';
import track from '../images/track.png';
import fav from '../images/fav.png';
import user_icon from '../images/user.png';

function MyNavLink(props) {
    return(
        <div className='flex-layout navbar-link'>
            {props.icon &&
                <img src={props.icon} className='navbar-icon' />
            }
            {props.case==='user' && props.user!==null &&
                <a className='navbar-link' href={props.dest}>{props.name}</a>
            }
            {props.case==='user' && !props.user &&
                <a aria-disabled={true} className='navbar-link' href='#' style={{'color': 'rgb(237, 112, 112)'}}>{props.name}</a>
            }
            {props.case!=='user' &&
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
            <MyNavLink case='user' name={user ? user.username: `Not logged in`} dest={user ? `/users/${user.id}`: null} icon={user_icon}  user={user}/>
        </div>
    )
}

export default MyNavbar; 