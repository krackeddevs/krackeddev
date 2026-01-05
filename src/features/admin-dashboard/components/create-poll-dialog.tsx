"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PollForm } from "./poll-form";

export function CreatePollDialog() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-neon-cyan text-black hover:bg-neon-cyan/80">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Poll
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0">
                <div className="p-6">
                    <DialogHeader>
                        <DialogTitle>Create New Bounty Poll</DialogTitle>
                        <DialogDescription>
                            Create a poll for the community to vote on the next bounty.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="px-6 pb-6">
                    <PollForm onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
