import React, { useState, useEffect } from 'react';

import './styles.css';
import album_icon from '../images/album.png';
import Card from 'react-bootstrap/Card';

function AlbumHeader(props) {
    const [album, setAlbum] = useState(props.album);
    const [tracks, setTracks] = useState(props.tracks);
    const [user, setUser] = useState(props.user);
    useEffect(() => {
        setAlbum(props.album);
    }, [props.album])

    useEffect(() => {
        setTracks(props.tracks);
    }, [props.tracks])

    useEffect(() => {
        setUser(props.user);
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
                    <a  href={album ? `/artists/${album.artist.id}` : '#'}
                        style={{'textDecoration': 'none', 'fontWeight': 'bold', 'color': 'white'}}>
                        {album ? album.artist.username : 'Unknown'}
                    </a>
                </Card.Text>
                <Card.Text style={{'fontSize': '35px'}}>
                    <i>Tracks:</i> {tracks ? tracks.length : 0}
                </Card.Text>
            </Card.ImgOverlay>
        </Card>
    )
}

export default AlbumHeader;