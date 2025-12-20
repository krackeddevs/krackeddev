"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
import { developerRoles, techStacks } from "@/features/onboarding/schema";
import { updateProfile, type ProfileData } from "../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Extended schema to include Bio, Username, Full Name and Social Links
const editProfileSchema = z.object({
    fullName: z.string().max(100, "Name too long").optional().or(z.literal("")),
    username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
    developerRole: z.string().min(1, "Please select a role"),
    stack: z.array(z.string()).min(1, "Please select at least one technology"),
    location: z.string().min(2, "Please enter your location").optional().or(z.literal("")),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional().or(z.literal("")),
    xUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    linkedinUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

interface EditProfileFormProps {
    initialData: ProfileData;
    onCancel?: () => void;
}

export function EditProfileForm({ initialData, onCancel }: EditProfileFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<EditProfileFormValues>({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            fullName: initialData.full_name || "",
            username: initialData.username || "",
            developerRole: initialData.developer_role || "",
            stack: initialData.stack || [],
            location: initialData.location || "",
            bio: initialData.bio || "",
            xUrl: initialData.x_url || "",
            linkedinUrl: initialData.linkedin_url || "",
            websiteUrl: initialData.website_url || "",
        },
    });

    async function onSubmit(data: EditProfileFormValues) {
        setIsLoading(true);
        try {
            const result = await updateProfile({
                id: initialData.id,
                role: data.developerRole,
                stack: data.stack,
                location: data.location || null,
                bio: data.bio || null,
                username: data.username || null,
                full_name: data.fullName || null,
                x_url: data.xUrl || null,
                linkedin_url: data.linkedinUrl || null,
                website_url: data.websiteUrl || null,
            });

            if (result.error) {
                toast.error("Error", {
                    description: result.error,
                });
            } else {
                toast.success("Success", {
                    description: "Profile updated successfully.",
                });
                router.refresh();
                if (onCancel) onCancel();
            }
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto p-6 bg-card/50 border border-border rounded-lg shadow-lg backdrop-blur-sm">

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-primary to-neon-secondary bg-clip-text text-transparent">
                        Edit Profile
                    </h2>
                    <p className="text-muted-foreground">
                        Update your developer persona and stats.
                    </p>
                </div>

                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Display Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. John Doe" {...field} className="bg-background/50" />
                                </FormControl>
                                <FormDescription>
                                    Your real name (optional).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Codename</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. CyberPunk_2077" {...field} className="bg-background/50" />
                                </FormControl>
                                <FormDescription>
                                    Your display name in the directory.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Attributes: Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Neo Tokyo, Digital Void" {...field} className="bg-background/50" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="developerRole"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-background/50">
                                            <SelectValue placeholder="Select your class" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {developerRoles.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stack"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tech Arsenal (Select Multiple)</FormLabel>
                                <FormControl>
                                    <ToggleGroup
                                        type="multiple"
                                        variant="outline"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="flex flex-wrap justify-start gap-2"
                                    >
                                        {techStacks.map((tech) => (
                                            <ToggleGroupItem
                                                key={tech}
                                                value={tech}
                                                aria-label={`Toggle ${tech}`}
                                                className="border-primary/20 data-[state=on]:bg-neon-primary/20 data-[state=on]:text-neon-primary hover:bg-neon-primary/10 hover:text-neon-primary transition-all duration-300"
                                            >
                                                {tech}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Lore (Bio)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us your backstory..."
                                        className="resize-none bg-background/50 min-h-[100px]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Brief description displayed on your profile card.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Social Links Section */}
                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Social Links</h3>

                        <FormField
                            control={form.control}
                            name="xUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>X (Twitter)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://x.com/username" {...field} className="bg-background/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LinkedIn</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/username" {...field} className="bg-background/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="websiteUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website / Portfolio</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://yoursite.com" {...field} className="bg-background/50" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="w-full text-white border-white/20 hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full bg-neon-primary hover:bg-neon-secondary text-black font-bold transition-all duration-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
