import React, { useState, useEffect } from 'react';

import './styles.css';
import '../generalStyles.css';
import Album from './Album';

import { getAlbumsRanking } from '../api/api';

function FamousAlbums() {
    const [albums, setAlbums] = useState([]);
    const [noData, setNoData] = useState(false);
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(5);
    
    const getAlbums = () => {
        getAlbumsRanking(start, end)
        .then(response => {
            console.log(response);
            setAlbums(response.data);
            setNoData(!response.data.length);
        })
        .catch(err => {
            setNoData(true);
        })
    }

    useEffect(() => {
        getAlbums();
    }, [])

    useEffect(()=> {
        getAlbums();
    }, [start, end])

    return(
        <div>
            <h2>Famous Albums</h2>
            <div className='albums-container flex-layout'>
                {albums.map((value, index) => {
                    return(
                        <Album album={value} key={index} />
                    )
                })}
            </div>
        </div>
    )
}

export default FamousAlbums;