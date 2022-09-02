import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route } from 'react-router-dom'

const ProtoectedRoute = ({component: SomeComponent, ...rest}) => {

    const authUser = useSelector((state) => state.auth.authUser);
    const userRoles = useSelector((state) => state.auth.roles);

    

    return (
        <Route 
            {...rest} 
            render={(props) => {
                // console.log('ROUTE ROLES', rest.roles);
                // console.log(userRoles);

                const matchRoles = rest.roles.every(role => userRoles.includes(role));
                // console.log(matchRoles);

                    if (authUser && matchRoles ) {
                        return <SomeComponent {...props}/> 
                    } 
                    else {
                        return <Redirect to={{
                            pathname: '/login',
                            state: {
                                from: props.location
                            }
                        }}/>
                    }

                }
            }
        />
    )
}

export default ProtoectedRoute
