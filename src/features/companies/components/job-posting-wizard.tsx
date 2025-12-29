"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobSchema, CreateJobInput } from "../schemas";
import { createJob, updateJob } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface JobPostingWizardProps {
    initialData?: any;
    isEditing?: boolean;
    jobId?: string;
}

export function JobPostingWizard({ initialData, isEditing = false, jobId }: JobPostingWizardProps = {}) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<CreateJobInput>({
        resolver: zodResolver(createJobSchema),
        defaultValues: initialData || {
            title: "",
            description: "",
            location: "",
            employment_type: "Full-time",
            is_remote: false,
            application_method: "internal",
        },
    });

    const applicationMethod = form.watch("application_method");

    function onSubmit(data: CreateJobInput) {
        startTransition(async () => {
            try {
                const result = isEditing && jobId
                    ? await updateJob(jobId, data)
                    : await createJob(data);

                if (result?.error) {
                    toast.error(result.error);
                } else if (result?.success) {
                    toast.success(isEditing ? "Job updated successfully!" : "Job posted successfully!");
                    router.push("/dashboard/company/jobs");
                }
            } catch (e) {
                console.error(e);
                toast.error("An unexpected error occurred");
            }
        });
    }

    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>Post a New Job</CardTitle>
                <CardDescription>Find your next team member.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Senior Frontend Engineer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the role, responsibilities, and requirements..."
                                            className="min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. London, UK" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="employment_type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employment Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Full-time">Full-time</SelectItem>
                                                <SelectItem value="Part-time">Part-time</SelectItem>
                                                <SelectItem value="Contract">Contract</SelectItem>
                                                <SelectItem value="Internship">Internship</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="salary_min"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Salary (Annual USD)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g. 50000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="salary_max"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Salary (Annual USD)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="e.g. 80000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_remote"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Remote Position</FormLabel>
                                        <FormDescription>
                                            Is this a fully remote role?
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4 rounded-lg border p-4">
                            <FormField
                                control={form.control}
                                name="application_method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application Method</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="internal_form">Internal (On Platform)</SelectItem>
                                                <SelectItem value="url">External Link</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {applicationMethod === "url" && (
                                <FormField
                                    control={form.control}
                                    name="application_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Application URL</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {applicationMethod === "email" && (
                                <FormField
                                    control={form.control}
                                    name="application_url"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contact Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="jobs@company.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {applicationMethod === "internal_form" && (
                                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded border border-green-200">
                                    ✅ Candidates will apply directly on the platform. You'll review applications in the "Applicants" tab.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Posting..." : "Post Job"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
