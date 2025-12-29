"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { FileText, Mail, User, Phone, Briefcase, MessageSquare } from "lucide-react";
import { verificationStep5Schema, type VerificationStep5Input } from "../schemas";
import type { VerificationWizardData } from "../types";

interface VerificationStep5Props {
    data: VerificationWizardData;
    updateData: (data: Partial<VerificationWizardData>) => void;
    onBack: () => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export function VerificationStep5({
    data,
    updateData,
    onBack,
    onSubmit,
    isSubmitting,
}: VerificationStep5Props) {
    const form = useForm<VerificationStep5Input>({
        resolver: zodResolver(verificationStep5Schema),
        defaultValues: {
            confirmAccuracy: data.confirmAccuracy,
        },
    });

    const handleSubmit = (values: VerificationStep5Input) => {
        updateData(values);
        onSubmit();
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="font-semibold">Review Your Information</h3>
                <p className="text-sm text-muted-foreground">
                    Please review all information before submitting. You can go back to make changes if
                    needed.
                </p>
            </div>

            <div className="space-y-4">
                <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Business Documents
                    </h4>
                    <div className="pl-6 space-y-1 text-sm">
                        <p>
                            <span className="text-muted-foreground">Registration Number:</span>{" "}
                            {data.businessRegistrationNumber}
                        </p>
                        {data.taxId && (
                            <p>
                                <span className="text-muted-foreground">Tax ID:</span> {data.taxId}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            ✓ Registration document uploaded
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Verification
                    </h4>
                    <div className="pl-6 space-y-1 text-sm">
                        <p>{data.verificationEmail}</p>
                        <p className="text-xs text-green-600 dark:text-green-400">✓ Verified</p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Contact Details
                    </h4>
                    <div className="pl-6 space-y-1 text-sm">
                        <p>
                            <span className="text-muted-foreground">Name:</span> {data.requesterName}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Title:</span> {data.requesterTitle}
                        </p>
                        <p>
                            <span className="text-muted-foreground">Phone:</span> {data.requesterPhone}
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Additional Context
                    </h4>
                    <div className="pl-6 space-y-1 text-sm">
                        <p className="text-muted-foreground">Reason for verification:</p>
                        <p className="whitespace-pre-wrap">{data.reason}</p>
                        <p className="text-muted-foreground mt-2">
                            Expected job postings: {data.expectedJobCount}
                        </p>
                    </div>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="confirmAccuracy"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        I confirm that all information provided is accurate and complete *
                                    </FormLabel>
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
                            Back
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Verification Request"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
