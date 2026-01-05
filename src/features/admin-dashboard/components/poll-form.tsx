"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Plus, Trash2, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
    FormDescription,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPoll } from "@/features/admin/poll-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const bountyOptionSchema = z.object({
    label: z.string().min(5, "Bounty title must be at least 5 characters"),
    difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]),
    description: z.string().min(20, "Description must be at least 20 characters"),
    requirements: z.array(z.string().min(1)).min(1, "At least 1 requirement needed"),
    estimated_reward: z.number().min(0).optional(),
});

const pollSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 characters"),
    description: z.string().optional(),
    endAt: z.date({
        message: "A deadline is required"
    }),
    options: z.array(bountyOptionSchema).min(2, "At least 2 bounty proposals are required"),
});

type PollFormValues = z.infer<typeof pollSchema>;

const difficultyColors = {
    beginner: "bg-neon-primary/20 text-neon-primary border-neon-primary/50",
    intermediate: "bg-rank-gold/20 text-rank-gold border-rank-gold/50",
    advanced: "bg-rank-bronze/20 text-rank-bronze border-rank-bronze/50",
    expert: "bg-destructive/20 text-destructive border-destructive/50",
};

export function PollForm({ onSuccess }: { onSuccess?: () => void }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedOptions, setExpandedOptions] = useState<number[]>([0]);
    const router = useRouter();

    const form = useForm<PollFormValues>({
        resolver: zodResolver(pollSchema),
        defaultValues: {
            question: "Vote for the next community bounty!",
            description: "",
            options: [
                {
                    label: "",
                    difficulty: "intermediate",
                    description: "",
                    requirements: [""],
                    estimated_reward: undefined,
                },
                {
                    label: "",
                    difficulty: "intermediate",
                    description: "",
                    requirements: [""],
                    estimated_reward: undefined,
                }
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    const toggleOption = (index: number) => {
        setExpandedOptions(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    async function onSubmit(data: PollFormValues) {
        setIsSubmitting(true);
        try {
            const formattedDate = data.endAt.toISOString();

            const result = await createPoll({
                question: data.question,
                description: data.description,
                endAt: formattedDate,
                options: data.options.map(opt => ({
                    label: opt.label,
                    difficulty: opt.difficulty,
                    description: opt.description,
                    requirements: opt.requirements.filter(r => r.trim() !== ""),
                    estimated_reward: opt.estimated_reward,
                })),
            });

            if (result.error) {
                toast.error("Error", {
                    description: result.error,
                });
            } else {
                toast.success("Success", {
                    description: "Community bounty poll created successfully!",
                });
                form.reset();
                onSuccess?.();
                router.refresh();
            }
        } catch (error) {
            toast.error("Error", {
                description: "Failed to create poll",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-neon-primary font-bold uppercase tracking-wider text-xs">Poll Question</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Vote for the next community bounty!"
                                    className="bg-background/80 border-border focus:border-neon-primary"
                                    {...field}
                                />
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
                            <FormLabel className="text-neon-primary font-bold uppercase tracking-wider text-xs">Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Additional context about this poll..."
                                    className="bg-background/80 border-border focus:border-neon-primary resize-none"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="endAt"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel className="text-neon-primary font-bold uppercase tracking-wider text-xs">Poll Deadline</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "pl-3 text-left font-normal bg-background/80 border-border hover:border-neon-primary",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) => date < new Date()}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-neon-primary font-bold uppercase tracking-wider text-xs">
                            Bounty Proposals ({fields.length})
                        </label>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({
                                label: "",
                                difficulty: "intermediate",
                                description: "",
                                requirements: [""],
                                estimated_reward: undefined,
                            })}
                            className="border-neon-primary/50 text-neon-primary hover:bg-neon-primary/10"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Bounty Proposal
                        </Button>
                    </div>

                    {fields.map((field, index) => {
                        const isExpanded = expandedOptions.includes(index);
                        const difficulty = form.watch(`options.${index}.difficulty`);

                        return (
                            <Card key={field.id} className="border-border/50 bg-card/40 backdrop-blur">
                                <CardHeader className="pb-3 cursor-pointer" onClick={() => toggleOption(index)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-base font-mono">
                                                Proposal #{index + 1}
                                            </CardTitle>
                                            {difficulty && (
                                                <Badge className={cn("text-xs uppercase", difficultyColors[difficulty])}>
                                                    {difficulty}
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {fields.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        remove(index);
                                                    }}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {isExpanded ? (
                                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                {isExpanded && (
                                    <CardContent className="space-y-4 pt-0">
                                        <FormField
                                            control={form.control}
                                            name={`options.${index}.label`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase tracking-wider">Bounty Title</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="e.g., Public Service Queue Time Tracker"
                                                            className="bg-background/80 border-border focus:border-neon-primary"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`options.${index}.difficulty`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase tracking-wider">Difficulty</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="bg-background/80 border-border">
                                                                <SelectValue placeholder="Select difficulty" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="beginner">Beginner</SelectItem>
                                                            <SelectItem value="intermediate">Intermediate</SelectItem>
                                                            <SelectItem value="advanced">Advanced</SelectItem>
                                                            <SelectItem value="expert">Expert</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name={`options.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase tracking-wider">Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe what the bounty is about..."
                                                            className="bg-background/80 border-border focus:border-neon-primary resize-none font-mono text-sm"
                                                            rows={4}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        {field.value?.length || 0} characters
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-2">
                                            <FormLabel className="text-xs uppercase tracking-wider">Requirements</FormLabel>
                                            {form.watch(`options.${index}.requirements`)?.map((_, reqIndex) => (
                                                <FormField
                                                    key={reqIndex}
                                                    control={form.control}
                                                    name={`options.${index}.requirements.${reqIndex}`}
                                                    render={({ field }) => (
                                                        <div className="flex gap-2">
                                                            <Input
                                                                placeholder={`Requirement ${reqIndex + 1}`}
                                                                className="bg-background/80 border-border focus:border-neon-primary font-mono text-sm"
                                                                {...field}
                                                            />
                                                            {reqIndex > 0 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        const reqs = form.getValues(`options.${index}.requirements`);
                                                                        form.setValue(
                                                                            `options.${index}.requirements`,
                                                                            reqs.filter((_, i) => i !== reqIndex)
                                                                        );
                                                                    }}
                                                                    className="text-destructive hover:bg-destructive/10"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const reqs = form.getValues(`options.${index}.requirements`) || [];
                                                    form.setValue(`options.${index}.requirements`, [...reqs, ""]);
                                                }}
                                                className="w-full border-dashed border-neon-primary/30 text-neon-primary hover:bg-neon-primary/10"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Requirement
                                            </Button>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name={`options.${index}.estimated_reward`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase tracking-wider">Estimated Reward (RM) - Optional</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input
                                                                type="number"
                                                                placeholder="e.g., 150"
                                                                min="0"
                                                                step="10"
                                                                className="bg-background/80 border-border focus:border-neon-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-auto [&::-webkit-inner-spin-button]:appearance-auto"
                                                                onWheel={(e) => {
                                                                    // Allow scroll to change value when focused
                                                                    const target = e.target as HTMLInputElement;
                                                                    if (document.activeElement === target) {
                                                                        e.preventDefault();
                                                                        const currentValue = Number(target.value) || 0;
                                                                        const delta = e.deltaY > 0 ? -10 : 10;
                                                                        const newValue = Math.max(0, currentValue + delta);
                                                                        field.onChange(newValue || undefined);
                                                                    }
                                                                }}
                                                                {...field}
                                                                value={field.value || ""}
                                                                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription className="text-xs">
                                                        Leave empty if reward is TBD. Use scroll wheel or arrows to adjust.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                )}
                            </Card>
                        );
                    })}
                </div>

                <div className="pt-6 pb-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-neon-primary hover:bg-neon-secondary text-black font-bold uppercase tracking-wider"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Bounty Poll
                    </Button>
                </div>
            </form>
        </Form>
    );
}
