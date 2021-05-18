import React, { useState, useEffect } from 'react';

import '../1_AlbumPage/styles.css';
import TrackHeader from './TrackHeader';
import Error from '../0_MainPages/Error';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { getTrack, isLogged, deleteTrack } from '../api/api';
import { createNotification } from '../createNotification';


function TrackDetails(props) {
    const [track, setTrack] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const checkLogged = () => {
        if (localStorage.getItem('token')) {
            isLogged()
            .then(response => {
                setUser(response.data);
                setIsFav(track ? track.fans.includes(response.id) : false);
            })
            .catch(err => {
                setUser(null);
                setIsFav(false);
            })    
        }
        else {
            setUser(null);
            setIsFav(false);
        }
    }
  
    const getTrackAndUser = () => {
        getTrack(props.id)
        .then(response => {
            console.log(response);
            setTrack(response.data);
            setTimeout(()=>{checkLogged();}, 100);
        })
        .catch(err => {
            setTrack(null);
            setTimeout(()=>{checkLogged();}, 100);
        })
    }

    const deleteT = () => {
        deleteTrack(track.id)
        .then(response => {
            createNotification('success', 'OK', 'Track deleted successfully.');
            setTimeout(()=>{window.location.href='/'}, 500);
        })
        .catch(err => {
            createNotification('danger', 'Sorry,' , 'We could not delete your track.');
        })
    }

    useEffect(() => {
        getTrackAndUser();
    }, [])


    return(
        <div className="famous-skeleton">
            <TrackHeader track={track} user={user} />
            {!track &&
                <Error message='Oops, track not found...' />
            }
            {track && user && track.album.artist.id===user.id &&
                <Button variant='danger'
                        className='margin'
                        onClick={()=>{setShowModal(true)}}>
                    Delete track
                </Button>
            }
            {showModal &&
                <Modal.Dialog style={{'color': 'black', 'position': 'absolute', 'top': '100px'}}>
                    <Modal.Header>
                        <Modal.Title>Are you sure you want to delete your track?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>You cannot reverse this action.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                                onClick={()=>setShowModal(false)}>
                            No, I changed my mind.
                        </Button>
                        <Button variant="primary"
                                onClick={()=>{deleteT()}}>
                            Yes, delete it.
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            }
        </div>
    )
}

export default TrackDetails;