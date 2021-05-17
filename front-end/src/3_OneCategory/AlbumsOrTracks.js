import React, { useState, useEffect } from 'react';

import './styles.css';
import '../generalStyles.css';
import Album from './Album';
import Track from './Track';
import Error from '../0_MainPages/Error';
import Button from 'react-bootstrap/Button';

import { getAlbumsRanking, getTracksRanking, getFavAlbums, getFavTracks } from '../api/api';

function AlbumsOrTracks(props) {
    const [userId, setUserId] = useState(props.userId);
    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(false);
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(5);

    const getData = () => {
        let func = getAlbumsRanking;
        if (props.how!=='favs') {
            if (props.case==='tracks') func = getTracksRanking;
        }
        if (props.how==='favs') {
            if (props.case==='tracks') func = getFavTracks;
            else func = getFavAlbums;
        }
        func(start, end)
        .then(response => {
            console.log(response);
            setData(data.concat(response.data));
            setNoData(!response.data.length);
        })
        .catch(err => {
            setNoData(true);
        })  
    }

    useEffect(() => {
        getData();
    }, [start, end])

    useEffect(() => {
        setUserId(props.userId);
    }, [props.userId])

    return(
        <div>
            <h2 className='margin-top-small'>{props.how==='all' ? 'All' : (props.how==='favs' ? 'Your favourite' : 'Top 5')} {props.case.charAt(0).toUpperCase()+props.case.slice(1)}</h2>
            <div className='albums-container flex-layout'>
                {props.case==='albums' && data.map((value, index) => {
                    return(
                        <Album album={value} key={index} />
                    )
                })}
                {props.case==='tracks' && data.map((value, index) => {
                    return(
                        <Track track={value} key={index} />
                    )
                })}
            </div>
            {!noData && props.how==='all' &&
                <Button variant='primary' style={{'marginLeft': '15px'}}
                        onClick={()=>{setStart(start+5);setEnd(end+5)}}>
                    See more
                </Button>
            }  
            {noData &&
                <Error message={data.length>0 ? `No more ${props.case==='favs' ? 'favourite': ''} ${props.case} found.` : `No ${props.how==='favs' ? 'favourite' : ''} ${props.case} found.`} />
            }
        </div>
    )
}

export default AlbumsOrTracks;