import React, { useContext } from 'react'

import { Route, Redirect } from 'react-router-dom';

import { authContext } from './ProvideAuth';


function useAuth() {
    return useContext(authContext);
}

function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    console.log(auth.user)
    return (
        <Route
            {...rest}
            render={({ location }) =>
                auth.user ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: location }
                            }}
                        />
                    )
            }
        />
    );
}

export default PrivateRoute
