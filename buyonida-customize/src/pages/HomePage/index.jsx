import './index.scss'
import {useRef, useState} from "react";
import {renderLiquid} from "../../theme/engine/renderLiquid.js";
import {
    useGetHomePageQuery,
    useAddComponentMutation,
    useDeleteBlockMutation
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
import SectionTree from "../../components/CustomizeStoreAdminComponentsLeft/BlockItem/index.jsx";
import BlockItem from "../../components/CustomizeStoreAdminComponentsLeft/BlockItem/index.jsx";

function HomePageInner() {
    // const {data, isLoading, isFetching} = useGetHomePageQuery();
    // const [addComponent, addState] = useAddComponentMutation();
    // const [deleteBlock, deleteState] = useDeleteBlockMutation();
    const [selectedId, setSelectedId] = useState(null);
    const formik = useFormik({
        initialValues: {
            subtitle_en: "",
        },
        onSubmit: (values) => {
            console.log(values);
        },
    });

    const [gap, setGap] = useState(0);
    const [scheme, setScheme] = useState(1);
    //
    // const {isBusy} = useEditorLoading();
    // const loading =
    //     isLoading ||
    //     isFetching ||
    //     addState.isLoading ||
    //     deleteState.isLoading ||
    //     isBusy;
    //
    // if (!data) return null;
    //
    // const findBlock = (blocks, id) => {
    //     for (const block of blocks) {
    //         if (block.id === id) return block;
    //         if (block.children?.length) {
    //             const found = findBlock(block.children, id);
    //             if (found) return found;
    //         }
    //     }
    //     return null;
    // };
    //
    // const selectedBlock = findBlock(data.sections[0].blocks, selectedId);
    //
    // const renderBlock = (block) => {
    //     let childrenHtml = "";
    //     if (block.children?.length) {
    //         childrenHtml = block.children.map(renderBlock).join("");
    //     }
    //
    //     const flexDirection = block.settings?.direction === "horizontal" ? "row" : "column";
    //
    //     const alignItems =
    //         block.settings?.alignment === "left"
    //             ? "flex-start"
    //             : block.settings?.alignment === "center"
    //                 ? "center"
    //                 : "flex-end";
    //
    //     const justifyContent =
    //         block.settings?.position === "left"
    //             ? "flex-start"
    //             : block.settings?.position === "center"
    //                 ? "center"
    //                 : "flex-end";
    //
    //     return `
    //         <div class="section-wrapper ${block.id === selectedId ? "selected" : ""}" data-id="${block.id}">
    //             <div class="section-overlay"></div>
    //             <button class="delete-btn" data-delete="${block.id}">×</button>
    //             ${renderLiquid(block.template, {
    //         ...block.settings,
    //         flexDirection,
    //         alignItems,
    //         justifyContent,
    //         target: block.settings?.newTab ? "_blank" : "",
    //         children: childrenHtml
    //     })}
    //         </div>
    //     `;
    // };

    return (
        <section id={"homePage"}>
            {/*<TopLoadingBar loading={loading}/>*/}
            <HomePageNavbar/>

            <div className={"panelWrapper"}>
                <div className={"panel leftPanel"}>
                    <BlockItem
                        id="announcement-bar"
                        type="section"
                        blockType="announcement"
                        label="Announcement bar"
                        children={[
                            {
                                id: "announcement",
                                type: "block",
                                blockType: "text",
                                label: "Announcement",
                            },
                        ]}
                    />

                    <BlockItem
                        id="header"
                        type="section"
                        blockType="header"
                        label="Header"
                        children={[
                            {
                                id: "logo",
                                type: "block",
                                blockType: "logo",
                                label: "Logo",
                            },
                            {
                                id: "menu",
                                type: "block",
                                blockType: "menu",
                                label: "Menu",
                                children: [
                                    {
                                        id: "menu-item-1",
                                        type: "block",
                                        blockType: "link",
                                        label: "Menu item",
                                    },
                                ],
                            },
                        ]}
                    />

                    <BlockItem
                        id="main-content"
                        type="section"
                        blockType="page"
                        label="Main content"
                        children={[
                            {
                                id: "hero-group",
                                type: "block",
                                blockType: "group",
                                label: "Hero group",
                                children: [
                                    {
                                        id: "hero-heading",
                                        type: "block",
                                        blockType: "heading",
                                        label: "Heading",
                                    },
                                    {
                                        id: "hero-text",
                                        type: "block",
                                        blockType: "text",
                                        label: "Text",
                                    },
                                    {
                                        id: "hero-button",
                                        type: "block",
                                        blockType: "button",
                                        label: "Button",
                                    },
                                ],
                            },
                            {
                                id: "image-section",
                                type: "block",
                                blockType: "image",
                                label: "Image",
                            },
                        ]}
                    />

                    <BlockItem
                        id="footer"
                        type="section"
                        blockType="footer"
                        label="Footer"
                        children={[
                            {
                                id: "footer-group",
                                type: "block",
                                blockType: "group",
                                label: "Footer group",
                                children: [
                                    {
                                        id: "copyright",
                                        type: "block",
                                        blockType: "copyright",
                                        label: "Copyright",
                                    },
                                    {
                                        id: "social-links",
                                        type: "block",
                                        blockType: "social-media-links",
                                        label: "Social media links",
                                    },
                                    {
                                        id: "payment-icons",
                                        type: "block",
                                        blockType: "payment-icons",
                                        label: "Payment icons",
                                    },
                                ],
                            },
                        ]}
                    />
                </div>
                <div className={"orta"}>
                    <div className={"ortaWrapper"}>

                    </div>
                </div>
                <div className={"panel rightPanel"}>
                    <TextInput name={"Text"} isDropdown/>
                    <TextEditor/>
                    <UploadMedia/>
                    <TabMenu name={"Direction"} props={['vertical', 'horizontal']}/>
                    <TabMenu name={"Alignment"} props={['left', 'center', 'right']}/>
                    <SelectOption name={"Type"} props={['grid', 'carrousel', 'editorial']}/>
                    <ColorPicker name="Background" value="#F5F5F5" onChange={() => {
                    }}/>
                    <SchemeInput name={"Color scheme"} value={scheme} onChange={(id) => setScheme(id)}/>
                    <CountSlider name="Gap" value={gap} min={0} max={100} onChange={setGap} type={"px"}/>
                    <ToggleSwitcher name="Background overlay" defaultValue={true}/>
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
