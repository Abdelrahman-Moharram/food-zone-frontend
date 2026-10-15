import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';


const NotAuthenticatedOrRedirect = ({children}:{children:React.ReactNode}) => {
    const nav = useNavigate()

    useEffect(() => {
        if(Cookies.get('access_token')){
            nav("/")
        }
      }, [Cookies.get('access_token')]);

    return(
        children
    )
}

export default NotAuthenticatedOrRedirect