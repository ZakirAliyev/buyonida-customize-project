import './index.scss'
import {useState} from "react";
import {RxExit} from "react-icons/rx";

import edit from "/src/assets/icons/edit.svg";
import pcIcon from "/src/assets/icons/pc.svg";
import mobileIcon from "/src/assets/icons/mobile.svg";
import fullScreenIcon from "/src/assets/icons/fullScreen.svg";
import undoIcon from "/src/assets/icons/undo.svg";
import redoIcon from "/src/assets/icons/redo.svg";
import home from "/src/assets/icons/home.svg";
import dots from "/src/assets/icons/dots.svg";

function HomePageNavbar() {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const buttons = [
        {label: "PC", icon: pcIcon},
        {label: "Mobile", icon: mobileIcon},
        {label: "Full Screen", icon: fullScreenIcon}
    ];

    return (
        <section id="homePageNavbar">
            <div className="left">
                <div className="exit">
                    <RxExit className="icon"/>
                    Exit
                </div>

                <div className="divider"></div>

                <div className="storeName mobileNone">Store name</div>

                <div className="storeStatus mobileNone">
                    <div className="circle"></div>
                    Active Store
                </div>
            </div>

            <div className="mid">
                <img src={home} className="icon mobileNone" alt={"Icon"}/>
                <div className={"textWrapper"}>
                    <div>Home page</div>
                    <div className={"text onlyMobile"}>
                        <div className={"circle"}></div>
                        Store name
                    </div>
                </div>
            </div>

            <div className="right mobileNone">
                <button
                    className={`button`}
                >
                    <img src={edit} className="icon" alt={"Icon"}/>
                </button>
                <div className="buttonWrapper">
                    {buttons.map((btn, i) => (
                        <button
                            key={btn.label}
                            className={`button ${selectedIndex === i ? "selected" : ""}`}
                            onClick={() => setSelectedIndex(i)}
                            title={btn.label}
                        >
                            <img src={btn.icon} className="icon" alt={btn.label}/>
                        </button>
                    ))}
                </div>
                <div className={"button1Wrapper"}>
                    <button
                        className={`button button1`}
                    >
                        <img src={undoIcon} className="icon" alt={"Icon"}/>
                    </button>
                    <button
                        className={`button button1`}
                    >
                        <img src={redoIcon} className="icon" alt={"Icon"}/>
                    </button>
                </div>

                <button
                    className={`button button4`}
                >
                    Save
                </button>
            </div>
            <div className={"divider onlyMobile"}></div>
            <div className={"dotsWrapper onlyMobile"}>
                <img src={dots} alt={"Icon"} className={"icon"}/>
            </div>
            <div className={"divider onlyMobile"}></div>
            <div className={"onlyMobile"}>
                <button
                    className={`button button2`}
                >
                    Save
                </button>
            </div>
        </section>
    );
}

export default HomePageNavbar;
