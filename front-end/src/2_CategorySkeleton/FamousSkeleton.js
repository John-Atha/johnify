import React from 'react';

import '../0_MainPages/styles.css';
import '../generalStyles.css';
import AlbumsOrTracks from '../3_OneCategory/AlbumsOrTracks';

function FamousSkeleton() {
    return(
        <div className='famous-skeleton'>
            <AlbumsOrTracks case='albums' />
            <AlbumsOrTracks case='tracks' />
        </div>
    )
}

export default FamousSkeleton;