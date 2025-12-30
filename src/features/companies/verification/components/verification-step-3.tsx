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
import { Input } from "@/components/ui/input";
import { verificationStep3Schema, type VerificationStep3Input } from "../schemas";
import type { VerificationWizardData } from "../types";

interface VerificationStep3Props {
    data: VerificationWizardData;
    updateData: (data: Partial<VerificationWizardData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export function VerificationStep3({ data, updateData, onNext, onBack }: VerificationStep3Props) {
    const form = useForm<VerificationStep3Input>({
        resolver: zodResolver(verificationStep3Schema),
        defaultValues: {
            requesterName: data.requesterName,
            requesterTitle: data.requesterTitle,
            requesterPhone: data.requesterPhone,
        },
    });

    const onSubmit = (values: VerificationStep3Input) => {
        updateData(values);
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="requesterName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Full Name *</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormDescription>
                                The name of the person submitting this verification request
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="requesterTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Job Title *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., HR Manager, CTO, CEO" {...field} />
                            </FormControl>
                            <FormDescription>Your role within the company</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="requesterPhone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                                <Input placeholder="+60 12-345 6789" {...field} />
                            </FormControl>
                            <FormDescription>
                                We may contact you if we need to verify information
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
