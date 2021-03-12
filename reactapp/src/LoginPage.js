import React, { useContext } from 'react'
import { authContext } from './ProvideAuth';

import {
    useHistory,
    useLocation
} from "react-router-dom";

function useAuth() {
    return useContext(authContext);
}


function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let auth = useAuth();

    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
        auth.signin(() => {
            history.replace(from);
        });
    };

    return (
        <div>
            <p>You must log in to view the page at {from.pathname}</p>
            <button onClick={login}>Log in</button>
        </div>
    );
}

export default LoginPage
