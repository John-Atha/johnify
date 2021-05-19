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
                    alt='playing-track'
                    style={{'height': '100%'}} />

                <div className='playing-info-container'>
                    <a  className='playing-title'
                        href={playing ? `/tracks/${playing.id}` : '#'}>
                        {playing ? playing.title : 'None'}
                    </a>
                    <div className='break' />
                    {playing &&
                    <a  className='playing-artist'
                        href={playing ? `/users/${playing.album.artist.id}` : '#'}>
                        {playing.album.artist.username}
                     </a>
                    }
                </div>
            </div>

            <ReactAudioPlayer
                className='audio-player'
                src={playing ? playing.file : null}
                autoPlay
                controls
            />
        </div>
    )
}

export default MusicPlayer;