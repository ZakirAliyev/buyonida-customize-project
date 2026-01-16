import { useEffect, useRef, useState } from "react";
import { useUpdateBlockMutation } from "../../../services/apis/pageApi.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import { useEditorLoading } from "../../../context/EditorLoadingContext/index.jsx";

function ButtonSettings({ section }) {
    const [updateBlock] = useUpdateBlockMutation();
    const { start, stop } = useEditorLoading();

    const [localSettings, setLocalSettings] = useState(section.settings);
    const debouncedSettings = useDebounce(localSettings, 500);

    const isDirtyRef = useRef(false);   // 👈 ƏSAS HƏLL
    const startedRef = useRef(false);

    /* ==========================
       BLOCK CHANGE → RESET
    ========================== */
    useEffect(() => {
        setLocalSettings(section.settings);
        isDirtyRef.current = false;     // 👈 seçəndə dirty DEYİL
        if (startedRef.current) {
            stop();
            startedRef.current = false;
        }
    }, [section.id]);

    /* ==========================
       AUTOSAVE (ONLY IF DIRTY)
    ========================== */
    useEffect(() => {
        if (!isDirtyRef.current) return;   // 🔥 PUT BURDA KƏSİLİR

        updateBlock({
            id: section.id,
            settings: debouncedSettings
        }).finally(() => {
            if (startedRef.current) {
                stop();
                startedRef.current = false;
            }
        });
    }, [debouncedSettings]);

    /* ==========================
       USER CHANGE HELPER
    ========================== */
    const markDirty = () => {
        isDirtyRef.current = true;

        if (!startedRef.current) {
            start();
            startedRef.current = true;
        }
    };

    return (
        <div className="settings-panel">
            <h4>Button</h4>

            <label>Label</label>
            <input
                value={localSettings.text || ""}
                onChange={(e) => {
                    markDirty();
                    setLocalSettings({ ...localSettings, text: e.target.value });
                }}
            />

            <label>Link</label>
            <input
                value={localSettings.link || ""}
                onChange={(e) => {
                    markDirty();
                    setLocalSettings({ ...localSettings, link: e.target.value });
                }}
            />

            <div className="toggle-row">
                <input
                    type="checkbox"
                    checked={localSettings.newTab || false}
                    onChange={(e) => {
                        markDirty();
                        setLocalSettings({ ...localSettings, newTab: e.target.checked });
                    }}
                />
                <label>Open in new tab</label>
            </div>

            <label>Style</label>
            <select
                value={localSettings.style || "primary"}
                onChange={(e) => {
                    markDirty();
                    setLocalSettings({ ...localSettings, style: e.target.value });
                }}
            >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
            </select>
        </div>
    );
}

export default ButtonSettings;
