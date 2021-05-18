import React, { useState, useEffect } from 'react';

import './styles.css';
import Error from '../0_MainPages/Error';
import ProfileHeader from './ProfileHeader';
import ProfileData from './ProfileData';
import Button from 'react-bootstrap/Button';

import { isLogged, getUser } from '../api/api';

function ProfileSkeleton(props) {
    const [id, setId] = useState(props.id);
    const [user, setUser] = useState(null);
    const [myId, setMyId] = useState(null);

    const checkLogged = () => {
        if (localStorage.getItem('token')) {
            isLogged()
            .then(response=> {
                setMyId(response.data.id);
            })
            .catch(err => {
                setMyId(null);
            })
        }
    }

    const getProfile = () => {
        getUser(id)
        .then(response => {
            setUser(response.data);
        })
        .catch(err => {
            ;
        })
    }

    useEffect(() => {
        getProfile();
        checkLogged();
    }, [])


    if (user) {
        return(
            <div className='famous-skeleton'>
                <ProfileHeader user={user} myId={myId} />
                {user.id===myId && user.is_artist &&
                    <div>
                        <h4>Feeling creative?</h4>
                        <Button variant='success' className='margin'>Upload a new album</Button>
                        <Button variant='success' className='margin'>Upload a new track</Button>
                    </div>
                }
                <ProfileData user={user} myId={myId} />
            </div>
        )    
    }
    else{
        return(
            <Error message='Oops, user not found.' />
        )
    }
}

export default ProfileSkeleton;