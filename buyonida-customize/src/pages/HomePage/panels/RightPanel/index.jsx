import TextInput from "../../../../components/CustomizeStoreAdminComponentsRight/TextInput/index.jsx";
import TextEditor from "../../../../components/CustomizeStoreAdminComponentsRight/TextEditor/index.jsx";
import UploadMedia from "../../../../components/CustomizeStoreAdminComponentsRight/UploadMedia/index.jsx";
import TabMenu from "../../../../components/CustomizeStoreAdminComponentsRight/TabMenu/index.jsx";
import ColorPicker from "../../../../components/CustomizeStoreAdminComponentsRight/ColorPicker/index.jsx";
import SchemeInput from "../../../../components/CustomizeStoreAdminComponentsRight/SchemeInput/index.jsx";
import CountSlider from "../../../../components/CustomizeStoreAdminComponentsRight/CountSlider/index.jsx";
import ToggleSwitcher from "../../../../components/CustomizeStoreAdminComponentsRight/ToggleSwitcher/index.jsx";

export default function RightPanel() {
    return (
        <div className="panel rightPanel">
            <TextInput name="Text" isDropdown/>
            <TextEditor/>
            <UploadMedia/>
            <TabMenu name="Direction" props={["vertical", "horizontal"]}/>
            <TabMenu name="Alignment" props={["left", "center", "right"]}/>
            <ColorPicker name="Background"/>
            <SchemeInput name="Color scheme"/>
            <CountSlider name="Gap" min={0} max={100} type="px"/>
            <ToggleSwitcher name="Background overlay"/>
        </div>
    );
}
