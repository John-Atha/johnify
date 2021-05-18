import React from 'react';

import '../generalStyles.css';
import AlbumsOrTracks from '../3_OneCategory/AlbumsOrTracks';

function AllSkeleton(props) {
    return(
        <div className='famous-skeleton' style={{'paddingBottom': '20vh'}}>
            <AlbumsOrTracks case={props.case} how='all' />
        </div>
    )
}

export default AllSkeleton;