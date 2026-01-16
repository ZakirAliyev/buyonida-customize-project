import {mapPageToTree} from "../../../../utils/treeMapper.js";
import SegmentedControl from "../../../../components/CustomizeStoreAdminComponentsLeft/SegmentedControl/index.jsx";
import BlockItem from "../../../../components/CustomizeStoreAdminComponentsLeft/BlockItem/index.jsx";

export default function LeftPanel({
                                      data,
                                      tab,
                                      setTab,
                                      selectedId,
                                      setSelectedId,
                                      addSection,
                                      addComponent,
                                      deleteBlock,
                                      deleteSection
                                  }) {
    const tree = mapPageToTree(data);

    return (
        <div className="panel leftPanel">
            <button onClick={() => addSection("announcement_bar")}>
                + Announcement bar
            </button>

            {selectedId && (
                <button onClick={() => addComponent({type: "button", sectionId: selectedId})}>
                    + Button
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

            <BlockItem
                {...tree}
                onSelect={node => setSelectedId(node.id)}
                onDelete={({id, type}) => {
                    if (type === "block") deleteBlock(id);
                    if (type === "section") deleteSection(id);
                }}
            />
        </div>
    );
}
