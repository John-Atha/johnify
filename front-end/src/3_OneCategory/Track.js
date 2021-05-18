import React from 'react';

import './styles.css';
import '../generalStyles.css';
import track from '../images/track.png';

function Track(props) {
    return(
        <div className='one-album-container flex-layout'
             onClick={()=>{window.location.href=`/tracks/${props.track.id}`}}
             style={{ 'padding': !props.track.photo_url ? '5px' : '0px'}}>
            <img src={props.track.photo_url || track} alt='track'
                 style={{'height': !props.track.photo_url ? '90px': '100px', 'marginTop': !props.track.photo_url ? '5px': '0px', 'borderRadius': '5px'}}/>
            <div style={{'marginLeft': '5px', 'padding': '5px'}}>
                <div style={{'fontSize': '20px'}}>{props.track.title}</div>
                <div  className='artist-name'
                    href={`/artists/${props.track.album.artist.id}`}>
                    {props.track.album.artist.username}
                </div>
                <div style={{'fontSize': '13px'}}>{props.track.date}</div>
            </div>
        </div>
    )
}

export default Track;