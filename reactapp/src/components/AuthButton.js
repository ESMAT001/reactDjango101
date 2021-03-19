import React, { useContext } from 'react'
import {
    useHistory
} from "react-router-dom";
import { authContext } from './ProvideAuth';


function useAuth() {
    let auth = useContext(authContext);
    return ({
        validateFetchRequest: auth.validateFetchRequest,
        user: auth.user,
        signout: auth.signout
    })
}



function AuthButton() {
    let history = useHistory();
    let auth = useAuth();

    return auth.user ? (
        <p>
            Welcome!{ auth.user}
            <button
                className="py-2 px-4 bg-red-400 text-white mx-4"
                onClick={() => {
                    auth.validateFetchRequest(() => {
                        auth.signout(() => history.push("/"));
                    })
                }}
            >
                Sign out
             </button>
        </p>
        ) : (
            <p>You are not logged in.</p>
        );
}

export default AuthButton
