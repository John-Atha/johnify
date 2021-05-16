import React from 'react';

import './styles.css';

import MyNavbar from './MyNavbar';
import MusicPlayer from './MusicPlayer';
import FamousSkeleton from '../Famous/FamousSkeleton';

function Home() {
    return(
        <div className="home-page-desktop">
            
            <div className="main flex-layout">
                <MyNavbar />
                <FamousSkeleton />
            </div>

            <MusicPlayer />
        </div>
    )
}

export default Home;