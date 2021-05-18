import React, { useState, useEffect } from 'react';

import './styles.css';
import AlbumHeader from './AlbumHeader';
import AlbumTracks from './AlbumTracks';
import Error from '../0_MainPages/Error';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { getAlbum, isLogged, getAlbumTracks, deleteAlbum } from '../api/api';
import { createNotification } from '../createNotification';


function AlbumDetails(props) {
    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const checkLogged = () => {
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
    }

    const deleteA = () => {
        deleteAlbum(album.id)
        .then(response => {
            createNotification('success', 'OK', 'Album deleted successfully.');
            setTimeout(()=>{window.location.href='/'}, 500);
        })
        .catch(err => {
            createNotification('danger', 'Sorry', 'We could not delete your album');
            setTimeout(()=>{window.location.href='/'}, 500);
        })
    }

    const getAlbumTracksData = () => {
        getAlbumTracks(props.id)
        .then(response => {
            console.log(response);
            setTracks(response.data);
        })
        .catch(err => {
            console.log(err);
        })
    }
    
    const getAlbumAndUser = () => {
        getAlbum(props.id)
        .then(response => {
            setAlbum(response.data);
            getAlbumTracksData();
            setTimeout(()=>{checkLogged();}, 100);
        })
        .catch(err => {
            setAlbum(null);
            setTimeout(()=>{checkLogged();}, 100);
        })
    }

    useEffect(() => {
        getAlbumAndUser();
    }, [])


    return(
        <div className="famous-skeleton">
            <AlbumHeader album={album} tracks={tracks} user={user} />
            {!album &&
                <Error message='Oops, album not found...' />
            }
            {album && user && album.artist.id===user.id &&
                <Button variant='danger'
                        className='margin'
                        onClick={()=>{setShowModal(true)}}>
                    Delete Album
                </Button>
            }
            {showModal &&
                <Modal.Dialog style={{'color': 'black', 'position': 'absolute', 'top': '100px'}}>
                    <Modal.Header>
                        <Modal.Title>Are you sure you want to delete your album?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>All of its tracks will be lost.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"
                                onClick={()=>setShowModal(false)}>
                            No, I changed my mind.
                        </Button>
                        <Button variant="primary"
                                onClick={()=>{deleteA()}}>
                            Yes, delete it.
                        </Button>
                    </Modal.Footer>
                </Modal.Dialog>
            }
            {album!==null && tracks.length!==0 &&
                <AlbumTracks tracks = {tracks} user={user} />            
            }
            {album!==null && !tracks.length &&
                <Error message='Oops, no tracks found here...' />
            }
        </div>
    )
}

export default AlbumDetails;