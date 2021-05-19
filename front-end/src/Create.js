import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Error from './0_MainPages/Error';
import Album from './3_OneCategory/Album';

import { isLogged, createAlbum, createTrack, getUserAlbums, getKinds, addTrackKinds } from './api/api';
import { createNotification } from './createNotification';

function Create(props) {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState('');
    const [what, setWhat] = useState('album');
    const [err, setErr] = useState(false);
    const [albums, setAlbums] = useState([]);
    const [chosenAlbum, setChosenAlbum] = useState(null);
    const [kinds, setKinds] = useState([]);
    const [currKind, setCurrKind] = useState(null);

    const checkLogged = () => {
        isLogged()
        .then(response => {
            setUser(response.data);
            setTimeout(()=>{getAlbums(response.data.id)}, 0);
            if (!response.data.is_artist) {
                setErr('You need to be an artist to upload your art.\nUpdate your account at your profile page.')
            }
        })
        .catch(err => {
            window.location.href='/';
        })
    }

    const getAlbums = (id) => {
        getUserAlbums(id, null, null)
        .then(response => {
            console.log(response);
            setAlbums(response.data);
            setChosenAlbum( response.data.length ? response.data[0].id : null);
        })
        .catch(err => {
            setAlbums([]);
        })
    }

    const getAllKinds = () => {
        getKinds()
        .then(response => {
            console.log(response);
            setKinds(response.data);
            setCurrKind(response.data.length>0 ? response.data[0].id : null);
        })
    }


    useEffect(() => {
        checkLogged();
        getAllKinds();
    }, [])

    const submit = (event) => {
        event.preventDefault();
        if (what==='album') {
            const input = document.getElementById('album-photo');
            let img = null;
            if (input.files.length) img=input.files[0];
            console.log(title);
            console.log(img);
            createAlbum(title, img)
            .then(response => {
                createNotification('success', 'Congratulations!', 'Your album has just been uploaded!');
                setTimeout(()=>{window.location.href=`/albums/${response.data.id}`}, 500);
            })
            .catch(err => {
                console.log(err);
                createNotification('danger', 'Sorry,', 'We could not upload your album.');
            })
        }
        else {
            const input1 = document.getElementById('track-photo');
            const input2 = document.getElementById('track-audio');
            let img = null;
            let audio = null;
            if (input1.files.length) img=input1.files[0];
            if (input2.files.length) audio=input2.files[0];
            console.log(title);
            console.log(img);
            console.log(audio);
            console.log(chosenAlbum);
            createTrack(title, img, audio, chosenAlbum)
            .then(response => {
                if (currKind) {
                    addTrackKinds(response.data.id, {kinds:[parseInt(currKind)]})
                    .then(response => {
                        console.log(response);
                        createNotification('success', 'Congratulations!', 'Your track has just been uploaded!');
                        setTimeout(()=>{window.location.href=`/tracks/${response.data.id}`}, 500);
                    })
                    .catch(err => {
                        console.log(err);
                        createNotification('success', 'Congratulations!', 'Your track has just been uploaded!');
                        setTimeout(()=>{window.location.href=`/tracks/${response.data.id}`}, 500);    
                    })                    
                }
                else {
                    console.log('no kinds')
                    createNotification('success', 'Congratulations!', 'Your track has just been uploaded!');
                    setTimeout(()=>{window.location.href=`/tracks/${response.data.id}`}, 500);    
                }
            })
            .catch(err => {
                console.log(err);
                if (err.response.status===400)
                createNotification('danger', 'Sorry,', err.response.data);
            })
        }
    }

    return (
        <div className='famous-skeleton center-content' style={{'paddingBottom': '10px'}}>
            <h3 className='margin-top'>Hello, {user ? user.username : ''}<br></br> Feel free to share your art with us!</h3>
            {!err &&
                <div>
                    <Button variant={ what==='album' ? 'success' : 'primary'} className='margin' onClick={()=>{setWhat('album')}}>Add an album</Button>
                    <Button variant={ what==='track' ? 'success' : 'primary'} className='margin' onClick={()=>{setWhat('track')}}>Add a track</Button>
                </div>
            }
            {!err && what==='album' &&
                <form onSubmit={submit} style={{'width': '400px', 'marginLeft': 'auto', 'marginRight': 'auto'}} className='margin-top'>
                    <label style={{'width': '100px'}} htmlFor='title'>Album title</label>
                    <input type='text' name='title' value={title} className='margin-left' onChange={(event)=>{setTitle(event.target.value)}} />
                    <div className='break margin-top-smaller' />
                    <label style={{'width': '100px'}} htmlFor='photo'>Album cover</label>
                    <input type='file' id='album-photo' name='photo' style={{'width': '250px'}} accept='image/*' />
                    <div className='break' />
                    <Button type='submit' variant='success' className='margin-top-small' onClick={submit}>Add</Button>
                </form>            
            }
            {!err && what==='track' &&
                <form onSubmit={submit} className='margin-top'>
                    <div style={{'width': '400px', 'marginLeft': 'auto', 'marginRight': 'auto'}}>
                        <label style={{'width': '100px'}} htmlFor='title'>Track title</label>
                        <input type='text' name='title' value={title} className='margin-left' onChange={(event)=>{setTitle(event.target.value)}} />
                        <div className='break margin-top-smaller' />
                        <label style={{'width': '100px'}} htmlFor='photo'>Track cover</label>
                        <input type='file' id='track-photo' name='photo' style={{'width': '250px'}} accept='image/*' />
                        <div className='break margin-top-smaller' />
                        <label style={{'width': '100px'}} htmlFor='audio'>Track audio</label>
                        <input type='file' id='track-audio' name='audio' style={{'width': '250px'}} accept='audio/*' />
                        <div className='break' />
                    </div>
                    <h5 className='margin-top'>Pick one of your albums for your track</h5>
                    <div className='flex-layout center-content'>
                    {albums.map((value, index) => {
                            return(
                                <div key={index+0.1} style={{'border': ( chosenAlbum===value.id ?'3px solid green' : 'none')}} onClick={(event)=>{setChosenAlbum(value.id)}}>
                                    <Album key={index} album={value} blockRedirect={true} />
                                </div>
                            )
                    })}
                    </div>
                    <h5 className='margin-top'>Pick a music kind for your track</h5>
                    <div>
                        {kinds.map((value, index) => {
                            return(
                                <Button key={index+0.2}
                                        variant={value.id===currKind ? 'success' : 'primary'}
                                        className='margin'
                                        onClick={()=>{setCurrKind(value.id)}}>
                                    {value.title}
                                </Button>
                            )
                        })}
                    </div>
                    <Button type='submit' variant='success' className='margin-top-small' onClick={submit}>Add</Button>
                </form>            
            
            }
            {!albums.length && what==='track' &&
                <Error message="You need to upload at least one album, so that you can attach your track to it." />
            }
            {err &&
                <Error message={err} />
            }
        </div>
    )
}

export default Create;