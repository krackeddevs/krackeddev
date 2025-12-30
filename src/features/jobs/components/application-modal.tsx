"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { submitApplication } from "../actions";
import { Loader2, Upload } from "lucide-react";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
    companyName: string;
}

export function ApplicationModal({
    isOpen,
    onClose,
    jobId,
    jobTitle,
    companyName,
}: ApplicationModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [coverLetter, setCoverLetter] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                toast.error("Only PDF files are allowed.");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB.");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please upload your resume.");
            return;
        }

        try {
            setIsSubmitting(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("You must be logged in.");
                return;
            }

            // 1. Upload Resume
            const fileExt = file.name.split(".").pop();
            const fileName = `${jobId}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("resumes")
                .upload(filePath, file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                throw new Error("Failed to upload resume");
            }

            // 2. Submit Application
            const { error: submitError } = await submitApplication({
                jobId,
                resumeUrl: filePath,
                coverLetter,
            });

            if (submitError) {
                throw new Error(submitError);
            }

            toast.success("Application submitted successfully!");
            onClose();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-gray-900 border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle>Apply for {jobTitle}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Send your application to {companyName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid w-full items-center gap-2">
                        <Label htmlFor="resume">Resume (PDF, max 5MB)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="resume"
                                type="file"
                                accept="application/pdf"
                                className="bg-black/40 border-white/10 cursor-pointer file:text-white file:bg-gray-800 file:border-0 file:mr-4 file:px-4 file:py-2 file:text-sm file:font-semibold"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    <div className="grid w-full gap-2">
                        <Label htmlFor="cover-letter">Cover Letter (Optional)</Label>
                        <Textarea
                            id="cover-letter"
                            placeholder="Tell us why you're a great fit..."
                            className="bg-black/40 border-white/10 h-32"
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting} className="border-white/10 hover:bg-white/5 hover:text-white text-gray-400">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50 hover:bg-neon-cyan/30">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Application
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
