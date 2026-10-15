import { apiSlice } from "../services/apiSlice";

const base_url = 'utils/'

const utilsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getPaymentMethods: builder.query<any, void>({
            query: () => ({
                url: `${base_url}payments/methods/`,
            }),
            providesTags: ['payments']
        }),
        

       

    })
})


export const {
    useGetPaymentMethodsQuery,
} = utilsApiSlice
