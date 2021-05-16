import React from 'react';

import './styles.css';
import '../generalStyles.css';
import FamousCategory from './FamousCategory';

function FamousSkeleton() {
    return(
        <div className='famous-skeleton'>
            <FamousCategory case='albums' />
            <FamousCategory case='tracks' />
        </div>
    )
}

export default FamousSkeleton;