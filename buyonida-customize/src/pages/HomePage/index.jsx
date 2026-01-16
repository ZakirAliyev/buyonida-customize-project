import "./index.scss";
import {useState, useMemo} from "react";
import {renderLiquid} from "../../theme/engine/renderLiquid.js";
import {
    useGetHomePageQuery,
    useAddComponentMutation,
    useDeleteBlockMutation,
    useAddSectionMutation,
    useDeleteSectionMutation
} from "../../services/apis/pageApi.jsx";
import TopLoadingBar from "../../components/TopLoadingBar/index.jsx";
import {EditorLoadingProvider, useEditorLoading} from "../../context/EditorLoadingContext/index.jsx";
import HomePageNavbar from "../../components/HomePageNavbar/index.jsx";
import TabMenu from "../../components/CustomizeStoreAdminComponentsRight/TabMenu/index.jsx";
import SelectOption from "../../components/CustomizeStoreAdminComponentsRight/SelectOption/index.jsx";
import CountSlider from "../../components/CustomizeStoreAdminComponentsRight/CountSlider/index.jsx";
import ToggleSwitcher from "../../components/CustomizeStoreAdminComponentsRight/ToggleSwitcher/index.jsx";
import UploadMedia from "../../components/CustomizeStoreAdminComponentsRight/UploadMedia/index.jsx";
import ColorPicker from "../../components/CustomizeStoreAdminComponentsRight/ColorPicker/index.jsx";
import SchemeInput from "../../components/CustomizeStoreAdminComponentsRight/SchemeInput/index.jsx";
import TextInput from "../../components/CustomizeStoreAdminComponentsRight/TextInput/index.jsx";
import TextEditor from "../../components/CustomizeStoreAdminComponentsRight/TextEditor/index.jsx";
import {useFormik} from "formik";
import BlockItem from "../../components/CustomizeStoreAdminComponentsLeft/BlockItem/index.jsx";
import SegmentedControl from "../../components/CustomizeStoreAdminComponentsLeft/SegmentedControl/index.jsx";
import SettingsPanel from "../../components/SettingsPanel/index.jsx";
import {mapPageToTree} from "../../utils/treeMapper.js";

