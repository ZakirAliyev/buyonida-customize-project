import {useMemo} from "react";
import {
    useGetHomePageQuery,
    useAddComponentMutation,
    useDeleteBlockMutation,
    useAddSectionMutation,
    useDeleteSectionMutation
} from "../../../services/apis/pageApi.jsx";
import {useEditorLoading} from "../../../context/EditorLoadingContext";

export function useHomePageData() {
    const {data, isLoading, isFetching} = useGetHomePageQuery();
    const [addComponent, addState] = useAddComponentMutation();
    const [deleteBlock, deleteBlockState] = useDeleteBlockMutation();
    const [addSection, addSectionState] = useAddSectionMutation();
    const [deleteSection, deleteSectionState] = useDeleteSectionMutation();
    const {isBusy} = useEditorLoading();

    const safeData = data ?? {zones: [], sections: []};

    const sections = useMemo(() => {
        if (Array.isArray(safeData.sections)) return safeData.sections;
        const mainZone = safeData.zones?.find(z => z.zone === "main");
        return mainZone?.sections ?? [];
    }, [safeData]);

    const loading =
        isLoading ||
        isFetching ||
        addState.isLoading ||
        deleteBlockState.isLoading ||
        addSectionState.isLoading ||
        deleteSectionState.isLoading ||
        isBusy;

    return {
        data: safeData,
        sections,
        loading,
        addComponent,
        deleteBlock,
        addSection,
        deleteSection
    };
}
