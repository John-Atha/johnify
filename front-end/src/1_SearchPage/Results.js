import React, { useState, useEffect } from 'react';

import './styles.css';
import ResultsCategory from './ResultCategory';

function Results(props) {
    const [albums, setAlbums] = useState(props.albums);
    const [tracks, setTracks] = useState(props.tracks);

    useEffect(() => {
        setTracks(props.tracks);
    }, [props.tracks])

    useEffect(() => {
        setAlbums(props.albums);
    }, [props.albums])

    return(
        <div>
            <ResultsCategory case='albums' data={albums} />
            <ResultsCategory case='tracks' data={tracks} />
        </div>
    )
}

export default Results;