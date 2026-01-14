import "./index.scss";
import { useEffect, useRef, useState } from "react";
import arrow from "/src/assets/icons/arrow.svg";
import confirm from "/src/assets/icons/confirm.svg";

const SCHEMES = [
    { id: 1, name: "Scheme 1", bg: "#1f1f1f", text: "#ffffff" },
    { id: 2, name: "Scheme 2", bg: "#ffffff", text: "#1f1f1f" },
    { id: 3, name: "Scheme 3", bg: "#eef1e8", text: "#1f1f1f" },
    { id: 4, name: "Scheme 4", bg: "#e9eef3", text: "#1f1f1f" },
];

function SchemeInput({name, value = 1, onChange }) {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const activeScheme =
        SCHEMES.find((s) => s.id === value) || SCHEMES[0];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <section id="schemeInput" ref={wrapperRef}>
            <section id={"schemeInputName"}>{name}</section>
            <div
                className={`schemeInputBox ${open ? "open" : ""}`}
                onClick={() => setOpen((p) => !p)}
            >
                <div
                    className="schemeIcon"
                    style={{
                        background: activeScheme.bg,
                        color: activeScheme.text,
                    }}
                >
                    <span className="aa">Aa</span>
                    <div className="bars">
                        <span />
                        <span />
                    </div>
                </div>

                <span className="schemeName">{activeScheme.name}</span>

                <img src={arrow} className="arrow" alt="" />
            </div>

            {open && (
                <div className="schemeDropdown">
                    <div className="schemeDropdownWrapper">
                        {SCHEMES.map((scheme) => {
                            const isActive = scheme.id === value;

                            return (
                                <div
                                    key={scheme.id}
                                    className={`schemeItem ${isActive ? "active" : ""}`}
                                    onClick={() => {
                                        onChange?.(scheme.id);
                                        setOpen(false);
                                    }}
                                >
                                    <div
                                        className="schemeIcon"
                                        style={{
                                            background: scheme.bg,
                                            color: scheme.text,
                                        }}
                                    >
                                        <span className="aa">Aa</span>
                                        <div className="bars">
                                            <span />
                                            <span />
                                        </div>
                                    </div>

                                    <span className="schemeName">{scheme.name}</span>

                                    {/* ✅ SADECE SEÇİLƏNDƏ GÖRÜNSÜN */}
                                    {isActive && (
                                        <img
                                            src={confirm}
                                            className="confirm"
                                            alt="Selected"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="schemeFooter">
                        To edit all your theme's colors,<br />
                        go to your <p>color theme settings</p>.
                    </div>
                </div>
            )}
        </section>
    );
}

export default SchemeInput;