function HomePageInner() {
    /* ==========================
       HOOKS (HƏMİŞƏ YUXARIDA)
    ========================== */
    const {data, isLoading, isFetching} = useGetHomePageQuery();

    const [addComponent, addState] = useAddComponentMutation();
    const [deleteBlock, deleteBlockState] = useDeleteBlockMutation();

    const [addSection, addSectionState] = useAddSectionMutation();
    const [deleteSection, deleteSectionState] = useDeleteSectionMutation();

    const {isBusy} = useEditorLoading();

    const [selectedId, setSelectedId] = useState(null);
    const [tab, setTab] = useState("sections");

    const [gap, setGap] = useState(0);
    const [scheme, setScheme] = useState(1);

    const formik = useFormik({
        initialValues: {subtitle_en: ""},
        onSubmit: (values) => console.log(values),
    });

    const loading =
        isLoading ||
        isFetching ||
        addState.isLoading ||
        deleteBlockState.isLoading ||
        addSectionState.isLoading ||
        deleteSectionState.isLoading ||
        isBusy;

    /* ==========================
       SAFE DATA (HOOK ORDER FIX)
    ========================== */
    const safeData = data ?? {zones: [], sections: []};

    /* ==========================
       SECTIONS (MAIN ZONE / LEGACY)
    ========================== */
    const sections = useMemo(() => {
        // backend legacy response: sections
        if (Array.isArray(safeData.sections)) return safeData.sections;

        // zone-based: main zone sections
        const mainZone = safeData.zones?.find(z => z.zone === "main");
        return mainZone?.sections ?? [];
    }, [safeData]);

    const mapBlockToTreeItem = (block) => ({
        id: block.id,
        type: "block",
        blockType: block.type,
        label: block.type,
        children: block.children?.length
            ? block.children.map(mapBlockToTreeItem)
            : []
    });

    const mapSectionToTreeItem = (section) => ({
        id: section.id,
        type: "section",
        label: section.type === "announcement_bar" ? "Announcement bar" : "Section",
        children: section.blocks?.length
            ? section.blocks.map(mapBlockToTreeItem)
            : []
    });

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

    const selectedSectionId = useMemo(() => {
        if (!selectedId) return null;

        // selectedId birbaşa section-dursa
        const direct = sections.find(s => s.id === selectedId);
        if (direct) return direct.id;

        // block-dursa → hansı section-da olduğunu tap
        for (const sec of sections) {
            const found = findBlock(sec.blocks ?? [], selectedId);
            if (found) return sec.id;
        }

        return null;
    }, [selectedId, sections]);

    const selectedBlock = useMemo(() => {
        if (!selectedId) return null;
        for (const sec of sections) {
            const found = findBlock(sec.blocks ?? [], selectedId);
            if (found) return found;
        }
        return null;
    }, [selectedId, sections]);

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
                <button class="delete-btn" data-delete="${block.id}" data-delete-type="block">×</button>
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

    /* ==========================
       PREVIEW HTML (SECTION AWARE)
    ========================== */
    const previewHtml = (sections ?? [])
        .map(section => {
            // 🔔 Announcement bar section
            if (section.type === "announcement_bar") {
                const text =
                    section.settings?.text ??
                    "Announcement bar";

                return `
                    <div class="announcement-bar section-wrapper ${section.id === selectedId ? "selected" : ""}"
                         data-id="${section.id}">
                        <div class="section-overlay"></div>
                        <button class="delete-btn" data-delete="${section.id}" data-delete-type="section">×</button>
                        <div class="announcement-content">${text}</div>
                    </div>
                `;
            }

            // 🧱 Normal section -> render blocks
            return (section.blocks ?? []).map(renderBlock).join("");
        })
        .join("");

    const firstSectionId = sections?.[0]?.id ?? null;

    // (optional) announcement artıq varsa, düyməni disable etmək üçün:
    const hasAnnouncement = useMemo(
        () => (sections ?? []).some(s => s.type === "announcement_bar"),
        [sections]
    );

    /* ==========================
       RENDER GUARD (HOOKS BITDI)
    ========================== */
    if (!data && loading) {
        return <TopLoadingBar loading/>;
    }

    return (
        <section id="homePage">
            <TopLoadingBar loading={loading}/>
            <HomePageNavbar/>

            <div className="panelWrapper">
                <div className="panel leftPanel">
                    <button
                        onClick={() => addSection("announcement_bar")}
                        disabled={hasAnnouncement}
                        style={{marginBottom: 10}}
                    >
                        {hasAnnouncement ? "Announcement bar already added" : "+ Announcement bar"}
                    </button>
                    {selectedId && (
                        <button
                            onClick={() =>
                                addComponent({
                                    type: "button",
                                    parentId: null,
                                    sectionId: selectedId
                                })
                            }
                            style={{marginBottom: 10}}
                        >
                            + Button (Announcement)
                        </button>
                    )}

                    <SegmentedControl
                        value={tab}
                        onChange={setTab}
                        options={[
                            {label: "Sections", value: "sections"},
                            {label: "Settings", value: "settings"}
                        ]}
                    />

                    {(() => {
                        const tree = mapPageToTree(safeData);

                        return (
                            <BlockItem
                                id={tree.id}
                                type={tree.type}
                                label={tree.label}
                                onSelect={(node) => setSelectedId(node.id)}
                                onDelete={({ id, type }) => {
                                    if (type === "section") {
                                        deleteSection(id);
                                    }

                                    if (type === "block") {
                                        deleteBlock(id);
                                    }
                                }}
                                children={tree.children}
                            />
                        );
                    })()}
                </div>

                <div className="orta">
                    <div className="ortaWrapper"></div>
                </div>

                <div className="panel rightPanel">
                    <TextInput name={"Text"} isDropdown/>
                    <TextEditor/>
                    <UploadMedia/>
                    <TabMenu name={"Direction"} props={["vertical", "horizontal"]}/>
                    <TabMenu name={"Alignment"} props={["left", "center", "right"]}/>
                    <SelectOption name={"Type"} props={["grid", "carrousel", "editorial"]}/>
                    <ColorPicker name="Background" value="#F5F5F5" onChange={() => {
                    }}/>
                    <SchemeInput name={"Color scheme"} value={scheme} onChange={(id) => setScheme(id)}/>
                    <CountSlider name="Gap" value={gap} min={0} max={100} onChange={setGap} type={"px"}/>
                    <ToggleSwitcher name="Background overlay" defaultValue={true}/>
                </div>
            </div>

            <div className="builder-layout">
                <div className="preview-area">
                    <div
                        className="preview-canvas"
                        onClick={(e) => {
                            const delId = e.target.dataset.delete;
                            const delType = e.target.dataset.deleteType;

                            if (delId && delType === "block") {
                                deleteBlock(delId);
                                return;
                            }

                            if (delId && delType === "section") {
                                deleteSection(delId);
                                return;
                            }

                            const wrapper = e.target.closest(".section-wrapper");
                            if (!wrapper) return;
                            setSelectedId(wrapper.dataset.id);
                        }}
                        dangerouslySetInnerHTML={{
                            __html: previewHtml
                        }}
                    />
                </div>

                <SettingsPanel block={selectedBlock}/>
            </div>
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
