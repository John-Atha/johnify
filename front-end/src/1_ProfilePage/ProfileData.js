import React, { useState, useEffect } from 'react';

import './styles.css';
import AlbumsOrTracks from '../3_OneCategory/AlbumsOrTracks';
import Error from '../0_MainPages/Error';
import Button from 'react-bootstrap/Button';

import { userMakeArtist } from '../api/api';
import { createNotification } from '../createNotification';

function ProfileData(props) {
    const [user, setUser] = useState(props.user);
    const [myId, setMyId] = useState(props.myId);

    useEffect(() => {
        setUser(props.user);
    }, [props.user])

    useEffect(() => {
        setMyId(props.myId);
    }, [props.myId])

    const transformToArtist = () => {
        userMakeArtist(user.id)
        .then(response => {
            createNotification('success', 'Congratulations', 'You are an artist now!');
            setTimeout(()=>{window.location.reload();}, 1000);
        })
        .catch(err => {
            createNotification('danger', 'Sorry,', 'We could not update your account right now.');
        })
    }


        if (user.is_artist) {
            return (
                <div>
                    <AlbumsOrTracks how='user' case='albums' id={user.id} />
                    <AlbumsOrTracks how='user' case='tracks' id={user.id} />
                </div>
            )    
        }
        else {
            if (user.id===myId) {
                return (
                    <div>
                        <Error message='You have to be an artist to upload albums and songs' />
                        <Button className='margin-top'
                                variant='success'
                                onClick={transformToArtist} >
                            Transform to artist account
                        </Button>
                    </div>
                )
            }
            else {
                return (
                    <div>
                        <Error message='User is not an artist.' />
                    </div>
                )    
            }
        }

}

export default ProfileData;