"use client";

import { useEffect, useRef } from "react";
import { incrementViewCount } from "../actions";

export function ViewTracker({ questionId }: { questionId: string }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            incrementViewCount(questionId);
            hasTracked.current = true;
        }
    }, [questionId]);

    return null;
}
