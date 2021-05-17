import React from 'react';

import MyNavbar from '../0_Bars/MyNavbar';
import MusicPlayer from '../0_Bars/MusicPlayer';
import AllSkeleton from '../2_CategorySkeleton/AllSkeleton';

function AllPage(props) {
    return(
        <div className="home-page-desktop">
            
            <div className="main flex-layout">
                <MyNavbar />
                <AllSkeleton case={props.case} />
            </div>

            <MusicPlayer />
        </div>
    )
}

export default AllPage;