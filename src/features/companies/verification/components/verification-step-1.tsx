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
import { Upload, FileText } from "lucide-react";
import { verificationStep1Schema, type VerificationStep1Input } from "../schemas";
import type { VerificationWizardData } from "../types";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface VerificationStep1Props {
    data: VerificationWizardData;
    updateData: (data: Partial<VerificationWizardData>) => void;
    onNext: () => void;
}

export function VerificationStep1({ data, updateData, onNext }: VerificationStep1Props) {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const form = useForm<VerificationStep1Input>({
        resolver: zodResolver(verificationStep1Schema),
        defaultValues: {
            businessRegistrationNumber: data.businessRegistrationNumber,
            taxId: data.taxId || "",
        },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (file.type !== "application/pdf") {
            toast.error("Only PDF files are allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        setFileName(file.name);

        try {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                toast.error("You must be logged in to upload files");
                return;
            }

            // Upload to Supabase Storage
            const filePath = `${data.companyId}/${Date.now()}-${file.name}`;
            const { data: uploadData, error } = await supabase.storage
                .from("company-verification-docs")
                .upload(filePath, file);

            if (error) {
                console.error("Upload error:", error);
                toast.error("Failed to upload document");
                return;
            }

            // Get public URL
            const {
                data: { publicUrl },
            } = supabase.storage
                .from("company-verification-docs")
                .getPublicUrl(filePath);

            updateData({
                registrationDocument: file,
                registrationDocumentUrl: filePath, // Store path, not public URL
            });

            toast.success("Document uploaded successfully");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = (values: VerificationStep1Input) => {
        if (!data.registrationDocumentUrl) {
            toast.error("Please upload your registration document");
            return;
        }

        updateData({
            businessRegistrationNumber: values.businessRegistrationNumber,
            taxId: values.taxId,
        });
        onNext();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="businessRegistrationNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Business Registration Number *</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 202301234567" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your company's official registration number (SSM for Malaysia, EIN for US, etc.)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <FormLabel>Registration Document * (PDF only, max 5MB)</FormLabel>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="registration-document"
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="registration-document"
                            className="cursor-pointer flex flex-col items-center gap-2"
                        >
                            {fileName ? (
                                <>
                                    <FileText className="h-10 w-10 text-primary" />
                                    <p className="text-sm font-medium">{fileName}</p>
                                    <p className="text-xs text-muted-foreground">Click to change</p>
                                </>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm font-medium">
                                        {isUploading ? "Uploading..." : "Click to upload"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Business registration certificate or incorporation documents
                                    </p>
                                </>
                            )}
                        </label>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tax ID / GST Number (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., C1234567890" {...field} />
                            </FormControl>
                            <FormDescription>
                                Your company's tax identification number, if applicable
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isUploading || !data.registrationDocumentUrl}>
                        Continue
                    </Button>
                </div>
            </form>
        </Form>
    );
}
