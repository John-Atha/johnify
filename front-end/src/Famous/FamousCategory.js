import React, { useState, useEffect } from 'react';

import './styles.css';
import '../generalStyles.css';
import Album from './Album';
import Track from './Track';
import Error from '../Error';
import Button from 'react-bootstrap/Button'

import { getAlbumsRanking, getTracksRanking } from '../api/api';

function FamousCategory(props) {
    const [data, setData] = useState([]);
    const [noData, setNoData] = useState(false);
    const [start, setStart] = useState(1);
    const [end, setEnd] = useState(5);
     
    const getData = () => {
        let func = getAlbumsRanking;
        if (props.case==='tracks') {
            func = getTracksRanking;
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
    }, [])

    useEffect(()=> {
        getData();
    }, [start, end])

    return(
        <div>
            <h2 className='margin-top-small'>Famous {props.case.charAt(0).toUpperCase()+props.case.slice(1)}</h2>
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
            {!noData &&
                <Button variant='primary' style={{'marginLeft': '15px'}}
                        onClick={()=>{setStart(start+5);setEnd(end+5)}}>
                    See more
                </Button>
                
            }
            {noData &&
                <Error message={`No ${props.case} found.`} />
            }
        </div>
    )
}

export default FamousCategory;