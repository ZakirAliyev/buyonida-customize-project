import { userApi } from "./userApi";

export const pageApi = userApi.injectEndpoints({
    endpoints: (builder) => ({
        // ==========================
        // GET HOME PAGE
        // ==========================
        getHomePage: builder.query({
            query: () => "/page/home"
        }),

        // ==========================
        // ADD BLOCK (section daxilinə)
        // ==========================
        addComponent: builder.mutation({
            query: ({ type, parentId, sectionId }) => ({
                url: `/page/home/block/add/${type}`,
                method: "POST",
                body: {
                    parentId,   // block parent id (optional)
                    sectionId   // ✅ new (optional, backend fallback var)
                }
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(
                    pageApi.util.updateQueryData("getHomePage", undefined, () => data)
                );
            }
        }),

        // ==========================
        // ADD SECTION (zone daxilinə)
        // ==========================
        addSection: builder.mutation({
            query: (zone) => ({
                // sənin router-də hələ :type idi, amma biz zone kimi istifadə edirik
                url: `/page/home/section/add/${zone}`, // header | main | footer
                method: "POST"
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(
                    pageApi.util.updateQueryData("getHomePage", undefined, () => data)
                );
            }
        }),

        // ==========================
        // UPDATE BLOCK SETTINGS
        // ==========================
        updateBlock: builder.mutation({
            query: ({ id, settings }) => ({
                url: `/page/home/block/${id}`,
                method: "PUT",
                body: { settings }
            }),
            async onQueryStarted({ id, settings }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    pageApi.util.updateQueryData("getHomePage", undefined, (draft) => {
                        function updateBlocks(blocks) {
                            for (const block of blocks) {
                                if (block.id === id) {
                                    block.settings = settings;
                                    return true;
                                }
                                if (block.children?.length) {
                                    if (updateBlocks(block.children)) return true;
                                }
                            }
                            return false;
                        }

                        // zones varsa zones ilə
                        if (draft.zones?.length) {
                            draft.zones.forEach(zone => {
                                zone.sections?.forEach(section => {
                                    updateBlocks(section.blocks || []);
                                });
                            });
                        }

                        // legacy: draft.sections varsa (backend response-da var)
                        if (draft.sections?.length) {
                            draft.sections.forEach(section => {
                                updateBlocks(section.blocks || []);
                            });
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        // ==========================
        // DELETE SECTION
        // ==========================
        deleteSection: builder.mutation({
            query: (id) => ({
                url: `/page/home/section/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    pageApi.util.updateQueryData("getHomePage", undefined, (draft) => {
                        if (draft.zones?.length) {
                            draft.zones.forEach(zone => {
                                zone.sections = (zone.sections || []).filter(s => s.id !== id);
                            });
                        }
                        if (draft.sections?.length) {
                            draft.sections = draft.sections.filter(s => s.id !== id);
                        }
                    })
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            }
        }),

        // ==========================
        // DELETE BLOCK
        // ==========================
        deleteBlock: builder.mutation({
            query: (id) => ({
                url: `/page/home/block/${id}`,
                method: "DELETE"
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    pageApi.util.updateQueryData("getHomePage", undefined, (draft) => {
                        function removeBlock(blocks) {
                            return (blocks || []).filter(block => {
                                if (block.id === id) return false;
                                if (block.children?.length) {
                                    block.children = removeBlock(block.children);
                                }
                                return true;
                            });
                        }

                        if (draft.zones?.length) {
                            draft.zones.forEach(zone => {
                                zone.sections?.forEach(section => {
                                    section.blocks = removeBlock(section.blocks);
                                });
                            });
                        }

                        if (draft.sections?.length) {
                            draft.sections.forEach(section => {
                                section.blocks = removeBlock(section.blocks);
                            });
                        }
                    })
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
    useUpdateBlockMutation,
    useDeleteBlockMutation,
    useDeleteSectionMutation
} = pageApi;
