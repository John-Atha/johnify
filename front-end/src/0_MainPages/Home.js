import React from 'react';

import './styles.css';

import MyNavbar from '../0_Bars/MyNavbar';
import FamousSkeleton from '../2_CategorySkeleton/FamousSkeleton';
import FavsSkeleton from '../2_CategorySkeleton/FavsSkeleton';
import AllSkeleton from '../2_CategorySkeleton/AllSkeleton';
import AlbumDetails from '../1_AlbumPage/AlbumDetails';
import TrackDetails from '../1_TrackPage/TrackDetails';
import Search from '../1_SearchPage/Search';
import ProfileSkeleton from '../1_ProfilePage/ProfileSkeleton';
import Create from '../Create';
import KindPage from '../1_KindPage/KindPage';

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
                    <AlbumDetails id={parseInt(props.id)} />
                }
                {props.page==='track' &&
                    <TrackDetails id={parseInt(props.id)} />
                }
                {props.page==='search' &&
                    <Search />
                }
                {props.page==='profile' &&
                    <ProfileSkeleton id={parseInt(props.id)} />
                }
                {props.page==='create' &&
                    <Create />
                }
                {props.page==='kind' &&
                    <KindPage id={parseInt(props.id)} />
                }
            </div>
        </div>
    )
}

export default Home;