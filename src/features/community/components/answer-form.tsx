"use client";

import { useActionState, useState } from "react";
import { createAnswer } from "../actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "./markdown-editor";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnswerFormProps {
    questionId: string;
}

export function AnswerForm({ questionId }: AnswerFormProps) {
    const [state, action, isPending] = useActionState(createAnswer, null);
    const [body, setBody] = useState("");

    // Clear form on success
    if (state?.success && body) {
        setBody("");
    }

    return (
        <Card className="mt-8 border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
                <CardTitle className="text-xl font-bold">Your Answer</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <form action={action} className="space-y-6">
                    <input type="hidden" name="question_id" value={questionId} />

                    {state?.error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <MarkdownEditor
                            value={body}
                            onChange={(newValue) => {
                                console.log('=== Form onChange Called ===');
                                console.log('New value:', newValue);
                                console.log('New value length:', newValue.length);
                                setBody(newValue);
                                console.log('setBody called');
                                console.log('===========================');
                            }}
                            placeholder="Write your answer here..."
                            minHeight="min-h-[200px]"
                        />
                        <input type="hidden" name="body" value={body} />
                    </div>

                    <div className="flex justify-start">
                        <Button
                            type="submit"
                            disabled={isPending || !body}
                            onClick={() => {
                                console.log('=== Submit Button Clicked ===');
                                console.log('Body length:', body.length);
                                console.log('Body content:', body);
                                console.log('isPending:', isPending);
                                console.log('Button disabled:', isPending || !body);
                                console.log('===========================');
                            }}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post Answer
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
