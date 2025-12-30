import { MyApplicationsList } from "@/features/jobs/components/my-applications-list";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ApplicationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Applications</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Track the status of your job applications.
                </p>
            </div>

            <MyApplicationsList />
        </div>
    );
}
