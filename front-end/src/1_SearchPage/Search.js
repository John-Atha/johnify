import React, { useState, useEffect } from 'react';

import './styles.css';
import SearchBar from './SearchBar';
import Kinds from './Kinds';
import MusicPlayer from '../0_Bars/MusicPlayer';


function Search(props) {
    const [playing, setPlaying] = useState(null);
    const updPlaying = (track) => {
        setPlaying(track);
    }

    return (
        <div className="famous-skeleton padding-bottom">
            <h2>Search</h2>
            <SearchBar playing={playing} upd={updPlaying} />
            <div className='margin-top' />
            <Kinds playing={playing} upd={updPlaying} />
            <MusicPlayer playing={playing} />
        </div>
    )
}

export default Search;