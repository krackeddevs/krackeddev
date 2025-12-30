"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companyRegistrationSchema, CompanyRegistrationInput } from "../schemas";
import { registerCompany } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
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
} from "@/components/ui/select"
import { useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import { useSupabase } from "@/context/SupabaseContext";

export function CompanyRegistrationForm() {
    const { isAuthenticated, openLoginModal } = useSupabase();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<CompanyRegistrationInput>({
        resolver: zodResolver(companyRegistrationSchema),
        defaultValues: {
            name: "",
            website_url: "",
            size: "",
        },
    });

    if (!isAuthenticated) {
        return (
            <Card className="max-w-md mx-auto w-full">
                <CardHeader>
                    <CardTitle>Register Your Company</CardTitle>
                    <CardDescription>Login to start hiring top talent.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        You need to be logged in to create a company profile.
                    </p>
                    <Button onClick={() => openLoginModal()} className="w-full">
                        Result: Log In / Sign Up
                    </Button>
                </CardContent>
            </Card>
        );
    }

    function onSubmit(data: CompanyRegistrationInput) {
        startTransition(async () => {
            try {
                const result = await registerCompany(data);
                if (result?.error) {
                    toast.error(result.error);
                } else if (result?.success) {
                    toast.success("Company registered successfully!");
                    router.push("/dashboard/company");
                }
            } catch (e) {
                console.error(e);
                toast.error("An unexpected error occurred");
            }
        });
    }

    return (
        <Card className="max-w-md mx-auto w-full">
            <CardHeader>
                <CardTitle>Register Your Company</CardTitle>
                <CardDescription>Start hiring the best talent on KrackedDevs.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acme Corp" {...field} />
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
                                    <FormLabel>Website (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://acme.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="size"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Size</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select size" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1-10">1-10 employees</SelectItem>
                                            <SelectItem value="11-50">11-50 employees</SelectItem>
                                            <SelectItem value="51-200">51-200 employees</SelectItem>
                                            <SelectItem value="201-500">201-500 employees</SelectItem>
                                            <SelectItem value="500+">500+ employees</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Registering..." : "Create Company Profile"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
