import React, { useContext, useState } from 'react'
import { authContext } from './ProvideAuth';

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
    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
        auth.signin(  user.username, user.password, () => {
            history.replace(from);
        });
    };

    return (
        <div>
            <p>You must log in to view the page at {from.pathname}</p>
            <button onClick={login}>Log in</button>
            <div>
                <input
                    type="text"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                    className="border border-green-300 py-2"
                />
                <input
                    type="password"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    className="border border-green-300 py-2"
                />
                <button 
                className="py-2 px-4 bg-blue-400 text-white shadow"
                onClick={login}>
                    login
                </button>
                <br/>
                <Link to="/register" >Register</Link>
            </div>
        </div>
    );
}

export default LoginPage
