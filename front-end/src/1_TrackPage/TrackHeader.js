import React, { useState, useEffect } from 'react';

import '../1_AlbumPage/styles.css';
import track_icon from '../images/track.png';
import Card from 'react-bootstrap/Card';
import liked_icon from '../images/fav-checked.png'
import like from '../images/fav.png';

import { removeFavTrack, addFavTrack } from '../api/api';
import { createNotification } from '../createNotification';

function TrackHeader(props) {
    const [track, setTrack] = useState(props.track);
    const [user, setUser] = useState(props.user);
    const [liked, setLiked] = useState(false);

    const checkLiked = () => {
        if (props.track && props.user) {
            setLiked( props.track.fans.includes(props.user.id));
        }
    }

    const updateFavs = (data) => {
        console.log(data);
        const newFans = data;
        const newTrack = track;
        newTrack['fans'] = newFans;
        setTrack(newTrack);
        setTimeout(()=>{checkLiked();}, 100);
    }

    const updLike = () => {
        if (!user) {
            createNotification('danger', 'Sorry', 'You cannot do this without an account')
        }
        else {
            if (liked) {
                removeFavTrack(user.id, track.id)
                .then(response => {
                    updateFavs(response.data.fans);
                    createNotification('warning', 'Hello', 'Track removed from favourites.');
                })
                .catch(err => {
                    setLiked(false);
                })
            }
            else {
                addFavTrack(user.id, track.id)
                .then(response => {
                    updateFavs(response.data.fans);
                    createNotification('success', 'Hello', 'Track added to favourites.');
                })
                .catch(err => {
                    setLiked(true);
                })    
            }
        }
    }

    useEffect(() => {
        setTrack(props.track);
        setTimeout(()=>{checkLiked()}, 500);
    }, [props.track])

    useEffect(() => {
        setUser(props.user);
        setTimeout(()=>{checkLiked()}, 500);
    }, [props.user])

    return (
        <Card className="bg-dark text-white"
              style={{'width': '100%', 'height': '340px'}}>
            <Card.Img 
                style={{'height': 'inherit', 'width': '100%', 'objectFit': 'cover', 'opacity': '50%'}}
                src={track ? (track.photo_url || track_icon) : track_icon}
                alt="track" />
            <Card.ImgOverlay>
                <Card.Title style={{'fontSize': '50px'}}>{track ? track.title : null}</Card.Title>
                <Card.Text style={{'fontSize': '35px'}} className='with-whitespace flex-layout'>
                    <i>Artist: </i> 
                    <a  href={track ? `/users/${track.album.artist.id}` : '#'}
                        style={{'textDecoration': 'none', 'fontWeight': 'bold', 'color': 'white'}}>
                        {track ? track.album.artist.username : 'Unknown'}
                    </a>
                </Card.Text>
                <Card.Text style={{'fontSize': '35px'}} className='with-whitespace flex-layout'>
                    <i>Album: </i> 
                    <a  href={track ? `/albums/${track.album.id}` : '#'}
                        style={{'textDecoration': 'none', 'fontWeight': 'bold', 'color': 'white'}}>
                        {track ? track.album.title : 'Unknown'}
                    </a>
                </Card.Text>
                <Card.Text style={{'fontSize': '35px'}} className='with-whitespace flex-layout'>
                    {track && track.kinds.length>0 && <i>Kinds: </i>}
                    {track && track.kinds.map((value, index) => {
                        return(
                            <a  className='with-whitespace'
                                key={index}
                                href={track ? `/kinds/${value.id}` : '#'}
                                style={{'textDecoration': 'none', 'fontWeight': 'bold', 'color': 'white'}}>
                              {`${value.title}${index!==track.kinds.length-1 ? ', ' : ''}`}
                            </a>
                        )
                    })}
                </Card.Text>
                <div className='flex-layout'>
                    <input type='image'
                        alt='like-button'
                        style={{'height': '50px'}}
                        src={liked ? liked_icon : like}
                        onClick={updLike}
                    />
                    <div style={{'fontSize': '25px', 'marginTop': '5px'}}>
                        {track ? track.fans.length : 0}
                    </div>
                </div>
            </Card.ImgOverlay>
        </Card>
    )
}

export default TrackHeader;