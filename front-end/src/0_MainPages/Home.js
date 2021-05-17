import React from 'react';

import './styles.css';

import MyNavbar from '../0_Bars/MyNavbar';
import MusicPlayer from '../0_Bars/MusicPlayer';
import FamousSkeleton from '../2_CategorySkeleton/FamousSkeleton';

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