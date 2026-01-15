import {
    useAddComponentMutation,
    useAddSectionMutation,
    useDeleteBlockMutation,
    useGetHomePageQuery
} from "../../../services/apis/pageApi.jsx";
import {useBlockSelection} from "../useBlockSelection.js";
import SettingsPanel from "../../../components/SettingsPanel/index.jsx";
import PreviewCanvas from "../PreviewCanvas/index.jsx";

function HomePageInner() {
    const {data, isLoading, isFetching} = useGetHomePageQuery();
    const [addComponent] = useAddComponentMutation();
    const [addSection] = useAddSectionMutation();
    const [deleteBlock] = useDeleteBlockMutation();

    const {
        selectedId,
        setSelectedId,
        selectedBlock
    } = useBlockSelection(data?.sections || []);

    if (isLoading || isFetching || !data) {
        return null;
    }

    return (
        <section id="homePage">
            <div className="builder-layout">
                <div className="preview-area">
                    <button
                        onClick={() =>
                            addComponent({type: "button", parentId: selectedId})
                        }
                    >
                        + Button
                    </button>
                    <button
                        onClick={() => addSection("announcement_bar")}
                    >
                        + Announcement bar
                    </button>

                    <PreviewCanvas
                        sections={data.sections || []}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onDelete={deleteBlock}
                    />
                </div>

                <SettingsPanel block={selectedBlock}/>
            </div>
        </section>
    );
}

export default HomePageInner;
