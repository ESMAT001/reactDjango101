import React, { useContext, createContext, useState } from 'react'

export const authContext = createContext();

const auth = {
    isAuthenticated: false,
    signin(callBack) {
        auth.isAuthenticated = true;
        setTimeout(callBack, 100); // fake async
    },
    signout(callBack) {
        auth.isAuthenticated = false;
        setTimeout(callBack, 100);
    }
};


const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function useProvideAuth() {
    const [user, setUser] = useState(null);

    const signin = async (userName, password, callBack) => {
        let data = await fetch('/api/login/', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body:`userName=${userName}&password=${password}`
        });
        data = await data.json();
        console.log(data)

        return auth.signin(() => {
            setUser(data.username);
            callBack();
        });

    };

    const signout = async (callBack) => {
        let data = await fetch('/api/logout/', {
            method: 'POST',
            mode: 'same-origin',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
        });
        data = await data.json();
        console.log(data)
        return auth.signout(() => {
            setUser(null);
            callBack();
        });
    };

    return {
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
