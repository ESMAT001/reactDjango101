import React, { createContext, useState } from 'react'
import Cookies from 'js-cookie';
import { BASEURI } from './utils';

console.log(Cookies)

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
        return Cookies.get('token').split('|')[0]
    }

    const validateFetchRequest = async (callback) => {
        let token = Cookies.get('token');
        let expire_date = new Date(parseFloat(token.split("|")[1]));

        if (new Date() > expire_date) {

            let data = await fetch(BASEURI + '/api/renew_token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user, token: token.split('|')[0] })
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
                expires: 1.2
            });
            // setToken(data.token);
            return authData.signin(() => {
                setUser(data.username);
                callBack();
            });
        } else {
            console.log(data.error)
        }


    };

    const signout = async (callBack) => {

        let data = await fetch(BASEURI + '/api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user,
                token: get_token()
            })
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
