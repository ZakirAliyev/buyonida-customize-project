import {EditorLoadingProvider} from "../../context/EditorLoadingContext/index.jsx";
import HomePageInner from "./HomePageInner/index.jsx";

function HomePage() {
    return (
        <EditorLoadingProvider>
            <HomePageInner/>
        </EditorLoadingProvider>
    );
}

export default HomePage;
