"use client";

import { useState } from "react";
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
import { Mail, Check, Loader2 } from "lucide-react";
import {
    verificationStep2EmailSchema,
    verificationStep2CodeSchema,
    type VerificationStep2EmailInput,
    type VerificationStep2CodeInput,
} from "../schemas";
import type { VerificationWizardData } from "../types";
import { sendVerificationCode, verifyEmailCode } from "../actions";
import { toast } from "sonner";

interface VerificationStep2Props {
    data: VerificationWizardData;
    updateData: (data: Partial<VerificationWizardData>) => void;
    onNext: () => void;
    onBack: () => void;
    companyId: string;
}

export function VerificationStep2({
    data,
    updateData,
    onNext,
    onBack,
    companyId,
}: VerificationStep2Props) {
    const [codeSent, setCodeSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const emailForm = useForm<VerificationStep2EmailInput>({
        resolver: zodResolver(verificationStep2EmailSchema),
        defaultValues: {
            verificationEmail: data.verificationEmail,
        },
    });

    const codeForm = useForm<VerificationStep2CodeInput>({
        resolver: zodResolver(verificationStep2CodeSchema),
        defaultValues: {
            verificationCode: "",
        },
    });

    const handleSendCode = async (values: VerificationStep2EmailInput) => {
        setIsSending(true);

        try {
            const result = await sendVerificationCode(values.verificationEmail, companyId);

            if (result.success) {
                toast.success(result.message);
                // DEV MODE: Show code in toast
                if (result.code) {
                    toast.info(`DEV MODE - Your code: ${result.code}`, { duration: 10000 });
                }
                setCodeSent(true);
                updateData({ verificationEmail: values.verificationEmail });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to send verification code");
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyCode = async (values: VerificationStep2CodeInput) => {
        setIsVerifying(true);

        try {
            const result = await verifyEmailCode(
                data.verificationEmail,
                values.verificationCode,
                companyId
            );

            if (result.success && result.verified) {
                toast.success("Email verified successfully!");
                updateData({ emailVerified: true });
                onNext();
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to verify code");
        } finally {
            setIsVerifying(false);
        }
    };

    if (data.emailVerified) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                        <p className="font-medium text-green-900 dark:text-green-100">Email Verified</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{data.verificationEmail}</p>
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <Button onClick={onNext}>Continue</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!codeSent ? (
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(handleSendCode)} className="space-y-6">
                        <FormField
                            control={emailForm.control}
                            name="verificationEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Email Address *</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="yourname@company.com"
                                                className="pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Must match your company domain. Personal emails (Gmail, Yahoo, etc.) are not
                                        allowed.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={onBack}>
                                Back
                            </Button>
                            <Button type="submit" disabled={isSending}>
                                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Verification Code
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <Form {...codeForm}>
                    <form onSubmit={codeForm.handleSubmit(handleVerifyCode)} className="space-y-6">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                We've sent a 6-digit verification code to{" "}
                                <span className="font-medium">{data.verificationEmail}</span>
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                The code will expire in 15 minutes.
                            </p>
                        </div>

                        <FormField
                            control={codeForm.control}
                            name="verificationCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="000000"
                                            maxLength={6}
                                            className="text-center text-2xl tracking-widest"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCodeSent(false)}
                            >
                                Change Email
                            </Button>
                            <Button type="submit" disabled={isVerifying}>
                                {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify Code
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
