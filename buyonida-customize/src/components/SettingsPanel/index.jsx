import './index.scss'
import ButtonSettings from "./ButtonSettings/index.jsx";
import GroupSettings from "./GroupSettings/index.jsx";

function SettingsPanel({ block }) {
    if (!block) {
        return (
            <div className="settings-panel">
                <p>Select a block</p>
            </div>
        );
    }

    if (block.type === "button") {
        return <ButtonSettings section={block} />;
    }

    if (block.type === "group") {
        return <GroupSettings block={block} />;
    }

    return (
        <div className="settings-panel">
            <p>No settings available</p>
        </div>
    );
}

export default SettingsPanel;
