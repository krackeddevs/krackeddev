"use client";

import Image, { ImageProps } from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ThemeAwareImage({ className, ...props }: ImageProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <Image className={className} {...props} />;

    return (
        <Image
            className={cn(
                className,
                theme === "blackwhite" && "grayscale contrast-125"
            )}
            {...props}
        />
    );
}
