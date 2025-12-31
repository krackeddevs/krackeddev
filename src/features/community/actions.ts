"use server";

import { createClient } from "@/lib/supabase/server";
import { Question, Answer } from "@/types/database";

export interface GetQuestionsParams {
    filter?: "newest" | "top" | "unanswered";
    page?: number;
    searchQuery?: string;
    tag?: string;
}

export interface QuestionWithAuthor extends Question {
    author: {
        username: string | null;
        avatar_url: string | null;
    };
    answers_count: number;
}

export interface QuestionDetail extends QuestionWithAuthor {
    answers: (Answer & {
        author: {
            username: string | null;
            avatar_url: string | null;
        };
        comments: (import("@/types/database").Comment & {
            author: {
                username: string | null;
                avatar_url: string | null
            }
        })[];
    })[];
}



export async function getQuestions({
    filter = "newest",
    page = 1,
    searchQuery = "",
    tag,
}: GetQuestionsParams) {
    const supabase = await createClient();
    const PAGE_SIZE = 10;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;


    let query = (supabase.from("questions") as any)
        .select(`
            id,
            title,
            slug,
            body,
            tags,
            upvotes,
            view_count,
            accepted_answer_id,
            created_at,
            author:author_id(username, avatar_url),
            answers:answers!answers_question_id_fkey(count)
        `, { count: "exact" });

    if (searchQuery) {
        query = query.textSearch("search_vector", searchQuery, {
            type: "websearch",
            config: "english",
        });
    }

    if (tag) {
        query = query.contains("tags", [tag]);
    }

    switch (filter) {
        case "newest":
            query = query.order("created_at", { ascending: false });
            break;
        case "top":
            query = query.order("upvotes", { ascending: false });
            break;
        case "unanswered":
            // This is a bit tricky with Supabase basic filtering if we rely on answers count relation
            // We can check accepted_answer_id is null for "unresolved"
            // For strictly "0 answers", we might need a custom view or client-side filter (bad for pagination)
            // Let's stick to "Unresolved" meaning no accepted answer
            query = query.is("accepted_answer_id", null).order("created_at", { ascending: false });
            break;
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
        console.error("Error fetching questions:", JSON.stringify(error, null, 2));
        return { questions: [], count: 0 };
    }

    // Transform to include answers_count neatly
    const questions = data.map((q: any) => ({
        ...q,
        answers_count: q.answers?.[0]?.count || 0,
        // Remove the answers array object returned by count
        answers: undefined,
    })) as QuestionWithAuthor[];

    return { questions, count: count || 0 };
}

export async function getQuestionBySlug(slug: string): Promise<QuestionDetail | null> {
    const supabase = await createClient();

    // First fetch question

    const { data: question, error } = await (supabase.from("questions") as any)
        .select(`
            *,
            author:author_id(username, avatar_url)
        `)
        .eq("slug", slug)
        .single();

    if (error || !question) {
        if (error) {
            console.error("Error fetching question by slug:", JSON.stringify(error, null, 2));
        } else {
            console.warn(`Question not found for slug: ${slug}`);
        }
        return null;
    }

    // Fetch answers separately to order them: Accepted -> Upvotes -> Newest

    const { data: answers, error: answerError } = await (supabase.from("answers") as any)
        .select(`
            *,
            author:author_id(username, avatar_url)
        `)
        .eq("question_id", question.id)
        .order("is_accepted", { ascending: false })
        .order("upvotes", { ascending: false })
        .order("created_at", { ascending: false });

    if (answerError) {
        console.error("Error fetching answers:", answerError.message, answerError.details, answerError.hint);
    }

    // Fetch comments for these answers
    let answersWithComments = [];
    if (answers && answers.length > 0) {
        const answerIds = answers.map((a: any) => a.id);

        const { data: comments, error: commentsError } = await (supabase.from("comments") as any)
            .select(`
                *,
                author:author_id(username, avatar_url)
            `)
            .in("answer_id", answerIds)
            .order("created_at", { ascending: true });

        if (commentsError) {
            console.error("Error fetching comments:", commentsError);
        }

        answersWithComments = answers.map((answer: any) => ({
            ...answer,
            comments: comments?.filter((c: any) => c.answer_id === answer.id) || []
        }));
    } else {
        answersWithComments = [];
    }

    // No need to sort comments again if we ordered by created_at in the query, 
    // but filter preserves order usually.

    return {
        ...question,
        answers_count: answersWithComments.length,
        answers: answersWithComments,
    } as unknown as QuestionDetail;


}



export async function incrementViewCount(questionId: string, slug: string) {
    const supabase = await createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)("increment_question_view", { question_id: questionId });
    if (error) {
        console.error("Error incrementing view count:", error);
    }

    revalidatePath(`/community/question/${slug}`);
}

