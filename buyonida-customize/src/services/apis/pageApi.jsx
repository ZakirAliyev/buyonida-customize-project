import { userApi } from "./userApi";

export const pageApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        getHomePage: builder.query({
            query: () => "/page/home"
        }),

        addComponent: builder.mutation({
            query: ({ type, parentId }) => ({
                url: `/page/home/block/add/${type}`,
                method: "POST",
                body: { parentId }
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(
                    pageApi.util.updateQueryData(
                        "getHomePage",
                        undefined,
                        () => data
                    )
                );
            }
        }),

        addSection: builder.mutation({
            query: (type) => ({
                url: `/page/home/section/add/${type}`,
                method: "POST"
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(
                    pageApi.util.updateQueryData(
                        "getHomePage",
                        undefined,
                        () => data
                    )
                );
            }
        }),

        // ✅ DELETE SECTION
        deleteSection: builder.mutation({
            query: (id) => ({
                url: `/page/home/section/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    pageApi.util.updateQueryData(
                        "getHomePage",
                        undefined,
                        (draft) => {
                            draft.sections = draft.sections.filter(
                                s => s.id !== id
                            );
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        deleteBlock: builder.mutation({
            query: (id) => ({
                url: `/page/home/block/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    pageApi.util.updateQueryData(
                        "getHomePage",
                        undefined,
                        (draft) => {
                            function removeBlock(blocks) {
                                return blocks.filter(b => {
                                    if (b.id === id) return false;
                                    if (b.children) {
                                        b.children = removeBlock(b.children);
                                    }
                                    return true;
                                });
                            }

                            draft.sections[0].blocks =
                                removeBlock(draft.sections[0].blocks);
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        })
    })
});

export const {
    useGetHomePageQuery,
    useAddComponentMutation,
    useAddSectionMutation,
    useDeleteBlockMutation,
    useDeleteSectionMutation
} = pageApi;
