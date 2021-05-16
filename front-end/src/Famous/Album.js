import React from 'react';

import './styles.css';
import '../generalStyles.css';

function Album(props) {
    return(
        <div className='one-album-container flex-layout' onClick={()=>{window.location.href=`/albums/${props.album.id}`}}>
            <img src={props.album.photo_url} style={{'height': '70px', 'borderRadius': '5px'}}/>
            <div style={{'marginLeft': '5px', 'padding': '5px'}}>
                <div style={{'fontSize': '20px'}}>{props.album.title}</div>
                <div  className='artist-name'
                    href={`/artists/${props.album.artist.id}`}>
                    {props.album.artist.username}
                </div>
                <div style={{'fontSize': '13px'}}>{props.album.date}</div>
            </div>
        </div>
    )
}

export default Album;