import MainPage from "../pages/UserPages/index.jsx";
import HomePage from "../pages/HomePage/index.jsx";
import SiteRender from "../components/SiteRender/index.jsx";

export const ROUTES = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: "/deneme",
                element: <SiteRender />,
            },
        ]
    }
];
