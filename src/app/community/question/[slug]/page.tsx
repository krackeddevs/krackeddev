import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getQuestionBySlug, QuestionDetail } from "@/features/community/actions";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { VotingControl } from "@/features/community/components/voting-control";
import { ViewTracker } from "@/features/community/components/view-tracker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import { AnswerForm } from "@/features/community/components/answer-form";
import { AnswerItem } from "@/features/community/components/questions/answer-item";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const question = await getQuestionBySlug(slug);
    if (!question) return { title: "Question Not Found" };
    return {
        title: `${question.title} - KrackedDevs Community`,
        description: question.body.slice(0, 160),
    };
}

export default async function QuestionDetailPage({ params }: PageProps) {
    const { slug } = await params;

    // Get User for Auth checks
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const question = await getQuestionBySlug(slug);

    if (!question) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-12 relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                <ViewTracker questionId={question.id} slug={question.slug} />

                {/* Main Content */}
                <article className="lg:col-span-9 space-y-8">
                    <div className="p-6 md:p-8 rounded-xl border bg-card/80 backdrop-blur-sm shadow-sm space-y-8">
                        {/* Question Header */}
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                                {question.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-4 border-b">
                                <span>Asked <time dateTime={question.created_at}>{formatDistanceToNow(new Date(question.created_at), { addSuffix: true })}</time></span>
                                <span>Viewed {question.view_count} times</span>
                            </div>
                        </div>

                        {/* Question Body */}
                        <div className="flex gap-6">
                            <div className="hidden sm:block">
                                <VotingControl
                                    upvotes={question.upvotes}
                                    resourceType="question"
                                    resourceId={question.id}
                                // TODO: Fetch initial vote state if possible (requires extra query or field in getQuestionBySlug)
                                // For now optimistic works from 0 state or assumes no vote if new visit
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex sm:hidden mb-4 items-center gap-4 border-b pb-2">
                                    <VotingControl
                                        upvotes={question.upvotes}
                                        resourceType="question"
                                        resourceId={question.id}
                                        orientation="horizontal"
                                    />
                                    <span className="text-xs text-muted-foreground font-mono">
                                        {question.upvotes} votes
                                    </span>
                                </div>

                                <MarkdownViewer content={question.body} className="min-h-[100px]" />

                                <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4 border-t">
                                    <div className="flex flex-wrap gap-2">
                                        {question.tags?.map(tag => (
                                            <Badge key={tag} variant="secondary" className="font-mono">{tag}</Badge>
                                        ))}
                                    </div>
                                    <UserCard user={question.author} date={question.created_at} label="asked" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Answers Section */}
                    {question.answers_count > 0 && (
                        <div className="mt-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">{question.answers_count} Answers</h2>
                            </div>

                            <div className="space-y-8">
                                {question.answers.map((answer) => (
                                    <AnswerItem
                                        key={answer.id}
                                        answer={answer}
                                        questionId={question.id}
                                        questionAuthorId={question.author_id}
                                        currentUserId={user?.id}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </article>

                {/* Answer Form */}
                <div className="lg:col-span-9">
                    <div className="p-6 md:p-8 rounded-xl border bg-card/80 backdrop-blur-sm shadow-sm">
                        <AnswerForm questionId={question.id} />
                    </div>
                </div>

                {/* Right Sidebar */}
                <aside className="lg:col-span-3 space-y-6">
                    {/* Could handle "Related Questions" or "Job Ads" here */}
                    <div className="p-4 border rounded-xl bg-card/80 backdrop-blur-sm shadow-sm">
                        <h3 className="font-bold mb-2">How to answer</h3>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Be specific and kind</li>
                            <li>Provide code snippets</li>
                            <li>Link to resources</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </main>
    );
}

function UserCard({
    user,
    date,
    label,
    align = "right"
}: {
    user: { username: string | null, avatar_url: string | null },
    date: string,
    label: string,
    align?: "left" | "right"
}) {
    const isLeft = align === "left";

    return (
        <div className={`flex items-center gap-3 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
            <div className={`flex flex-col ${isLeft ? "items-start" : "items-end"} text-xs`}>
                <span className="text-muted-foreground">{label} <span className="text-foreground/80">{formatDistanceToNow(new Date(date), { addSuffix: true })}</span></span>
                <Link href={`/profile/${user.username}`} className="font-semibold text-primary hover:underline">
                    {user.username || "Anonymous"}
                </Link>
            </div>
            <Avatar className="h-10 w-10 border border-border/50 shadow-sm">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="bg-primary/5 text-primary">{user.username?.[0] || "?"}</AvatarFallback>
            </Avatar>
        </div>
    );
}
