import React, { useState, useEffect } from 'react';

import './styles.css';
import SearchBar from './SearchBar';
import Kinds from './Kinds';


function Search(props) {
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    
    return (
        <div className="famous-skeleton">
            <SearchBar />
            <div className='margin-top' />
            <Kinds />
        </div>
    )
}

export default Search;