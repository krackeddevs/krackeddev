import { AskQuestionForm } from "@/features/community/components/ask-question-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CommunitySubNav } from "@/features/community/components/shared/community-sub-nav";

export const metadata = {
    title: "Ask a Question | Community",
    description: "Ask a technical question to the KrackedDevs community.",
};

export default async function AskQuestionPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?next=/community/ask");
    }

    return (
        <main className="min-h-screen pt-24 pb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <CommunitySubNav />

                <div className="mt-8">
                    <AskQuestionForm />
                </div>
            </div>
        </main>
    );
}
