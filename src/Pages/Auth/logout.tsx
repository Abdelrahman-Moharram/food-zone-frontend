import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../redux/hooks'
import { setLogout } from '../../redux/features/authSlice'
import { useLogoutMutation } from '../../redux/features/authApiSlice'

const Logout = () => {
    const dispatch = useAppDispatch()
    const [logout] = useLogoutMutation();
    const nav = useNavigate()
    useEffect(()=>{
            logout(undefined)
            .unwrap()
            .then(()=>{
                dispatch(setLogout());
                nav("/auth/login")
            }).catch(()=>{
                nav("/auth/login")
            })
    }, [dispatch])
    return <div></div>
}

export default Logout