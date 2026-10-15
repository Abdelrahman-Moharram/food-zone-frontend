import { apiSlice } from "../services/apiSlice";

const base_url = 'roles/'
const rolesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getRolesList: builder.query({
            query:({page, size}:{page:number, size:number})=>({
                url:base_url,
                params:{page, size}
            }),
            providesTags:['roles']
        }),
        addRole: builder.mutation({
            query:({form}:{form:FormData})=>({
                url: base_url+'add/',
                body:form,
                method:'POST'
            }),
            invalidatesTags:['roles']
        }),
        editRole: builder.mutation({
            query:({form, id}:{form:FormData, id:string})=>({
                url: base_url+id+'/edit/',
                body:form,
                method:'PUT'
            }),
            invalidatesTags:['roles']
        }),
        roleDetails: builder.mutation({
            query:({id}:{id:string})=>({
                url: base_url+id+'/form-data/',
                // body:form,
                method:'GET'
            }),
            invalidatesTags:['roles']
        }),
        rolePermissionsDetails: builder.query({
            query:({id}:{id:string})=>({
                url: base_url+id+'/',
                method:'GET'
            }),
            providesTags:['roles-permissions']
        }),
        addPermissionToRole: builder.mutation({
            query:({id, permission_id}:{id:string, permission_id:string})=>({
                url: base_url+id+'/add-permission/',
                method:'PUT',
                body:{permission_id}
            }),
            invalidatesTags:['roles-permissions']
        }),
        getRolesAsSelectList: builder.query({
            query:({exclude}:{exclude:string})=>({
                url: base_url+'select-list/',
                method:'GET',
                params:{exclude}
            }),
        }),
        
        deleteRole: builder.mutation({
            query:({roleId, alter_role}:{roleId:string, alter_role:string})=>({
                url: base_url+roleId+'/delete/',
                method:'DELETE',
                body:{alter_role}
            }),
            invalidatesTags:['roles']
        }),
    }),
    
}) 


export const {
    useGetRolesListQuery,
    useAddRoleMutation,
    useEditRoleMutation,
    useRoleDetailsMutation,
    useRolePermissionsDetailsQuery,
    useAddPermissionToRoleMutation,
    useGetRolesAsSelectListQuery,
    useDeleteRoleMutation
} = rolesApiSlice