import React, { useState, useContext } from 'react'
import {
    Link,
    useHistory
} from "react-router-dom";
import { BASEURI } from '../utils';




function Register() {
    let history = useHistory();

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error , setError] = useState(null)
    

    const submitData = async () => {
        let response = await fetch(BASEURI + '/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                firstname: firstName,
                email: email,
                password: password
            })
        })
        response = await response.json()
        if(!response.register){
           return setError(response.error)
        }
        history.push('/')
    }

    const submit = (e) => {
        e.preventDefault();
        submitData()
    }
    return (
        <div>
            { error && <p className="text-red-400 text-lg" > { error } </p> }
            <form onSubmit={submit}>
                <input type='text' placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
                <input type='text' placeholder="first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                <input type='email' placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
                <input type='password' placeholder='password' value={password} onChange={(e)=> setPassword(e.target.value)} />
                <button type='submit' >sign up</button>
            </form>
            <Link to="/login" >back</Link>
        </div>
    )
}

export default Register
