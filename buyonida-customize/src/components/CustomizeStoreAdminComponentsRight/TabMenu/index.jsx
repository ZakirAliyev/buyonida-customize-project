import {useState} from "react";
import "./index.scss";

function TabMenu({name, props}) {
    const [active, setActive] = useState(0);

    return (
        <section id={"tabMenu"}>
            <section id={"tabMenuName"}>{name}</section>
            <section id="tabMenuWrapper">
                <div className="tabWrapper" style={{
                    gridTemplateColumns: `repeat(${props.length}, 1fr)`
                }}>
                    <div
                        className="slider"
                        style={{
                            transform: `translateX(calc(${active} * 100%))`,
                            width: `calc((100% - 4px) / ${props.length}`
                        }}
                    />

                    {props.map((tab, i) => (
                        <button
                            key={tab}
                            className={`tab ${active === i ? "active" : ""}`}
                            onClick={() => setActive(i)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </section>
        </section>
    );
}

export default TabMenu;
