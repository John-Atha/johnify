import React, { useState, useEffect } from 'react';

import './styles.css';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Results from './Results';

import { getAlbumsRanking, getTracksRanking } from '../api/api';

function SearchBar(props) {
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [text, setText] = useState('');
    const [matchingAlbums, setMatchingAlbums] = useState([]);
    const [matchingTracks, setMatchingTracks] = useState([]);

    const getAlbums = () => {
        getAlbumsRanking()
        .then(response => {
            setAlbums(response.data);
            setMatchingAlbums(response.data.slice(0,5));
        })
        .catch(err => {
            setAlbums([]);
        })
    }

    const getTracks = () => {
        getTracksRanking()
        .then(response => {
            setTracks(response.data);
            setMatchingTracks(response.data.slice(0,5));
        })
        .catch(err => {
            setTracks([]);
        })
    }

    const match = (s, currText) => {
        if (currText) {
            return( s.startsWith(currText.charAt(0).toUpperCase()+currText.slice(1)) ||
                    s.startsWith(currText.charAt(0).toLowerCase()+currText.slice(1)));
        }
        else {
            return true;
        }
    }

    const update = (event) => {
        console.log(event.target.value);
        setText(event.target.value);
        const tempAlbums = [];
        const tempTracks = [];

        albums.forEach((album) => {
            if (match(album.title, event.target.value) && tempAlbums.length<5) tempAlbums.push(album);
        })
        tracks.forEach((track) => {
            if (match(track.title, event.target.value) && tempTracks.length<5) tempTracks.push(track);
        })
        console.log(tempAlbums);
        console.log(tempTracks);
        setMatchingAlbums(tempAlbums);
        setMatchingTracks(tempTracks);
        
    }

    useEffect(() => {
        getAlbums();
        getTracks();
    }, [])

    return (
        <div className='margin-top'>
            <Form onSubmit={(event) => {event.preventDefault();}} className="flex-layout marign-top-smaller">
                <FormControl 
                    style={{'width': '270px', 'marginLeft': 'auto', 'marginRight': 'auto'}}
                    type='search'
                    placeholder='Search for a track or an album'
                    value={text}
                    className="mr-sm-2 center-content"
                    onChange={(event)=>{update(event); console.log('updated');}}
                />
            </Form>
            <Results playing={props.playing} upd={props.upd} albums={matchingAlbums} tracks={matchingTracks} />
        </div>
    )
}

export default SearchBar;