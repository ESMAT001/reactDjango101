import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from './auth'

function LoginRequired({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={
                props => {

                    if (!auth.isAuthenticated) {
                        return <Redirect
                            to={{
                                pathname: '/',
                                state: {
                                    from: props.location
                                }
                            }}
                        />
                    }

                    return <Component {...props} />
                }

            }

        />
    )
}

export default LoginRequired
