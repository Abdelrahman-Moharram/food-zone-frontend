import React, { useEffect } from 'react'
import { useAppSelector } from '../../redux/hooks'
import { useLocation, useNavigate } from 'react-router-dom'

export const IsAllowedPermissionOrNull = ({permission, children}: {permission:string | string[]; children: React.ReactNode; }) => {
    
    const { permissions } = useAppSelector(state => state.auth.user);
    
    if (!permission)
        return children

    const hasPermission = Array.isArray(permission)
        ? permission.some(p => permissions.includes(p))
        : permissions.includes(permission);

    return hasPermission ? <>{children}</> : null;
};

export const IsAllowedPermissionOrRedirect = ({permission, children}:{permission:string, children:React.ReactNode}) => {
    const {permissions} = useAppSelector(state=>state.auth.user)
    const navigate = useNavigate()
    const {pathname} = useLocation()
    
    useEffect(() => {        
        if (!(permission && permissions.includes(permission))) {           
            navigate(-1)
        }
    }, [permission, pathname, navigate, permissions])

    return (
        children
    )
}

export const IsAllowedPermissionOrFalse = (permission:string) =>{
    const {permissions} = useAppSelector(state=>state.auth.user)

    if(permission){    
        return permissions.includes(permission)
    }
    return true
}

