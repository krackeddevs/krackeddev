import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function RootDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
