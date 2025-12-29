"use client";

import { AdminLayout } from '@/features/admin-dashboard';
import { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <>
            <AdminLayout>{children}</AdminLayout>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'rgba(17, 24, 39, 0.95)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        color: '#fff',
                        fontFamily: 'monospace',
                    },
                }}
            />
        </>
    );
}
