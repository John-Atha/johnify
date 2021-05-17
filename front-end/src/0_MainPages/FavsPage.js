import React from 'react';

import './styles.css';

import MyNavbar from '../0_Bars/MyNavbar';
import MusicPlayer from '../0_Bars/MusicPlayer';
import FavsSkeleton from '../2_CategorySkeleton/FavsSkeleton';

function Home() {
    return(
        <div className="home-page-desktop">
            
            <div className="main flex-layout">
                <MyNavbar />
                <FavsSkeleton />
            </div>

            <MusicPlayer />
        </div>
    )
}

export default Home;