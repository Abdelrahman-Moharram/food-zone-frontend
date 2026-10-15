import { useAppSelector } from "../../redux/hooks"


const IsAllowedPermissionOrFalse = (permission:string) =>{
    const {permissions} = useAppSelector(state=>state.auth.user)
    if(permission){
        return permissions.includes(permission)
    }
    return true
}

export default IsAllowedPermissionOrFalse