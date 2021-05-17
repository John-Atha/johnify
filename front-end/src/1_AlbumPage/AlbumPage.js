import React from 'react';

import './styles.css';

import MyNavbar from '../0_Home/MyNavbar';
import MusicPlayer from '../0_Home/MusicPlayer';
import AlbumDetails from './AlbumDetails';

function AlbumPage(props) {
    return(
        <div className="home-page-desktop">
            
            <div className="main flex-layout">
                <MyNavbar />
                <AlbumDetails id={props.id} />
            </div>

            <MusicPlayer />
        </div>
    )
}

export default AlbumPage;