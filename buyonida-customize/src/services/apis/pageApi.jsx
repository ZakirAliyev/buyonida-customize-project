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
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        pageApi.util.updateQueryData(
                            "getHomePage",
                            undefined,
                            () => data
                        )
                    );
                } catch (e) {
                    console.error("addComponent failed", e);
                }
            }
        }),
        addSection: builder.mutation({
            query: (type) => ({
                url: `/page/home/section/add/${type}`,
                method: "POST"
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(
                        pageApi.util.updateQueryData(
                            "getHomePage",
                            undefined,
                            () => data
                        )
                    );
                } catch (e) {
                    console.error("addSection failed", e);
                }
            }
        }),
        updateBlock: builder.mutation({
            query: ({ id, settings }) => ({
                url: `/page/home/block/${id}`,
                method: "PUT",
                body: { settings }
            }),
            async onQueryStarted({ id, settings }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    pageApi.util.updateQueryData(
                        "getHomePage",
                        undefined,
                        (draft) => {
                            function findBlock(blocks) {
                                for (const b of blocks) {
                                    if (b.id === id) return b;
                                    if (b.children?.length) {
                                        const found = findBlock(b.children);
                                        if (found) return found;
                                    }
                                }
                                return null;
                            }

                            const block = findBlock(draft.sections[0].blocks);
                            if (block) {
                                block.settings = settings;
                            }
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch (e) {
                    patchResult.undo(); // rollback
                    console.error("updateBlock failed", e);
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
                } catch (e) {
                    patchResult.undo();
                    console.error("deleteBlock failed", e);
                }
            }
        })

    })
});

export const {
    useGetHomePageQuery,
    useAddComponentMutation,
    useUpdateBlockMutation,
    useDeleteBlockMutation,
    useAddSectionMutation
} = pageApi;
