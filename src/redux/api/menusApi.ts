import { apiSlice } from "../services/apiSlice";

const base_url = '/restaurants/menus'

const requestsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // ------------------- menus -----------------//
        getMenusList: builder.query({
            query: () => ({
                url: `${base_url}/`,
            }),
            providesTags: ['menus']
        }),

        getMenuDetails: builder.query({
            query: ({menu}:{menu? :string}) => ({
                url     : `${base_url}/details/`,
                params  : { menu }    
            }),
            providesTags: ['menus']
        }),
        
        addMenu: builder.mutation({
            query: ({form}:{form: FormData}) => ({
                url     : `${base_url}/add/`,
                body    : form,
                method  : 'post'
            }),
            invalidatesTags : ['menus']
        }),



        // -----------------------------------------------//


    })
})


export const {
    useGetMenusListQuery,
    useGetMenuDetailsQuery,
    useAddMenuMutation


} = requestsApiSlice

