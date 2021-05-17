import React from 'react';

import './styles.css';
import '../generalStyles.css';
import album from '../images/album.png'

function Album(props) {
    return(
        <div className='one-album-container flex-layout' onClick={()=>{window.location.href=`/albums/${props.album.id}`}}>
            <img src={props.album.photo_url || album}
                 style={{'height': !props.album.photo_url ? '90px': '100px', 'marginTop': !props.album.photo_url ? '5px': '0px', 'borderRadius': '5px'}}/>
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