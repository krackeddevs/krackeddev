"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyUpdateSchema, CompanyUpdateInput } from "../schemas";
import { updateCompany } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditCompanyFormProps {
    company: any; // Type this properly later
}

export function EditCompanyForm({ company }: EditCompanyFormProps) {
    const [isPending, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);

    const form = useForm<CompanyUpdateInput>({
        resolver: zodResolver(companyUpdateSchema),
        defaultValues: {
            name: company.name || "",
            description: company.description || "",
            website_url: company.website_url || "",
            linkedin_url: company.linkedin_url || "",
            twitter_url: company.twitter_url || "",
            logo_url: company.logo_url || "",
            industry: company.industry || "",
            location: company.location || "",
        },
    });

    async function onLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${company.id}-${Math.random()}.${fileExt}`;
            const supabase = createClient();

            const { error: uploadError } = await supabase.storage
                .from('company-logos')
                .upload(filePath, file);

            if (uploadError) {
                console.error(uploadError);
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('company-logos')
                .getPublicUrl(filePath);

            form.setValue("logo_url", publicUrl);
            toast.success("Logo uploaded!");
        } catch (error) {
            toast.error("Error uploading logo. Ensure bucket 'company-logos' exists.");
        } finally {
            setUploading(false);
        }
    }

    function onSubmit(data: CompanyUpdateInput) {
        startTransition(async () => {
            try {
                const result = await updateCompany(company.id, data);
                if (result?.error) {
                    toast.error(result.error);
                } else {
                    toast.success("Profile updated successfully!");
                }
            } catch (e) {
                toast.error("An unexpected error occurred");
            }
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Company Profile</CardTitle>
                <CardDescription>Update your company details and public profile.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Logo Upload */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={form.watch("logo_url")} />
                                <AvatarFallback>{company.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <FormLabel htmlFor="logo">Logo</FormLabel>
                                <Input id="logo" type="file" disabled={uploading} onChange={onLogoUpload} accept="image/*" />
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="website_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about your company..." className="min-h-[100px]" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Industry</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Fintech, AI" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Remote, San Francisco" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="linkedin_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>LinkedIn URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://linkedin.com/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="twitter_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Twitter/X URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://x.com/..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
