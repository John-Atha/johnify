import React, { useState } from 'react';

import './styles.css';
import Button from 'react-bootstrap/Button';
import Error from '../0_MainPages/Error';
import Success from '../0_MainPages/Success';

import { LoginPost } from '../api/api';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [succ, setSucc] = useState(null);
    const [err, setErr] = useState(null);

    const submit = (event) => {
        event.preventDefault();
        if (!username.length || !password.length) {
            setSucc(null);
            setErr('Fill both fields.');
        }
        else{
            LoginPost(username, password)
            .then(response => {
                localStorage.setItem('token', response.data.access);
                setSucc('Logged in successfully.');
                setErr(null);
                setTimeout(()=>{window.location.href='/'}, 100);
            })
            .catch(err => {
                setSucc(null);
                setErr('Login failed.');
            })    
        }
    }

    return (
        <div className='log-box center-content'>
            <h2>Welcome</h2>
            {err &&
                <Error message={err} />
            }
            {succ &&
                <Success message={succ} />
            }
            <form onSubmit={submit} className='margin-top-small'>
                <input className='log-input' type='text' value={username} placeholder='Username...' onChange={(event) => {setUsername(event.target.value)}} />
                <div className='break'></div>
                <input  className='log-input margin-top-smaller'
                        type='password'
                        value={password}
                        placeholder='Password...'
                        onChange={(event) => {setPassword(event.target.value); setErr(null); setSucc(null);}} />
                <div className='break'></div>
                <Button type='submit' variant='primary' className='margin-top-small' onClick={submit}>Log in</Button>
            </form>
            <div className='break'></div>
            <div className='margin-top-small'>First time here?</div>
            <a href='/register' style={{'color': 'lightblue', 'textDecoration': 'none'}}>Create an account</a>
        </div>
    )
}

export default Login;