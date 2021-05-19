import React, { useState, useEffect } from 'react';

import './styles.css';
import Button from 'react-bootstrap/Button';
import OneKind from './OneKind';

import { getKinds } from '../api/api';

function Kinds(props) {
    const [kinds, setKinds] = useState([]);
    const [current, setCurrent] = useState(null);

    useEffect(() => {
        getKinds()
        .then(response => {
            console.log(response);
            setKinds(response.data);
            setCurrent(response.data.length>0 ? response.data[0].id : null)
        })
    }, [])

    return(
        <div>
            {kinds.length>0 &&
                <h2>Kinds</h2>
            }
            <div>
                {kinds.map((value, index) => {
                    return(
                        <Button key={index}
                                style={{'margin': '10px'}}
                                variant={value.id === current ? 'success' : 'primary'}
                                onClick={()=>{setCurrent(value.id);}}>
                            {value.title}
                        </Button>
                    )
                })}
            </div>
            <OneKind playing={props.playing} upd={props.upd} current={current} />
        </div>
    )
}

export default Kinds;