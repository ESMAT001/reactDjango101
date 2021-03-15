import React, { useEffect, createContext, useState } from 'react'
import { BASEURI } from './utils';



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
    const [token,setToken] = useState(null);
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
            setToken(data.token);
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
                username:user,
                token:token
            })
        });
        data = await data.json();
        console.log(data)
        if (data.logout) {
            setToken(null)
            return authData.signout(() => {
                setUser(null);
                callBack();
            });
        } else {
            console.log(data.message);
        }

    };

    

    return {
        token,
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
