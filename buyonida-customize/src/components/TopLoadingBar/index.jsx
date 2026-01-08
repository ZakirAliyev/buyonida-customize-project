import { useEffect, useRef, useState } from "react";
import "./index.scss";

function TopLoadingBar({ loading }) {
    const [active, setActive] = useState(false);
    const [progress, setProgress] = useState(0);

    const intervalRef = useRef(null);
    const doneTimeoutRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (doneTimeoutRef.current) clearTimeout(doneTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (doneTimeoutRef.current) clearTimeout(doneTimeoutRef.current);

        if (loading) {
            setActive(true);
            setProgress((p) => (p < 12 ? 12 : p));

            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                setProgress((p) => {
                    if (p >= 92) return 92;
                    const inc = p < 60 ? 6 + Math.random() * 10 : 1 + Math.random() * 4;
                    const next = p + inc;
                    return next > 92 ? 92 : next;
                });
            }, 160);

            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (active) setProgress(100);

        doneTimeoutRef.current = setTimeout(() => {
            setActive(false);
            setProgress(0);
        }, 280);
    }, [loading]);

    return (
        <div className={`top-loading-bar ${active ? "active" : ""}`}>
            <div className="track" />
            <div className="bar" style={{ width: `${progress}%` }} />
        </div>
    );
}

export default TopLoadingBar;
