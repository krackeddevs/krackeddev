"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { verificationStep4Schema, type VerificationStep4Input } from "../schemas";
import type { VerificationWizardData } from "../types";

interface VerificationStep4Props {
    data: VerificationWizardData;
    updateData: (data: Partial<VerificationWizardData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function VerificationStep4({ data, updateData, onNext, onBack }: VerificationStep4Props) {
    const form = useForm<VerificationStep4Input>({
        resolver: zodResolver(verificationStep4Schema),
        defaultValues: {
            reason: data.reason,
            expectedJobCount: data.expectedJobCount,
        },
    });

    const reason = form.watch("reason");
    const charCount = reason?.length || 0;

    const onSubmit = (values: VerificationStep4Input) => {
        updateData(values);
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Why do you want to be verified? *</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us why verification is important for your company..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                <span className={charCount < 50 ? "text-destructive" : ""}>
                                    {charCount} / 1000 characters (minimum 50)
                                </span>
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="expectedJobCount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Expected Number of Job Postings *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select expected job count" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="1-5">1-5 jobs</SelectItem>
                                    <SelectItem value="5-10">5-10 jobs</SelectItem>
                                    <SelectItem value="10+">10+ jobs</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                How many job openings do you plan to post in the next 6 months?
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <Button type="submit">Continue</Button>
                </div>
            </form>
        </Form>
    );
}
