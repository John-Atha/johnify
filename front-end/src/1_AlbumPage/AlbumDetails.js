import React, { useState, useEffect } from 'react';

import './styles.css';
import AlbumHeader from './AlbumHeader';
import AlbumTracks from './AlbumTracks';

import { getAlbum, isLogged, getAlbumTracks } from '../api/api';
import Error from '../0_MainPages/Error';


function AlbumDetails(props) {
    const [album, setAlbum] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [isFav, setIsFav] = useState(false);
    const [user, setUser] = useState(null);

    const checkLogged = () => {
        if (localStorage.getItem('token')) {
            isLogged()
            .then(response => {
                setUser(response.data);
                setIsFav(album ? album.fans.includes(response.id) : false);
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