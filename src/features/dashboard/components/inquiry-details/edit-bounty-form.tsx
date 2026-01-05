"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateBounty, UpdateBountyPayload } from "@/features/dashboard/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BountyInquiry, Bounty } from "@/types/database";

interface EditBountyFormProps {
    inquiry: BountyInquiry;
    activeBounty?: Bounty | null; // If published
    isReadOnly?: boolean;
}

export function EditBountyForm({ inquiry, activeBounty, isReadOnly = false }: EditBountyFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Initial State: Prefer Active Bounty data if available (it allows editing), otherwise Inquiry data
    const [formData, setFormData] = useState<UpdateBountyPayload>({
        title: activeBounty?.title || inquiry.title || "",
        description: activeBounty?.description || inquiry.description || "",
        deadline: activeBounty?.deadline || inquiry.deadline || "",
        reward_amount: activeBounty?.reward_amount || Number(inquiry.estimated_budget) || 0,
        difficulty: activeBounty?.difficulty || inquiry.difficulty || "intermediate",
        difficulty: activeBounty?.difficulty || inquiry.difficulty || "intermediate",
        skills: activeBounty?.skills?.map(String) || inquiry.skills?.map(String) || [],
        repository_url: activeBounty?.repository_url || inquiry.repository_url || "",
        requirements: activeBounty?.requirements || inquiry.requirements || [],
        long_description: activeBounty?.long_description || inquiry.long_description || "",
    });

    const [skillsInput, setSkillsInput] = useState(formData.skills.join(", "));

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSkillsInput(e.target.value);
        setFormData(prev => ({
            ...prev,
            skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeBounty) {
            toast.error("You can only edit published bounties.");
            return;
        }

        setIsLoading(true);
        try {
            const result = await updateBounty(activeBounty.id, formData);
            if (result.success) {
                toast.success("Bounty updated successfully");
            } else {
                toast.error(result.error || "Failed to update");
            }
        } catch (error) {
            console.error(error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const canEdit = !!activeBounty && !isReadOnly;

    // If not published, we still want to SHOW the details (read-only) so admins can review.
    // canEdit controls accessibility.


    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {!activeBounty && (
                <div className="p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-md text-yellow-500 font-mono text-sm mb-6">
                    This inquiry has not been published as a bounty yet. Details are read-only until published.
                </div>
            )}
            <div className="space-y-2">
                <Label>Title</Label>
                <Input
                    disabled={!canEdit}
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="font-mono"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Budget (RM)</Label>
                    <Input
                        disabled={!canEdit}
                        type="number"
                        value={formData.reward_amount}
                        onChange={e => setFormData({ ...formData, reward_amount: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select
                        disabled={!canEdit}
                        value={formData.difficulty}
                        onValueChange={val => setFormData({ ...formData, difficulty: val })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                    disabled={!canEdit}
                    type="date" // Simple date input for now
                    value={formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : ""}
                    onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Skills (Comma separated)</Label>
                <Input
                    disabled={!canEdit}
                    value={skillsInput}
                    onChange={handleSkillsChange}
                    placeholder="React, TypeScript, Node.js"
                />
            </div>

            <div className="space-y-2">
                <Label>Repository URL</Label>
                <Input
                    disabled={!canEdit}
                    value={formData.repository_url || ""}
                    onChange={e => setFormData({ ...formData, repository_url: e.target.value })}
                    placeholder="https://github.com/..."
                />
            </div>

            <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea
                    disabled={!canEdit}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="font-mono text-sm"
                />
            </div>

            <div className="space-y-2">
                <Label>Detailed Guide (Long Description)</Label>
                <Textarea
                    disabled={!canEdit}
                    value={formData.long_description || ""}
                    onChange={e => setFormData({ ...formData, long_description: e.target.value })}
                    rows={8}
                    className="font-mono text-sm"
                    placeholder="Provide full details, setup instructions, etc."
                />
            </div>

            <div className="space-y-2">
                <Label>Requirements (One per line)</Label>
                <Textarea
                    disabled={!canEdit}
                    value={formData.requirements?.join('\n') || ""}
                    onChange={e => setFormData({
                        ...formData,
                        requirements: e.target.value.split('\n')
                    })}
                    rows={6}
                    className="font-mono text-sm"
                    placeholder="- Requirement 1&#10;- Requirement 2"
                />
            </div>

            {canEdit && (
                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isLoading} className="bg-neon-primary text-black hover:bg-neon-primary/90">
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Changes
                    </Button>
                </div>
            )}
        </form>
    );
}
