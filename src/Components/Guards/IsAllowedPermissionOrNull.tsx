import React from 'react'
import { useAppSelector } from "../../redux/hooks"

const IsAllowedPermissionOrNull = ({permission, children}:{permission?:string, children:React.ReactNode}) => {
   const {permissions} = useAppSelector(state=>state.auth.user)
  

    return (
        <>
            {
                !permission || permissions?.includes(permission)?
                    children
                :
                    null
            }
        </>
    )
}

export default IsAllowedPermissionOrNull
