"use client";

import { useEffect, useRef } from "react";
import { incrementViewCount } from "../actions";

export function ViewTracker({ questionId, slug }: { questionId: string, slug: string }) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (!hasTracked.current) {
            incrementViewCount(questionId, slug);
            hasTracked.current = true;
        }
    }, [questionId, slug]);

    return null;
}
