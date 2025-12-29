"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function BrandCTA() {
    const router = useRouter();

    return (
        <div className="w-full bg-black border-y border-green-500/30 relative overflow-hidden py-20 mt-12">
            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-mono tracking-tighter">
                    NEED ELITE <span className="text-green-500 bg-green-500/10 px-2">TALENT?</span>
                </h2>
                <p className="text-gray-400 mb-10 text-lg md:text-xl max-w-2xl mx-auto">
                    Deploy your mission to thousands of verified developers. Pay only for successful merges.
                </p>

                <button
                    onClick={() => router.push("/post-bounty")} // Assuming this route, update if different
                    className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-green-500 hover:bg-green-400 transition-all duration-300 rounded-sm"
                >
                    <span className="mr-2">INITIATE PROTOCOL</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                    {/* Glitch element */}
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </button>
            </div>
        </div>
    );
}