// ----------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------

import { z } from "zod";
// import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const questionSchema = z.object({
    title: z.string().min(15, "Title must be at least 15 characters").max(150, "Title must be less than 150 characters"),
    body: z.string().min(30, "Body must be at least 30 characters"),
    tags: z.array(z.string()).max(5, "Maximum 5 tags allowed"),
});

const answerSchema = z.object({
    body: z.string().min(30, "Body must be at least 30 characters"),
    question_id: z.string().uuid(),
});

const commentSchema = z.object({
    body: z.string().min(5, "Comment must be at least 5 characters").max(500, "Comment too long"),
    answer_id: z.string().uuid(),
});

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w\-]+/g, "") // Remove all non-word chars
        .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function createQuestion(prevState: any, formData: FormData) {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in to ask a question." };
    }

    // Parse Data
    const rawData = {
        title: formData.get("title") as string,
        body: formData.get("body") as string,
        tags: (formData.get("tags") as string)?.split(",").filter(Boolean) || [],
    };

    const validated = questionSchema.safeParse(rawData);

    if (!validated.success) {
        const errorMessage = validated.error.issues[0]?.message || "Invalid input";
        return { error: errorMessage };
    }

    const { title, body, tags } = validated.data;

    // Sanitize Body
    const sanitizedBody = body.trim();

    // Slug generation
    let slug = slugify(title);
    const suffix = Math.floor(Math.random() * 10000); // Simple collision avoider
    const { data: existing } = await (supabase.from("questions") as any).select("slug").eq("slug", slug).single();
    if (existing) {
        slug = `${slug}-${suffix}`;
    }

    // Insert
    const { error } = await (supabase.from("questions") as any).insert({
        title,
        slug,
        body: sanitizedBody,
        tags,
        author_id: user.id,
    } as any);

    if (error) {
        console.error("Create question error:", error);
        return { error: "Failed to create question." };
    }

    revalidatePath("/community");
    redirect(`/community/question/${slug}`);
}

export async function createAnswer(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in to answer." };
    }

    const rawData = {
        body: formData.get("body") as string,
        question_id: formData.get("question_id") as string,
    };

    const validated = answerSchema.safeParse(rawData);

    if (!validated.success) {
        const errorMessage = validated.error.issues[0]?.message || "Invalid input";
        return { error: errorMessage };
    }

    const { body, question_id } = validated.data;
    const sanitizedBody = body.trim();

    const { error } = await (supabase.from("answers") as any).insert({
        body: sanitizedBody,
        question_id,
        author_id: user.id,
    } as any);

    if (error) {
        console.error("Create answer error:", error);
        return { error: "Failed to post answer." };
    }

    revalidatePath("/community");
    return { success: true };
}

export async function createComment(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: "You must be logged in to comment." };
    }

    const rawData = {
        body: formData.get("body") as string,
        answer_id: formData.get("answer_id") as string,
    };

    const validated = commentSchema.safeParse(rawData);

    if (!validated.success) {
        const errorMessage = validated.error.issues[0]?.message || "Invalid input";
        return { error: errorMessage };
    }

    const { body, answer_id } = validated.data;
    // Comments are usually simpler text, maybe no huge markdown needed, but safe to sanitize anyway
    const sanitizedBody = body.trim(); // or simpler escape

    const { error } = await (supabase.from("comments") as any).insert({
        body: sanitizedBody,
        answer_id,
        author_id: user.id,
    } as any);

    if (error) {
        console.error("Create comment error:", error);
        return { error: "Failed to post comment." };
    }

    revalidatePath("/community");
    return { success: true };
}

export async function acceptAnswer(questionId: string, answerId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized" };
    }

    // Call the secure RPC
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)("toggle_accepted_answer", {
        p_question_id: questionId,
        p_answer_id: answerId
    });

    if (error) {
        console.error("Error accepting answer:", error);
        return { error: error.message || "Failed to accept answer" };
    }

    revalidatePath(`/community/question`); // Revalidate generally or specific path if we had the slug
    // Since we don't have slug here easily without fetching, we might rely on client refresh or simpler revalidate
    // Ideally we pass the path or slug to this action if needed, but revalidating the layout might be enough.
    revalidatePath("/community");
    return { success: true };
}

export async function vote(
    resourceType: "question" | "answer",
    resourceId: string,
    direction: "up" | "down"
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)("handle_vote", {
        p_user_id: user.id,
        p_resource_id: resourceId,
        p_resource_type: resourceType,
        p_direction: direction
    });

    if (error) {
        console.error("Error voting:", error);
        return { error: error.message || "Failed to vote" };
    }

    revalidatePath("/community");
    return { success: true };
}
