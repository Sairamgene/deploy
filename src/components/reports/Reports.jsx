import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';

function Reports() {

    const history = useHistory();
    const match = useRouteMatch();
    const authUser = useSelector((store) => store.auth.authUser);
    
    useEffect(() => {
        console.log("Reports ", authUser)
        if (authUser) {
            history.push(`${match.url}`)
        }
        else{
            history.push('/login')
        }
    }, []);

    return (
        <div>Reports!</div>
    )
}

export default Reports
