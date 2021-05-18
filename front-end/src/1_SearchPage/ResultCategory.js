import React, { useState, useEffect } from 'react';

import './styles.css';
import Album from '../3_OneCategory/Album';
import Track from '../3_OneCategory/Track';
import Error from '../0_MainPages/Error';

function ResultsCategory(props) {
    const [data, setData] = useState(props.data);

    useEffect(() => {
        setData(props.data);
    }, [props.data])

    return(
        <div>
            <h4 className='margin-top-small'>Famous matching {props.case}</h4>
            <div className='flex-layout'>
                {data.map((value, index) => {
                        if (props.case==='albums') {
                            return(
                                <Album album={value} key={index} />
                            )
                        }
                        else {
                            return(
                                <Track track={value} key={index} />
                            )
                        }

                })}
            </div>
            {data.length===0 &&
                <Error message={`No ${props.case} found.`} />
            }
        </div>
    )
}

export default ResultsCategory;