"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type BountyProposalOption = {
    label: string;
    difficulty?: string;
    description?: string;
    requirements?: string[];
    estimated_reward?: number;
};

export type CreatePollData = {
    question: string;
    description?: string;
    endAt: string;
    options: BountyProposalOption[];
};

export async function createPoll(data: CreatePollData) {
    const supabase = await createClient();

    // 1. Create Poll
    const { data: poll, error: pollError } = await (supabase.from("polls" as any) as any)
        .insert({
            question: data.question,
            description: data.description,
            end_at: data.endAt,
            status: "active",
            created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

    if (pollError || !poll) {
        return { error: pollError?.message || "Failed to create poll" };
    }

    // 2. Create Options (Bounty Proposals)
    const optionsData = data.options.map(option => ({
        poll_id: poll.id,
        label: option.label,
        difficulty: option.difficulty || null,
        description: option.description || null,
        requirements: option.requirements || [],
        estimated_reward: option.estimated_reward || null,
    }));

    const { error: optionsError } = await (supabase.from("poll_options" as any) as any)
        .insert(optionsData);

    if (optionsError) {
        return { error: "Created poll but failed to add bounty proposals" };
    }

    revalidatePath("/admin/polls");
    revalidatePath("/code/bounty");
    return { success: true, pollId: poll.id };
}

export async function closePoll(pollId: string) {
    const supabase = await createClient();
    const { error } = await (supabase.from("polls" as any) as any)
        .update({ status: "closed" })
        .eq("id", pollId);

    if (error) return { error: error.message };

    revalidatePath("/admin/polls");
    revalidatePath("/code/bounty");
    return { success: true };
}

export async function getPolls() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("polls")
        .select(`
            *,
            options:poll_options(*),
            votes:poll_votes(count)
        `)
        .order("created_at", { ascending: false });

    return { data, error };
}

export async function getActivePoll(userId?: string) {
    const supabase = await createClient();

    // Fetch the most recent poll (active or closed)
    // We prioritize "active" ones if multiple exist, or just latest created
    const { data: poll, error } = await (supabase.from("polls" as any) as any)
        .select(`
          *,
          options:poll_options(*)
        `)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.error("Error fetching active poll:", error);
        return { data: null };
    }

    if (!poll) return { data: null };

    // Fetch vote counts (using view or raw count)
    // Using simple count for now since view might not be accessible if migration failed
    const { data: votes, error: votesError } = await (supabase
        .from("poll_votes")
        .select("option_id")
        .eq("poll_id", poll.id)
    );

    if (votesError) {
        console.error("Error fetching votes:", votesError);
    }

    // Client-side counting for now to match constraints
    const results = poll.options.reduce((acc: any, opt: any) => {
        acc[opt.id] = votes?.filter((v: any) => v.option_id === opt.id).length || 0;
        return acc;
    }, {});

    // Check user vote
    let userVoteId = null;
    if (userId) {
        const { data: userVote } = await (supabase.from("poll_votes" as any) as any)
            .select("option_id")
            .eq("poll_id", poll.id)
            .eq("user_id", userId)
            .single();
        if (userVote) userVoteId = userVote.option_id;
    }

    return {
        data: {
            ...poll,
            results,
            userVoteId
        }
    };
}

export async function votePoll(pollId: string, optionId: string) {
    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) return { error: "Must be logged in to vote" };

    // Check if poll is active
    const { data: poll } = await (supabase.from("polls" as any) as any)
        .select("status, end_at")
        .eq("id", pollId)
        .single();

    if (!poll) return { error: "Poll not found" };
    if (poll.status === 'closed') return { error: "This poll is closed" };
    if (new Date(poll.end_at) < new Date()) return { error: "This poll has ended" };

    const { error } = await (supabase.from("poll_votes" as any) as any)
        .insert({
            poll_id: pollId,
            option_id: optionId,
            user_id: user.id
        });

    if (error) {
        if (error.code === '23505') return { error: "You have already voted" };
        return { error: error.message };
    }

    revalidatePath("/code/bounty");
    return { success: true };
}
