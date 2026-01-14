import "./index.scss";
import { useState } from "react";

function ToggleSwitcher({ name, defaultValue, onChange }) {
    const [active, setActive] = useState(defaultValue);

    const toggle = () => {
        const newValue = !active;
        setActive(newValue);
        onChange?.(newValue);
    };

    return (
        <section id="toggleSwitcher">
            <span id="toggleSwitcherName">{name}</span>

            <button
                className={`switch ${active ? "active" : ""}`}
                onClick={toggle}
                aria-checked={active}
                role="switch"
            >
                <span className="circle" />
            </button>
        </section>
    );
}

export default ToggleSwitcher;
