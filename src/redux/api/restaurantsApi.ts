import { apiSlice } from "../services/apiSlice";

const base_url = 'restaurants/'

const restaurantsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder)=>({
        getRestaurantBranchesByCity: builder.query({
            query:()=>({
                url:base_url+'branches/',
            }),
            providesTags:['restaurants']
        }),
        
        // ------------------------------------------------ //

        

    }) 
})


export const {
    useGetRestaurantBranchesByCityQuery

} = restaurantsApiSlice

