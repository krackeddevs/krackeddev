"use client";

import { useState } from "react";
import { ManifestoModal } from "@/components/ManifestoModal";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleClose = () => {
        setIsOpen(false);
        // Go back to previous page or home
        router.back();
    };

    return (
        <ManifestoModal isOpen={isOpen} onClose={handleClose} />
    );
}
