import React, { useState, useEffect } from 'react';

import TrackRow from './TrackRow';
import './styles.css';
import ReactAudioPlayer from 'react-audio-player';
import MusicPlayer from '../0_Bars/MusicPlayer';

function AlbumTracks(props) {
    const [tracks, setTracks] = useState(props.tracks);
    const [user, setUser] = useState(props.user);
    const [playing, setPlaying] = useState(null);

    useEffect(() => {
        setTracks(props.tracks);
    }, [props.tracks])

    useEffect(() => {
        setUser(props.user);
    }, [props.user])

    const updPlaying = (track) => {
        setPlaying(track);
    }

    return(
        <div className='margin-top'>
            <MusicPlayer playing={playing} />
            
            <table className='tracks-table'>
                <thead>
                    <tr>
                        <td style={{'width': '50px'}}>#</td>
                        <td style={{'width': '100px'}}>Title</td>
                        <td style={{'width': '100px'}}>Date</td>
                        <td style={{'width': '50px'}}>Fav</td>
                        <td style={{'width': '50px'}}>Play</td>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((value, index) => {
                        return(
                            <TrackRow upd={updPlaying}
                                      key={index}
                                      index={index}
                                      value={value}
                                      userId={user ? user.id : null}
                                      playing={playing ? playing.id===value.id : false} />
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default AlbumTracks;