import React from 'react';

import './styles.css';

import MyNavbar from '../0_Bars/MyNavbar';
import MusicPlayer from '../0_Bars/MusicPlayer';
import FamousSkeleton from '../2_CategorySkeleton/FamousSkeleton';
import FavsSkeleton from '../2_CategorySkeleton/FavsSkeleton';
import AllSkeleton from '../2_CategorySkeleton/AllSkeleton';
import AlbumDetails from '../1_AlbumPage/AlbumDetails';
import TrackDetails from '../1_TrackPage/TrackDetails';
import Search from '../1_SearchPage/Search';

function Home(props) {
    return(
        <div className="home-page-desktop">
            
            <div className="main flex-layout">
                <MyNavbar />
                {props.page==='famous' &&
                    <FamousSkeleton />                
                }
                {props.page==='favs' &&
                    <FavsSkeleton />
                }
                {props.page==='all' &&
                    <AllSkeleton case={props.case} />
                }
                {props.page==='album' &&
                    <AlbumDetails id={props.id} />
                }
                {props.page==='track' &&
                    <TrackDetails id={props.id} />
                }
                {props.page==='search' &&
                    <Search />
                }
            </div>

            <MusicPlayer />
        </div>
    )
}

export default Home;