import React from 'react';

import './styles.css';
import SearchBar from './SearchBar';
import Kinds from './Kinds';


function Search(props) {
   
    return (
        <div className="famous-skeleton">
            <SearchBar />
            <div className='margin-top' />
            <Kinds />
        </div>
    )
}

export default Search;