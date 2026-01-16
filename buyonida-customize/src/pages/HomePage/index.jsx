import "./index.scss";
import {useState} from "react";
import {EditorLoadingProvider} from "../../context/EditorLoadingContext";
import HomePageNavbar from "../../components/HomePageNavbar";
import TopLoadingBar from "../../components/TopLoadingBar";

import {useHomePageData} from "./hooks/useHomePageData";
import {useSelection} from "./hooks/useSelection";

import LeftPanel from "./panels/LeftPanel";
import RightPanel from "./panels/RightPanel";
import PreviewPanel from "./panels/PreviewPanel";
import SettingsPanel from "../../components/SettingsPanel";

function HomePageInner() {
    const {
        data,
        sections,
        loading,
        addComponent,
        deleteBlock,
        addSection,
        deleteSection
    } = useHomePageData();

    const [selectedId, setSelectedId] = useState(null);
    const [tab, setTab] = useState("sections");

    const {selectedBlock} = useSelection(selectedId, sections);

    return (
        <section id="homePage">
            <TopLoadingBar loading={loading}/>
            <HomePageNavbar/>

            <div className="panelWrapper">
                <LeftPanel
                    data={data}
                    tab={tab}
                    setTab={setTab}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    addSection={addSection}
                    addComponent={addComponent}
                    deleteBlock={deleteBlock}
                    deleteSection={deleteSection}
                />

                <PreviewPanel
                    sections={sections}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    deleteBlock={deleteBlock}
                    deleteSection={deleteSection}
                />

                <RightPanel/>
            </div>

            <SettingsPanel block={selectedBlock}/>
        </section>
    );
}

export default function HomePage() {
    return (
        <EditorLoadingProvider>
            <HomePageInner/>
        </EditorLoadingProvider>
    );
}
