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
    const [error, setError] = useState(null)


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
        // console.log(response)
        if (!response.register) {
            if ('UNIQUE constraint failed: auth_user.username' === response.error)
                return setError("username already exist! ")

            return setError(response.error)
        }
        history.push('/')
    }

    const submit = (e) => {
        e.preventDefault();
        if (!(username && password && firstName && email)) {
            setError("Please fill the fields!")
            return;
        }
        submitData()
    }
    const choseCls = () => {
        return error ? 'red' : 'green';
    }
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center" >
            <div className={`shadow-lg hover:shadow-xl rounded border-4  border-${choseCls()}-400 px-10 py-10 flex flex-col justify-center items-center space-y-6 transition duration-500`}>
                <p className='text-gray-600 text-xl capitalize font-semibold '>Login to your account </p>
                {error && <p className="text-red-400 text-lg" > {error} </p>}
                <form onSubmit={submit} className="flex flex-col justify-center items-center space-y-4" >
                    <input
                        type='text'
                        placeholder="username"
                        value={username}
                        onChange={e => {
                            setError('')
                            setUsername(e.target.value)
                        }}
                        required={true}
                        className={`font-semibold text-gray-600 border-b-4 focus:outline-none border-${choseCls()}-300 py-2 px-2`}
                    />
                    <input
                        type='text'
                        placeholder="first name"
                        value={firstName}
                        onChange={e => {
                            setError('')
                            setFirstName(e.target.value)
                        }}
                        required={true}
                        className={`font-semibold text-gray-600 border-b-4 focus:outline-none border-${choseCls()}-300 py-2 px-2`}
                    />
                    <input
                        type='email'
                        placeholder="email"
                        value={email}
                        onChange={e => {
                            setError('')
                            setEmail(e.target.value)
                        }}
                        required={true}
                        className={`font-semibold text-gray-600 border-b-4 focus:outline-none border-${choseCls()}-300 py-2 px-2`}
                    />
                    <input
                        type='password'
                        placeholder='password'
                        value={password}
                        onChange={(e) => {
                            setError('')
                            setPassword(e.target.value)
                        }}
                        required={true}
                        className={`font-semibold text-gray-600 border-b-4 focus:outline-none border-${choseCls()}-300 py-2 px-2`}
                    />
                    <button type='submit' className={`capitalize font-semibold  py-2 px-8 rounded bg-${choseCls()}-400 text-white shadow hover:shadow-lg focus:outline-none
                        hover:bg-opacity-90 transition duration-200`} >sign up</button>
                </form>
                <Link to="/login" >back</Link>
            </div>
        </div>
    )
}

export default Register
