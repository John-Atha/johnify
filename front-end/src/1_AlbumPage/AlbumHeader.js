import React, { useState, useEffect } from 'react';

import './styles.css';
import album_icon from '../images/album.png';
import Card from 'react-bootstrap/Card';
import liked_icon from '../images/fav-checked.png'
import like from '../images/fav.png';

import { removeFavAlbum, addFavAlbum } from '../api/api';
import { createNotification } from '../createNotification';

function AlbumHeader(props) {
    const [album, setAlbum] = useState(props.album);
    const [tracks, setTracks] = useState(props.tracks);
    const [user, setUser] = useState(props.user);
    const [liked, setLiked] = useState(false);

    const checkLiked = () => {
        if (props.album && props.user) {
            //console.log(album)
            setLiked( props.album.fans.includes(props.user.id));
        }
    }

    const updateFavs = (data) => {
        console.log(data);
        const newFans = data;
        const newAlb = album;
        newAlb['fans'] = newFans;
        setAlbum(newAlb);
        setTimeout(()=>{checkLiked();}, 100);
    }

    const updLike = () => {
        if (!user) {
            createNotification('danger', 'Sorry', 'You cannot do this without an account')
        }
        else {
            if (liked) {
                removeFavAlbum(user.id, album.id)
                .then(response => {
                    updateFavs(response.data.fans);
                })
                .catch(err => {
                    setLiked(false);
                })
            }
            else {
                addFavAlbum(user.id, album.id)
                .then(response => {
                    updateFavs(response.data.fans);
                })
                .catch(err => {
                    setLiked(true);
                })    
            }
        }
    }

    useEffect(() => {
        setAlbum(props.album);
        setTimeout(()=>{checkLiked()}, 500);
    }, [props.album])

    useEffect(() => {
        setTracks(props.tracks);
        setTimeout(()=>{checkLiked()}, 500);
    }, [props.tracks])

    useEffect(() => {
        setUser(props.user);
        setTimeout(()=>{checkLiked()}, 500);
    }, [props.user])

    return (
        <Card className="bg-dark text-white"
              style={{'width': '100%', 'height': '300px'}}>
            <Card.Img 
                style={{'height': 'inherit', 'width': '100%', 'objectFit': 'cover', 'opacity': '50%'}}
                src={album ? (album.photo_url || album_icon) : album_icon}
                alt="Album" />
            <Card.ImgOverlay>
                <Card.Title style={{'fontSize': '50px'}}>{album ? album.title : null}</Card.Title>
                <Card.Text style={{'fontSize': '35px'}} className='with-whitespace flex-layout'>
                    <i>Artist: </i> 
                    <a  href={album ? `/users/${album.artist.id}` : '#'}
                        style={{'textDecoration': 'none', 'fontWeight': 'bold', 'color': 'white'}}>
                        {album ? album.artist.username : 'Unknown'}
                    </a>
                </Card.Text>
                <Card.Text style={{'fontSize': '35px'}}>
                    <i>Tracks:</i> {tracks ? tracks.length : 0}
                </Card.Text>
                <div className='flex-layout'>
                    <input type='image'
                        style={{'height': '50px'}}
                        alt='like-button'
                        src={liked ? liked_icon : like}
                        onClick={updLike}
                    />
                    <div style={{'fontSize': '25px', 'marginTop': '5px'}}>
                        {album ? album.fans.length : 0}
                    </div>
                </div>
            </Card.ImgOverlay>
        </Card>
    )
}

export default AlbumHeader;