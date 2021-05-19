import React, { useState, useEffect } from 'react';

import OneKind from '../1_SearchPage/OneKind';
import { getOneKind } from '../api/api';
import Error from '../0_MainPages/Error';
import MusicPlayer from '../0_Bars/MusicPlayer';

function KindPage(props) {
    const [kind, setKind] = useState(null);
    const [playing, setPlaying] = useState(null);

    useEffect(() => {
        getOneKind(props.id)
        .then(response => {
            setKind(response.data);
        })
        .catch(err => {
            setKind(null);
        })
    }, [])

    const updPlaying = (track) => {
        setPlaying(track);
    }

    return(
        <div className="famous-skeleton padding-bottom">
            <h3>{kind ? kind.title : ''}</h3>
            {kind &&
                <OneKind playing={playing} upd={updPlaying} current={props.id} />        
            }
            {!kind &&
                <Error message='Oops, kind not found.' />
            }
            {kind &&
                <MusicPlayer playing={playing} />
            }
        </div>
    )
}

export default KindPage;