"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <main className="min-h-screen flex items-center justify-center bg-[--background]">
            <div className="text-center space-y-6 p-8 max-w-md">
                <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-500/10 border border-red-500">
                    <svg
                        className="w-8 h-8 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <div>
                    <p className="text-red-500 text-xl font-bold uppercase tracking-wider">
                        Authentication Failed
                    </p>
                    <p className="text-[--muted-foreground] mt-2">
                        {error || "Something went wrong during authentication. Please try again."}
                    </p>
                </div>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 border border-[--neon-primary] text-[--neon-primary] font-semibold uppercase tracking-wider text-sm hover:bg-[--neon-primary]/10 transition-all"
                >
                    Return Home
                </Link>
            </div>
        </main>
    );
}

export default function AuthCodeError() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorContent />
        </Suspense>
    );
}
