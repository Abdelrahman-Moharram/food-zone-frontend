import { apiSlice } from "../services/apiSlice";

const base_url = '/orders'

const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        listOrders: builder.query({
            query: () => ({
                url: `${base_url}`,
                method: 'GET',
            }),
            providesTags: ['orders']
        }),

        createOrder: builder.mutation({
            query: ({ form }: { form: FormData }) => ({
                url: `${base_url}create/`,
                method: 'POST',
                body: form
            }),
            // No invalidatesTags — WebSocket broadcast handles cache updates
        }),

        updateOrderState: builder.mutation({
            query: ({ order_id, state }: { order_id: string; state: string }) => ({
                url: `${base_url}${order_id}/update/`,
                method: 'PATCH',
                body: { state }
            }),
            // No invalidatesTags — WebSocket broadcast handles cache updates
        }),

        updateOrderItems: builder.mutation({
            query: ({ order_id, items_update = [], items_delete = [], items_add = [] }: {
                order_id: string;
                items_update?: { id: string; count?: number; size?: string; comment?: string }[];
                items_delete?: string[];
                items_add?: { meal: string; size: string; count: number; comment?: string }[];
            }) => ({
                url: `${base_url}${order_id}/items/`,
                method: 'PATCH',
                body: { items_update, items_delete, items_add }
            }),
            // No invalidatesTags — WebSocket broadcast handles cache updates
        }),

        deleteOrder: builder.mutation({
            query: ({ order_id }: { order_id: string }) => ({
                url: `${base_url}${order_id}/delete/`,
                method: 'DELETE',
            }),
            // No invalidatesTags — WebSocket broadcast handles cache updates
        }),

    })
})


export const {
    useListOrdersQuery,
    useCreateOrderMutation,
    useUpdateOrderStateMutation,
    useUpdateOrderItemsMutation,
    useDeleteOrderMutation,
} = ordersApiSlice;

export { ordersApiSlice };
