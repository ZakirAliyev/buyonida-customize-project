import { useEffect, useRef, useState } from "react";
import { useUpdateBlockMutation } from "../../../services/apis/pageApi.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import {useEditorLoading} from "../../../context/EditorLoadingContext/index.jsx";

function ButtonSettings({ section }) {
    const [updateBlock] = useUpdateBlockMutation();
    const { start, stop } = useEditorLoading();

    const [localSettings, setLocalSettings] = useState(section.settings);
    const debouncedSettings = useDebounce(localSettings, 500);

    const seqRef = useRef(0);
    const startedRef = useRef(false);

    useEffect(() => {
        setLocalSettings(section.settings);
        seqRef.current = 0;
        if (startedRef.current) {
            stop();
            startedRef.current = false;
        }
    }, [section.id]);

    useEffect(() => {
        if (!debouncedSettings) return;

        const sendSeq = seqRef.current;

        updateBlock({ id: section.id, settings: debouncedSettings })
            .unwrap()
            .finally(() => {
                if (seqRef.current === sendSeq && startedRef.current) {
                    stop();
                    startedRef.current = false;
                }
            });
    }, [debouncedSettings]);

    const bump = () => {
        seqRef.current += 1;
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
                value={localSettings.text}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, text: e.target.value });
                }}
            />

            <label>Link</label>
            <input
                value={localSettings.link || ""}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, link: e.target.value });
                }}
            />

            <div className="toggle-row">
                <input
                    type="checkbox"
                    checked={localSettings.newTab || false}
                    onChange={(e) => {
                        bump();
                        setLocalSettings({ ...localSettings, newTab: e.target.checked });
                    }}
                />
                <label>Open in new tab</label>
            </div>

            <label>Style</label>
            <select
                value={localSettings.style || "primary"}
                onChange={(e) => {
                    bump();
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
