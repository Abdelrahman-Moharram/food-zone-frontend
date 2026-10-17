import { apiSlice } from "../services/apiSlice";

const base_url = '/restaurants'

const restaurantsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getRestaurantBranchesByCity: builder.query({
            query:()=>({
                url:base_url+'branches/',
            }),
            providesTags:['restaurants']
        }),
        
        // ---------------- Workers ---------------- //
        getWorkers: builder.query({
            query:(params)=>({
                url:base_url+'workers/',
                params
            }),
            providesTags:['users']
        }),
        addWorker: builder.mutation({
            query:(data)=>({
                url:base_url+'workers/create/',
                method:'POST',
                body:data
            }),
            invalidatesTags:['users']
        }),
        updateWorker: builder.mutation({
            query:({id, data})=>({
                url:base_url+`workers/${id}/update/`,
                method:'PATCH',
                body:data
            }),
            invalidatesTags:['users']
        }),
        deleteWorker: builder.mutation({
            query:(id)=>({
                url:base_url+`workers/${id}/delete/`,
                method:'DELETE'
            }),
            invalidatesTags:['users']
        }),

    }) 
})


export const {
    useGetRestaurantBranchesByCityQuery,
    useGetWorkersQuery,
    useAddWorkerMutation,
    useUpdateWorkerMutation,
    useDeleteWorkerMutation
} = restaurantsApiSlice

