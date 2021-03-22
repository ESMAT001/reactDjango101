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
        <div className="flex justify-between items-center">
            <p className="text-gray-600 text-lg ">
                Welcome! {auth.user}
                
            </p>
            <button
                className="capitalize px-4 py-2 bg-red-400 text-white font-bold shadow ml-3 focus:outline-none hover:shadow-lg hover:bg-red-300 transition duration-300"
                onClick={() => {
                    auth.validateFetchRequest(() => {
                        auth.signout(() => history.push("/"));
                    })
                }}
            >
                Sign out
             </button>

        </div>
    ) : (
        <p>You are not logged in.</p>
    );
}

export default AuthButton
