import React from 'react';

import './styles.css';
import '../generalStyles.css';
import FamousAlbums from './FamousAlbums';

function FamousSkeleton() {
    return(
        <div style={{'gridColumn': 2, 'marginLeft': '5px'}}>
            <FamousAlbums />
        </div>
    )
}

export default FamousSkeleton;