import React, { useState, useEffect } from 'react';

import '../0_MainPages/styles.css';
import '../generalStyles.css';
import AlbumsOrTracks from '../3_OneCategory/AlbumsOrTracks';

import { isLogged } from '../api/api';
import Error from '../0_MainPages/Error';

function FavsSkeleton() {
    const [userId, setUserId] = useState(null)
    useEffect(() => {
        if (localStorage.getItem('token')) {
            isLogged()
            .then(response => {
                setUserId(response.data.id);
            })
            .catch(err => {
                window.location.href='/';
            })    
        }
    }, [])
    if (userId) {
        return(
            <div className='famous-skeleton'>
                <AlbumsOrTracks case='albums' how='favs' userId={userId} />
                <AlbumsOrTracks case='tracks' how='favs' userId={userId} />
            </div>
        )    
    }
    else {
        return(
            <Error message='You cannot have a favourites list without an account' />
        )
    }
}

export default FavsSkeleton;