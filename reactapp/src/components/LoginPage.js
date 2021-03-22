import React, { useContext, useState, useEffect } from 'react'
import { authContext } from './ProvideAuth';
import Cookies from 'js-cookie';
import { BASEURI } from '../utils';
import {
    useHistory,
    useLocation,
    Link
} from "react-router-dom";

function useAuth() {
    return useContext(authContext);
}





function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();
    let [user, setUser] = useState({ username: "", password: '' });
    let [error, setError] = useState('')

    let { from } = location.state || { from: { pathname: '/' } };

    useEffect(() => {
        const login_with_cookie = async () => {
            const token = Cookies.get('token');
            const username = Cookies.get('username');
            let headers = new Headers({
                'Content-Type': 'application/json',
                "username": username,
                "token": token
            });
            let data = await fetch(BASEURI + '/api/login_c/', {
                method: 'POST',
                headers: headers
            });
            data = await data.json();
            // console.log(data)
            auth.login_with_cookie(data, () => {
                history.replace(from);
            })
        }
        if ('token' in Cookies.get() && 'username' in Cookies.get()) {
            login_with_cookie()
        }
    }, [])




    let login = async () => {
        if (!(user.username && user.password)) {
            setError("Please fill the fields!")
            return;
        }
        let requestError = await auth.signin(user.username, user.password, () => {
            history.replace(from);
        });
        console.log(requestError, '  error')
        if (requestError) {
            setError(requestError)
        }
    };

    const choseCls = () => {
        return error ? 'red' : 'green';
    }

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center" >
            <div className={`shadow-lg hover:shadow-xl rounded border-4  border-${choseCls()}-400 px-10 py-10 flex flex-col justify-center items-center space-y-6 transition duration-500`}>
                <p className='text-gray-600 text-xl capitalize font-semibold '>Login to your account </p>
                {error && <p className='text-red-400' >{error}</p>}
                <div className="flex flex-col justify-center items-center space-y-4" >
                    <input
                        type="text"
                        value={user.username}
                        placeholder="username"
                        onChange={e => {
                            setError('')
                            setUser({ ...user, username: e.target.value })
                        }
                        }
                        className={`font-semibold text-gray-600 border-b-4 focus:outline-none border-${choseCls()}-300 py-2 px-2`}
                    />
                    <input
                        type="password"
                        value={user.password}
                        placeholder="password"
                        onChange={e => {
                            setError('')
                            setUser({ ...user, password: e.target.value })
                        }}
                        className={`font-semibold text-gray-600 border-b-4 focus:outline-none border-${choseCls()}-300 py-2 px-2`}
                    />
                    <button
                        className={`capitalize font-semibold  py-2 px-8 rounded bg-${choseCls()}-400 text-white shadow hover:shadow-lg focus:outline-none
                        hover:bg-opacity-90 transition duration-200`}
                        onClick={login}>
                        login
                    </button>
                </div>
                <p className='text-gray-400 text-sm' > Dont have an account? <Link to="/register" className="text-blue-400" >Register</Link> </p>
            </div>
        </div>
    );
}

export default React.memo(LoginPage)
