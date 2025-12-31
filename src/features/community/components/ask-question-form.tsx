"use client";

import { useActionState, useState } from "react";
import { createQuestion } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "./markdown-editor";
import { TagInput } from "./tag-input";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function AskQuestionForm() {
    const [state, action, isPending] = useActionState(createQuestion, null);

    // Controlled inputs for custom components
    const [body, setBody] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    return (
        <Card className="w-full max-w-4xl mx-auto border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
                <CardTitle className="text-3xl font-bold">Ask a Question</CardTitle>
                <CardDescription>
                    Get help from the community. Be specific and include code snippets.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <form action={action} className="space-y-8">
                    {state?.error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="e.g. How do I center a div using CSS Grid?"
                            required
                            minLength={15}
                            maxLength={150}
                        />
                        <p className="text-xs text-muted-foreground">
                            Be specific and imagine you're asking a question to another person.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label>Body</Label>
                        <MarkdownEditor
                            value={body}
                            onChange={setBody}
                            placeholder="Describe your problem in detail..."
                            minHeight="min-h-[300px]"
                        />
                        <input type="hidden" name="body" value={body} />
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <TagInput
                            value={tags}
                            onChange={setTags}
                            placeholder="Add up to 5 tags..."
                        />
                        <input type="hidden" name="tags" value={tags.join(",")} />
                        <p className="text-xs text-muted-foreground">
                            Add up to 5 tags to describe what your question is about.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending || !body || tags.length === 0}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post Question
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
