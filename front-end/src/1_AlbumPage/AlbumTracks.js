import React, { useState, useEffect } from 'react';

import TrackRow from './TrackRow';
import './styles.css';

function AlbumTracks(props) {
    const [tracks, setTracks] = useState(props.tracks);
    const [user, setUser] = useState(props.user);

    useEffect(() => {
        setTracks(props.tracks);
    }, [props.tracks])

    useEffect(() => {
        setUser(props.user);
    }, [props.user])

    return(
        <table className='tracks-table'>
            <thead>
                <tr>
                    <td style={{'width': '50px'}}>#</td>
                    <td style={{'width': '100px'}}>Title</td>
                    <td style={{'width': '100px'}}>Date</td>
                    <td style={{'width': '50px'}}>Fav</td>
                </tr>
            </thead>
            <tbody>
                {tracks.map((value, index) => {
                    return(
                        <TrackRow key={index} index={index} value={value} userId={user ? user.id : null}/>
                    )
                })}
            </tbody>
        </table>
    )
}

export default AlbumTracks;