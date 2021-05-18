import React, { useState, useEffect } from 'react';
import '../0_MainPages/styles.css';
import ReactAudioPlayer from 'react-audio-player';
import track from '../images/track.png';

function MusicPlayer(props) {
    const [playing, setPlaying] = useState(props.playing);

    useEffect(() => {
        setPlaying(props.playing)
    }, [props.playing])
    
    return(
        <div className="music-player flex-layout">
            <div className='flex-layout'
                 style={{'height': '100%'}}>
                <img src={playing? (playing.photo_url || track) : track}
                    style={{'height': '100%'}} />
                <div style={{'marginTop': '20px', 'marginLeft': '15px'}}>
                    <a style={{'color': 'white',
                               'textDecoration': ('none'),
                               'fontSize': '25px'}}
                        href={playing ? `/tracks/${playing.id}` : '#'}>
                        {playing ? playing.title : 'None'}
                    </a>
                    <div className='break' />
                    {playing &&
                    <a style={{'color': 'white',
                               'textDecoration': ('none'),
                               'fontSize': '20px'}}
                        href={playing ? `/users/${playing.album.artist.id}` : '#'}>
                        {playing.album.artist.username}
                     </a>
                    }
                </div>
            </div>
            <ReactAudioPlayer
                style={{'width': '300px', 'marginTop': '20px', 'marginLeft': '20px'}}
                src={playing ? playing.file : null}
                autoplay
                controls
            />
        </div>
    )
}

export default MusicPlayer;