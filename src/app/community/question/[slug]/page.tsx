import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getQuestionBySlug, QuestionDetail } from "@/features/community/actions";
import { MarkdownViewer } from "@/components/markdown-viewer";
import { VotingControl } from "@/features/community/components/voting-control";
import { ViewTracker } from "@/features/community/components/view-tracker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import { CheckCircle2 } from "lucide-react";

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
    const question = await getQuestionBySlug(slug);

    if (!question) {
        notFound();
    }

    return (
        <main className="min-h-screen pt-24 pb-12 relative overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50 pointer-events-none" />

            <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
                <ViewTracker questionId={question.id} />

                {/* Main Content */}
                <article className="lg:col-span-9 space-y-8">
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
                            <VotingControl upvotes={question.upvotes} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <MarkdownViewer content={question.body} className="min-h-[100px]" />

                            <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4 border-t">
                                <div className="flex gap-2">
                                    {question.tags?.map(tag => (
                                        <Badge key={tag} variant="secondary" className="font-mono">{tag}</Badge>
                                    ))}
                                </div>
                                <UserCard user={question.author} date={question.created_at} label="asked" />
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
                                    <div key={answer.id} className="relative flex gap-6 p-6 rounded-lg border bg-card/50">
                                        {answer.is_accepted && (
                                            <div className="absolute top-0 right-0 p-2 text-green-500" title="Accepted Answer">
                                                <CheckCircle2 className="h-6 w-6" />
                                            </div>
                                        )}

                                        <div className="hidden sm:block">
                                            <VotingControl upvotes={answer.upvotes} />
                                        </div>

                                        <div className="flex-1 min-w-0 space-y-4">
                                            <MarkdownViewer content={answer.body} />

                                            <div className="flex justify-end pt-4 mt-4 border-t border-border/50">
                                                <UserCard user={answer.author} date={answer.created_at} label="answered" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </article>

                {/* Right Sidebar */}
                <aside className="lg:col-span-3 space-y-6">
                    {/* Could handle "Related Questions" or "Job Ads" here */}
                    <div className="p-4 border rounded-lg bg-muted/20">
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

function UserCard({ user, date, label }: { user: { username: string | null, avatar_url: string | null }, date: string, label: string }) {
    return (
        <div className="flex items-center gap-2 p-2 rounded bg-muted/30 min-w-[150px]">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback>{user.username?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-xs">
                <span className="text-muted-foreground">{label} {formatDistanceToNow(new Date(date), { addSuffix: true })}</span>
                <span className="font-semibold text-foreground">{user.username || "Anonymous"}</span>
            </div>
        </div>
    );
}
