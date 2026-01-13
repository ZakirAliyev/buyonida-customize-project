import "./index.scss";
import { useEffect, useRef, useState } from "react";
import arrow from "/src/assets/icons/arrow.svg";

function hsvToRgba(h, s, v, a) {
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;

    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
        a: a / 100,
    };
}

function rgbaToHexWithAlpha(r, g, b, a) {
    const toHex = (v) => v.toString(16).padStart(2, "0").toUpperCase();
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    if (a === 1) return hex;
    return hex + toHex(Math.round(a * 255));
}


function hexToRgba(hex) {
    hex = hex.replace("#", "");

    if (hex.length === 6) {
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
            a: 1,
        };
    }

    if (hex.length === 8) {
        return {
            r: parseInt(hex.slice(0, 2), 16),
            g: parseInt(hex.slice(2, 4), 16),
            b: parseInt(hex.slice(4, 6), 16),
            a: parseInt(hex.slice(6, 8), 16) / 255,
        };
    }

    return null;
}

function ColorPicker({ name, onChange }) {
    const [open, setOpen] = useState(false);

    const [hue, setHue] = useState(4);
    const [sv, setSv] = useState({ s: 50, v: 50 });
    const [alpha, setAlpha] = useState(98.9);

    const [hexInput, setHexInput] = useState("#FF0000FF");
    const [alphaInput, setAlphaInput] = useState("100");

    const wrapperRef = useRef(null);
    const svRef = useRef(null);
    const hueRef = useRef(null);
    const alphaRef = useRef(null);

    const rgba = hsvToRgba(hue, sv.s, sv.v, alpha);
    const hexWithAlpha = rgbaToHexWithAlpha(rgba.r, rgba.g, rgba.b, rgba.a);
    const finalColor = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;

    useEffect(() => {
        setHexInput(hexWithAlpha);
        setAlphaInput(String(alpha));
        onChange?.(finalColor);
    }, [hue, sv, alpha]);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    function rgbaToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const d = max - min;

        let h = 0;
        if (d !== 0) {
            if (max === r) h = ((g - b) / d) % 6;
            else if (max === g) h = (b - r) / d + 2;
            else h = (r - g) / d + 4;
        }

        h = Math.round(h * 60);
        if (h < 0) h += 360;

        const s = max === 0 ? 0 : Math.round((d / max) * 100);
        const v = Math.round(max * 100);

        return { h, s, v };
    }

    const handleHexPaste = (e) => {
        e.preventDefault();
        let pasted = e.clipboardData.getData("text").toUpperCase();
        if (pasted.startsWith("#")) {
            pasted = pasted.slice(1);
        }
        pasted = pasted.replace(/[^0-9A-F]/g, "").slice(0, 8);
        setHexInput("#" + pasted);
    };


    const handleSV = (e) => {
        const r = svRef.current.getBoundingClientRect();
        setSv({
            s: Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)),
            v: Math.min(100, Math.max(0, 100 - ((e.clientY - r.top) / r.height) * 100)),
        });
    };

    const handleHue = (e) => {
        const r = hueRef.current.getBoundingClientRect();
        setHue(Math.min(360, Math.max(0, ((e.clientY - r.top) / r.height) * 360)));
    };

    const handleAlpha = (e) => {
        const r = alphaRef.current.getBoundingClientRect();
        setAlpha(Math.min(100, Math.max(0, 100 - ((e.clientY - r.top) / r.height) * 100)));
    };

    const handleHexChange = (e) => {
        let val = e.target.value.toUpperCase().replace(/[^0-9A-F#]/g, "");
        if (!val.startsWith("#")) val = "#" + val;
        val = "#" + val.slice(1).slice(0, 8);

        setHexInput(val);

        const raw = val.slice(1);
        if (raw.length === 6 || raw.length === 8) {
            const parsed = hexToRgba(val);
            if (!parsed) return;

            const { h, s, v } = rgbaToHsv(parsed.r, parsed.g, parsed.b);

            setHue(h);
            setSv({ s, v });
            setAlpha(Math.round(parsed.a * 100));
        }
    };

    const handleHexKeyDown = (e) => {
        if (e.key !== "Enter") return;

        const rgba = hexToRgba(hexInput);
        if (!rgba) return;

        setAlpha(Math.round(rgba.a * 100));
        onChange?.(`rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`);
    };

    return (
        <section id="colorPicker" ref={wrapperRef}>
            <label id="countSliderName">{name}</label>

            <div className="colorInputWrapper" onClick={() => setOpen(!open)}>
                <span className="colorPreview" style={{ backgroundColor: finalColor }} />
                <input value={hexWithAlpha} readOnly />
                <img src={arrow} alt="" />
            </div>

            {open && (
                <div className="pickerPopover">
                    <div className="pickerBody">
                        <div
                            ref={svRef}
                            className="svSquare"
                            style={{ backgroundColor: `hsl(${hue},100%,50%)` }}
                            onMouseDown={(e) => {
                                handleSV(e);
                                window.addEventListener("mousemove", handleSV);
                                window.addEventListener("mouseup", () =>
                                        window.removeEventListener("mousemove", handleSV),
                                    { once: true }
                                );
                            }}
                        >
                            <div className="svCursor" style={{ left: `${sv.s}%`, top: `${100 - sv.v}%` }} />
                        </div>

                        <div
                            ref={hueRef}
                            className="hueSlider"
                            onMouseDown={(e) => {
                                handleHue(e);
                                window.addEventListener("mousemove", handleHue);
                                window.addEventListener("mouseup", () =>
                                        window.removeEventListener("mousemove", handleHue),
                                    { once: true }
                                );
                            }}
                        >
                            <div className="hueCursor" style={{ top: `${(hue / 360) * 100}%` }} />
                        </div>

                        <div
                            ref={alphaRef}
                            className="alphaSlider"
                            style={{
                                background: `linear-gradient(
                                  to bottom,
                                  rgba(${rgba.r},${rgba.g},${rgba.b},1),
                                  rgba(${rgba.r},${rgba.g},${rgba.b},0)
                                )`,
                            }}
                            onMouseDown={(e) => {
                                handleAlpha(e);
                                window.addEventListener("mousemove", handleAlpha);
                                window.addEventListener("mouseup", () =>
                                        window.removeEventListener("mousemove", handleAlpha),
                                    { once: true }
                                );
                            }}
                        >
                            <div className="alphaCursor" style={{ top: `${100 - alpha}%` }} />
                        </div>
                    </div>

                    <div className="inputWrapper">
                        <div className="pickedColorBox" style={{ backgroundColor: finalColor }} />
                        <input
                            className="hexInput"
                            value={hexInput}
                            onChange={handleHexChange}
                            onKeyDown={handleHexKeyDown}
                            onPaste={handleHexPaste}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

export default ColorPicker;
