import { useEffect, useRef, useState } from "react";
import { useUpdateBlockMutation } from "../../../services/apis/pageApi.jsx";
import { useDebounce } from "../../../hooks/useDebounce.js";
import {useEditorLoading} from "../../../context/EditorLoadingContext/index.jsx";

function GroupSettings({ block }) {
    const [updateBlock] = useUpdateBlockMutation();
    const { start, stop } = useEditorLoading();

    const [localSettings, setLocalSettings] = useState(block.settings);
    const debouncedSettings = useDebounce(localSettings, 500);

    const seqRef = useRef(0);
    const startedRef = useRef(false);

    useEffect(() => {
        setLocalSettings(block.settings);
        seqRef.current = 0;
        if (startedRef.current) {
            stop();
            startedRef.current = false;
        }
    }, [block.id]);

    useEffect(() => {
        if (!debouncedSettings) return;

        const sendSeq = seqRef.current;

        updateBlock({ id: block.id, settings: debouncedSettings })
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
            <h4>Group</h4>

            <label>Direction</label>
            <select
                value={localSettings.direction}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, direction: e.target.value });
                }}
            >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
            </select>

            <label>Alignment</label>
            <select
                value={localSettings.alignment}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, alignment: e.target.value });
                }}
            >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>

            <label>Position</label>
            <select
                value={localSettings.position}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, position: e.target.value });
                }}
            >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
            </select>

            <label>Gap</label>
            <input
                type="number"
                value={localSettings.gap}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, gap: Number(e.target.value) });
                }}
            />

            <label>Padding Top</label>
            <input
                type="number"
                value={localSettings.paddingTop}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, paddingTop: Number(e.target.value) });
                }}
            />

            <label>Padding Bottom</label>
            <input
                type="number"
                value={localSettings.paddingBottom}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, paddingBottom: Number(e.target.value) });
                }}
            />

            <label>Padding Left</label>
            <input
                type="number"
                value={localSettings.paddingLeft}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, paddingLeft: Number(e.target.value) });
                }}
            />

            <label>Padding Right</label>
            <input
                type="number"
                value={localSettings.paddingRight}
                onChange={(e) => {
                    bump();
                    setLocalSettings({ ...localSettings, paddingRight: Number(e.target.value) });
                }}
            />
        </div>
    );
}

export default GroupSettings;
