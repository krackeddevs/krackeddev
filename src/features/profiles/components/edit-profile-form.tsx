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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 max-w-3xl mx-auto p-8 sm:p-12 bg-card/60 border border-[var(--neon-cyan)]/20 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.1)] backdrop-blur-xl relative overflow-hidden group/form selection:bg-[var(--neon-cyan)]/30">
                {/* HUD Elements */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--neon-cyan)]" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--neon-cyan)]" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--neon-cyan)]" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--neon-cyan)]" />
                <div className="absolute inset-0 bg-scanline pointer-events-none opacity-[0.03]" />

                <div className="space-y-2 border-b border-[var(--neon-cyan)]/10 pb-6 relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-[var(--neon-cyan)] animate-pulse" />
                        <span className="text-[10px] font-mono text-[var(--neon-cyan)] tracking-[0.5em] uppercase font-black">Configuration_Console</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black font-mono tracking-tighter text-foreground uppercase italic leading-none">
                        Identity <span className="text-transparent" style={{ WebkitTextStroke: '1px currentColor' }}>Calibration</span>
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest opacity-60">
                        Adjusting neural parameters and sectors...
                    </p>
                    <div className="absolute top-0 right-0 text-[10px] font-mono text-[var(--neon-cyan)] opacity-20 hidden sm:block">
                        SEC_LEV: 0xROOT
                    </div>
                </div>

                <div className="grid gap-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none">01_Display_Name</span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="UNIDENTIFIED_OPERATIVE"
                                            {...field}
                                            className="bg-black/40 border-[var(--neon-cyan)]/20 rounded-none font-mono text-sm focus:border-[var(--neon-cyan)] focus:ring-1 focus:ring-[var(--neon-cyan)]/20 transition-all placeholder:opacity-20 uppercase"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-mono uppercase text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none">02_Owner_Handle</span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="NETRUNNER_X"
                                            {...field}
                                            className="bg-black/40 border-[var(--neon-cyan)]/20 rounded-none font-mono text-sm focus:border-[var(--neon-cyan)] focus:ring-1 focus:ring-[var(--neon-cyan)]/20 transition-all placeholder:opacity-20"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-mono uppercase text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none">03_Sector_Lat</span>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder="NEO_KUALA_LUMPUR"
                                            {...field}
                                            className="bg-black/40 border-[var(--neon-cyan)]/20 rounded-none font-mono text-sm focus:border-[var(--neon-cyan)] focus:ring-1 focus:ring-[var(--neon-cyan)]/20 transition-all placeholder:opacity-20 uppercase"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[10px] font-mono uppercase text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="developerRole"
                            render={({ field }) => (
                                <FormItem className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none">04_Specialization_Class</span>
                                    </div>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-card/40 border-[var(--neon-cyan)]/20 rounded-none font-mono text-sm focus:border-[var(--neon-cyan)] transition-all uppercase italic font-bold">
                                                <SelectValue placeholder="CHOOSE_CLASS" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-card border-[var(--neon-cyan)]/20 rounded-none font-mono">
                                            {developerRoles.map((role) => (
                                                <SelectItem key={role.value} value={role.value} className="focus:bg-[var(--neon-cyan)] focus:text-primary-foreground uppercase">
                                                    {role.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-[10px] font-mono uppercase text-red-500" />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="stack"
                        render={({ field }) => (
                            <FormItem className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none shrink-0">05_Tech_Arsenal</span>
                                    <div className="h-px w-full bg-[var(--neon-cyan)]/10" />
                                </div>
                                <FormControl>
                                    <ToggleGroup
                                        type="multiple"
                                        variant="outline"
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        className="flex flex-wrap justify-start gap-3"
                                    >
                                        {techStacks.map((tech) => (
                                            <ToggleGroupItem
                                                key={tech}
                                                value={tech}
                                                aria-label={`Toggle ${tech}`}
                                                className="border-[var(--neon-cyan)]/20 rounded-none font-mono text-[10px] uppercase tracking-widest data-[state=on]:bg-[var(--neon-cyan)] data-[state=on]:text-primary-foreground hover:border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10 hover:text-[var(--neon-cyan)] transition-all px-4 py-2"
                                            >
                                                {tech}
                                            </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </FormControl>
                                <FormMessage className="text-[10px] font-mono uppercase text-red-500" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest leading-none">06_Identity_Lore</span>
                                </div>
                                <FormControl>
                                    <Textarea
                                        placeholder="DECRYPTING_LORE..."
                                        className="resize-none bg-black/40 border-[var(--neon-cyan)]/20 rounded-none font-mono text-sm min-h-[120px] focus:border-[var(--neon-cyan)] italic focus:ring-1 focus:ring-[var(--neon-cyan)]/20"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="text-[10px] font-mono uppercase text-red-500" />
                            </FormItem>
                        )}
                    />

                    {/* Social Uplink Section */}
                    <div className="space-y-10 pt-10 border-t border-[var(--neon-cyan)]/10">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-[var(--neon-purple)] uppercase tracking-[0.4em] font-black shrink-0">External_Uplinks</span>
                            <div className="h-[1px] w-full bg-[var(--neon-purple)]/20" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <FormField
                                control={form.control}
                                name="xUrl"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-60">X_Signal_ID</div>
                                        <FormControl>
                                            <Input
                                                placeholder="https://x.com/..."
                                                {...field}
                                                className="bg-black/20 border-[var(--neon-purple)]/20 rounded-none font-mono text-[11px] focus:border-[var(--neon-purple)]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[9px] font-mono text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="linkedinUrl"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-60">Link_Access</div>
                                        <FormControl>
                                            <Input
                                                placeholder="https://linkedin.com/..."
                                                {...field}
                                                className="bg-black/20 border-[var(--neon-purple)]/20 rounded-none font-mono text-[11px] focus:border-[var(--neon-purple)]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[9px] font-mono text-red-500" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="websiteUrl"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest opacity-60">Net_Node</div>
                                        <FormControl>
                                            <Input
                                                placeholder="https://..."
                                                {...field}
                                                className="bg-black/20 border-[var(--neon-purple)]/20 rounded-none font-mono text-[11px] focus:border-[var(--neon-purple)]"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[9px] font-mono text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-[var(--neon-cyan)]/10">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="w-full sm:w-[200px] border-border/20 hover:border-white hover:bg-white/5 text-muted-foreground hover:text-white font-mono text-xs uppercase tracking-[0.2em] rounded-none py-6"
                        >
                            Abort_Sequence
                        </Button>
                    )}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        variant="cyberpunk"
                        className="flex-1 bg-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/80 text-primary-foreground font-mono font-black uppercase tracking-[0.3em] rounded-none py-6 shadow-[0_0_30px_rgba(var(--neon-cyan-rgb),0.2)] hover:shadow-[0_0_40px_rgba(var(--neon-cyan-rgb),0.4)] transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                                <span>Calibrating...</span>
                            </div>
                        ) : (
                            "Execute_Calibration"
                        )}
                    </Button>
                </div>

                <style jsx global>{`
                    .bg-scanline {
                        background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.1) 50%, transparent);
                        background-size: 100% 4px;
                        animation: scan 10s linear infinite;
                    }
                    @keyframes scan {
                        from { transform: translateY(-100%); }
                        to { transform: translateY(100%); }
                    }
                `}</style>
            </form>
        </Form >
    );
}
