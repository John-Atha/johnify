import React, { useState, useEffect } from 'react';

import './styles.css';
import Button from 'react-bootstrap/Button';
import Error from '../0_MainPages/Error';
import Success from '../0_MainPages/Success';
import Form from 'react-bootstrap/Form';

import { LoginPost, RegisterPost } from '../api/api';
import { createNotification } from '../createNotification';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [email, setEmail] = useState('');
    const [isArtist, setIsArtist] = useState(false);
    const [succ, setSucc] = useState(null);
    const [err, setErr] = useState(null);

    const submit = (event) => {
        event.preventDefault();
        if (err) {
            createNotification('danger', 'Sorry', err)
        }
        else if (!username.length || !password.length || !confirmation.length || !email.length) {
            setSucc(null);
            setErr('Fill all the fields.');
        }
        else{
            RegisterPost(username, password, confirmation, email, isArtist)
            .then(response => {
                setSucc('Registered successfully.');
                setErr(null);
                LoginPost(username, password)
                .then(response => {
                    localStorage.setItem('token', response.data.access);
                    setTimeout(()=>{window.location.href='/'}, 100);
                })
                .catch(err => {
                    createNotification('Danger', 'Something went wrong', 'Try logging in with the info you just inserted.');
                })
            })
            .catch(err => {
                setSucc(null);
                if (err.response.status!==500) {
                    setErr(err.response.data);
                }
                else {
                    setErr('Username/email already exist.');
                }
            })    
        }
    }

    const updUsername = (event) => {
        if (event.target.value.length<15) {
            if (event.target.value.includes(' ')) {
                setErr('Username cannot contain a space');
                setSucc(null);
            }
            else {
                setUsername(event.target.value);
                setErr(null);
            }
        }
        else {
            setErr('Username cannot be larger than 15 characters');
            setSucc(null);
        }
    }

    const passCheck = (event) => {
        let other = '';
        if (event.target.name==='password') other = confirmation
        else other = password 
        if (event.target.value!==other) {
            setErr("Passwords don't match.");
            setSucc(null);
        }
        else {
            setErr(null);
        }
    }

    return (
        <div className='reg-box center-content'>
            <h2>Welcome</h2>
            {err &&
                <Error message={err} />
            }
            {succ &&
                <Success message={succ} />
            }
            <form onSubmit={submit} className='margin-top-small'>
                <input className='log-input' type='text' value={username} placeholder='Username...' onChange={updUsername} />
                <div className='break' />
                <input className='log-input margin-top-smaller' type='text' value={email} placeholder='Email...' onChange={(event) => {setEmail(event.target.value); setErr(null)}} />
                <input  className='log-input margin-top-smaller'
                        type='password'
                        name='password'
                        value={password}
                        placeholder='Password...'
                        onChange={(event) => {setPassword(event.target.value); passCheck(event);}} />
                <div className='break' />
                <input  className='log-input margin-top-smaller'
                        type='password'
                        name='confirmation'
                        value={confirmation}
                        placeholder='Re-type password...'
                        onChange={(event) => {setConfirmation(event.target.value); passCheck(event);}} />
                <div className='break' />
                <Form.Check className='margin-top-smaller' inline label='Artist' checked={isArtist} onChange={(event) => {setIsArtist(event.target.checked);}} />
                <div className='break'/>
                <Button type='submit' variant='primary' className='margin-top-small' onClick={submit}>Submit</Button>
            </form>
            <div className='break' />
            <div className='margin-top-small'>Already have an account?</div>
            <a href='/register' style={{'color': 'lightblue', 'textDecoration': 'none'}}>Login</a>
        </div>
    )
}

export default Register;