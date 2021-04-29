import React, { createContext, useState } from 'react'
import Cookies from 'js-cookie';
import { BASEURI } from '../utils';


export const authContext = createContext();

const authData = {
    isAuthenticated: false,
    signin(callBack) {
        authData.isAuthenticated = true;
        setTimeout(callBack, 100); // fake async
    },
    signout(callBack) {
        authData.isAuthenticated = false;
        setTimeout(callBack, 100);
    }
};



function useProvideAuth() {
    const [user, setUser] = useState(null);
    // const [token, setToken] = useState(null);

    const get_token = () => {

        if (!('token' in Cookies.get())) {
            window.location.reload();
        }

        return Cookies.get('token')
    }

    const validateFetchRequest = async (callback) => {

        let expire_date = new Date(parseFloat(get_token().split("|")[1]));

        if (new Date() > expire_date) {
            console.log("requesting for the new token")
            let headers = new Headers({
                'Content-Type': 'application/json',
                "username": user,
                "token": get_token()
            });
            let data = await fetch(BASEURI + '/api/renew_token/', {
                method: 'POST',
                headers: headers
            });
            data = await data.json();
            console.log(data)
            if (data.username && data.token) {
                Cookies.remove('token')
                Cookies.set('token', data.token, {
                    expires: 1.2
                });
            }
            else {
                console.log(data.error)
            }
        }

        return callback()

    }

    const login_with_cookie = (data, callBack) => {
        if (data.logedIn) {
            Cookies.set('token', data.token, {
                expires: 1
            });
            Cookies.set('username', data.username, {
                expires: 1
            });
            return authData.signin(() => {
                setUser(data.username);
                callBack();
            });
        }
    }

    const signin = async (userName, password, callBack) => {
        let data = await fetch(BASEURI + '/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: userName, password: password })
        });
        data = await data.json();
        console.log(data)
        if (data.logedIn && data.username) {
            Cookies.set('token', data.token, {
                expires: 1
            });
            Cookies.set('username', data.username, {
                expires: 1
            });
            // setToken(data.token);
            return authData.signin(() => {
                setUser(data.username);
                callBack();
            });
        }

        return data.error;

    };

    const signout = async (callBack) => {
        let header = new Headers({
            'Content-Type': 'application/json',
            "username": user,
            "token": get_token()
        });
        let data = await fetch(BASEURI + '/api/logout/', {
            method: 'POST',
            headers: header
        });
        data = await data.json();
        console.log(data)
        if (data.logout) {
            Cookies.remove('token')
            return authData.signout(() => {
                setUser(null);
                callBack();
            });
        } else {
            console.log(data.message);
        }

    };



    return {
        validateFetchRequest,
        get_token,
        user,
        login_with_cookie,
        signin,
        signout
    };
}

function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

export default ProvideAuth
