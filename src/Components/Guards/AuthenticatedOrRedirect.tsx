import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

const AuthenticatedOrRedirect = ({children}:{children:React.ReactNode}) => {
    const navigate = useNavigate()
    const {pathname} = useLocation()

    useEffect(() => {        
        if (!Cookies.get('access_token')) {           
            navigate(`/auth/login?next=${pathname}`)
        }
    }, [Cookies.get('access_token')])
    return(
        children 
    )
}


export default AuthenticatedOrRedirect