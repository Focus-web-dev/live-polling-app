import React, { useEffect, useState, useRef } from "react";

import { formatTime } from "@/utils/formatTime";

import type { BaseTimerProps } from "./types";

const BaseTimer: React.FC<BaseTimerProps> = ({ expiresAt, className }) => {
    const [remaining, setRemaining] = useState(expiresAt - Date.now());
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const tick = () => {
            const ms = expiresAt - Date.now();
            setRemaining(ms);

            if (ms > 0) {
                const delay = 1000 - (Date.now() % 1000);
                timeoutRef.current = setTimeout(tick, delay);
            }
        };

        tick();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [expiresAt]);

    return <span className={className}>{formatTime(remaining)}</span>;
};

export default React.memo(BaseTimer);
