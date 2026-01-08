import { createContext, useContext, useMemo, useState } from "react";

const Ctx = createContext(null);

export function EditorLoadingProvider({ children }) {
    const [busyCount, setBusyCount] = useState(0);

    const api = useMemo(() => {
        const start = () => setBusyCount((c) => c + 1);
        const stop = () => setBusyCount((c) => (c > 0 ? c - 1 : 0));
        return { start, stop, isBusy: busyCount > 0 };
    }, [busyCount]);

    return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useEditorLoading() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useEditorLoading must be used inside EditorLoadingProvider");
    return v;
}
