
import { useLocation, useNavigate } from "react-router-dom"
import { useAppSelector } from "../../redux/hooks"

import { useEffect } from "react"

const IsAllowedPermissionOrRedirect = ({permission, children}:{permission:string, children:React.ReactNode}) => {
    const {permissions} = useAppSelector(state=>state.auth.user)
    const navigate      = useNavigate()
    const {pathname}    = useLocation()
    
    useEffect(() => {
        if (!(permission && permissions.includes(permission))) {           
            navigate(-1)
        }
    }, [permission, pathname, permissions, navigate])

    return (
        children
    )
}

export default IsAllowedPermissionOrRedirect