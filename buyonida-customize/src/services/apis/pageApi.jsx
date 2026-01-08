import { userApi } from "./userApi";

export const pageApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        getHomePage: builder.query({
            query: () => "/page/home",
            providesTags: ["HomePage"]
        }),
        addComponent: builder.mutation({
            query: ({ type, parentId }) => ({
                url: `/page/home/add/${type}`,
                method: "POST",
                body: { parentId }
            }),
            invalidatesTags: ["HomePage"]
        }),
        updateBlock: builder.mutation({
            query: ({ id, settings }) => ({
                url: `/page/home/block/${id}`,
                method: "PUT",
                body: { settings }
            }),
            invalidatesTags: ["HomePage"]
        }),
        deleteBlock: builder.mutation({
            query: (id) => ({
                url: `/page/home/block/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["HomePage"]
        })
    })
});

export const {
    useGetHomePageQuery,
    useAddComponentMutation,
    useUpdateBlockMutation,
    useDeleteBlockMutation
} = pageApi;
