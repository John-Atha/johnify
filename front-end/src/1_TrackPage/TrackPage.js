import React from 'react';

import '../1_AlbumPage/styles.css';

import MyNavbar from '../0_Bars/MyNavbar';
import MusicPlayer from '../0_Bars/MusicPlayer';
import TrackDetails from './TrackDetails';

function TrackPage(props) {
    return(
        <div className="home-page-desktop">
            
            <div className="main flex-layout">
                <MyNavbar />
                <TrackDetails id={props.id} />
            </div>

            <MusicPlayer />
        </div>
    )
}

export default TrackPage;