import './index.scss'
import {useState} from "react";
import {renderLiquid} from "../../theme/engine/renderLiquid.js";
import {
    useGetHomePageQuery,
    useAddComponentMutation,
    useDeleteBlockMutation
} from "../../services/apis/pageApi.jsx";
import SettingsPanel from "../../components/SettingsPanel/index.jsx";
import TopLoadingBar from "../../components/TopLoadingBar/index.jsx";
import {EditorLoadingProvider, useEditorLoading} from "../../context/EditorLoadingContext/index.jsx";
import HomePageNavbar from "../../components/HomePageNavbar/index.jsx";
import TabMenu from "../../components/CustomizeStoreAdminComponents/TabMenu/index.jsx";
import SelectOption from "../../components/CustomizeStoreAdminComponents/SelectOption/index.jsx";
import CountSlider from "../../components/CustomizeStoreAdminComponents/CountSlider/index.jsx";
import ToggleSwitcher from "../../components/CustomizeStoreAdminComponents/ToggleSwitcher/index.jsx";
import UploadMedia from "../../components/CustomizeStoreAdminComponents/UploadMedia/index.jsx";
import ColorPicker from "../../components/CustomizeStoreAdminComponents/ColorPicker/index.jsx";
import SchemeInput from "../../components/CustomizeStoreAdminComponents/SchemeInput/index.jsx";
import TextInput from "../../components/CustomizeStoreAdminComponents/TextInput/index.jsx";
import TextEditor from "../../components/CustomizeStoreAdminComponents/TextEditor/index.jsx";

function HomePageInner() {
    const {data, isLoading, isFetching} = useGetHomePageQuery();
    const [addComponent, addState] = useAddComponentMutation();
    const [deleteBlock, deleteState] = useDeleteBlockMutation();
    const [selectedId, setSelectedId] = useState(null);

    const [gap, setGap] = useState(0);
    const [scheme, setScheme] = useState(1);

    const {isBusy} = useEditorLoading();
    const loading =
        isLoading ||
        isFetching ||
        addState.isLoading ||
        deleteState.isLoading ||
        isBusy;

    if (!data) return null;

    const findBlock = (blocks, id) => {
        for (const block of blocks) {
            if (block.id === id) return block;
            if (block.children?.length) {
                const found = findBlock(block.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const selectedBlock = findBlock(data.sections[0].blocks, selectedId);

    const renderBlock = (block) => {
        let childrenHtml = "";
        if (block.children?.length) {
            childrenHtml = block.children.map(renderBlock).join("");
        }

        const flexDirection = block.settings?.direction === "horizontal" ? "row" : "column";

        const alignItems =
            block.settings?.alignment === "left"
                ? "flex-start"
                : block.settings?.alignment === "center"
                    ? "center"
                    : "flex-end";

        const justifyContent =
            block.settings?.position === "left"
                ? "flex-start"
                : block.settings?.position === "center"
                    ? "center"
                    : "flex-end";

        return `
            <div class="section-wrapper ${block.id === selectedId ? "selected" : ""}" data-id="${block.id}">
                <div class="section-overlay"></div>
                <button class="delete-btn" data-delete="${block.id}">×</button>
                ${renderLiquid(block.template, {
            ...block.settings,
            flexDirection,
            alignItems,
            justifyContent,
            target: block.settings?.newTab ? "_blank" : "",
            children: childrenHtml
        })}
            </div>
        `;
    };

    return (
        <section id={"homePage"}>
            <TopLoadingBar loading={loading}/>
            <HomePageNavbar/>

            <div className={"panelWrapper"}>
                <div className={"panel leftPanel"}>Sol</div>
                <div className={"orta"}>
                    <div className={"ortaWrapper"}>

                    </div>
                </div>
                <div className={"panel rightPanel"}>
                    <TabMenu name={"Alignment"} props={['left', 'center', 'right']}/>
                    <TabMenu name={"Direction"} props={['vertical', 'horizontal']}/>
                    <SelectOption name={"Type"} props={['grid', 'carrousel', 'editorial']}/>
                    <CountSlider name="Gap" value={gap} min={0} max={100} onChange={setGap} type={"px"}/>
                    <ToggleSwitcher name="Background overlay" defaultValue={true}/>
                    <UploadMedia/>
                    <ColorPicker name="Background" value="#F5F5F5" onChange={(color) => console.log(color)}/>
                    <SchemeInput name={"Color scheme"} value={scheme} onChange={(id) => setScheme(id)}/>
                    <TextInput name={"Text"} isIcon isDropdown/>
                    {/*<TextEditor name="Description" placeholder="New arrivals" disabled={false}/>*/}
                </div>
            </div>

            {/*<div className="builder-layout">*/}
            {/*    <div className="preview-area">*/}
            {/*        <button onClick={() => addComponent({ type: "button", parentId: selectedId })}>+ Button</button>*/}
            {/*        <button onClick={() => addComponent({ type: "paragraph", parentId: selectedId })}>+ Paragraph</button>*/}
            {/*        <button onClick={() => addComponent({ type: "group", parentId: selectedId })}>+ Group</button>*/}

            {/*        <div*/}
            {/*            className="preview-canvas"*/}
            {/*            onClick={(e) => {*/}
            {/*                const delId = e.target.dataset.delete;*/}
            {/*                if (delId) {*/}
            {/*                    deleteBlock(delId);*/}
            {/*                    return;*/}
            {/*                }*/}
            {/*                const wrapper = e.target.closest(".section-wrapper");*/}
            {/*                if (!wrapper) return;*/}
            {/*                setSelectedId(wrapper.dataset.id);*/}
            {/*            }}*/}
            {/*            dangerouslySetInnerHTML={{*/}
            {/*                __html: data.sections[0].blocks.map(renderBlock).join("")*/}
            {/*            }}*/}
            {/*        />*/}
            {/*    </div>*/}

            {/*    <SettingsPanel block={selectedBlock} />*/}
            {/*</div>*/}
        </section>
    );
}

function HomePage() {
    return (
        <EditorLoadingProvider>
            <HomePageInner/>
        </EditorLoadingProvider>
    );
}

export default HomePage;
