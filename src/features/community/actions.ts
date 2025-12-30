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

    let query = supabase
        .from("questions")
        .select(`
            *,
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
    const { data: question, error } = await supabase
        .from("questions")
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
    const { data: answers, error: answerError } = await supabase
        .from("answers")
        .select(`
            *,
            author:author_id(username, avatar_url)
        `)
        .eq("question_id", question.id)
        .order("is_accepted", { ascending: false })
        .order("upvotes", { ascending: false })
        .order("created_at", { ascending: false });

    if (answerError) {
        console.error("Error fetching answers:", answerError);
    }

    return {
        ...question,
        answers_count: answers?.length || 0,
        answers: answers || [],
    } as unknown as QuestionDetail;
}

export async function incrementViewCount(questionId: string) {
    const supabase = await createClient();
    await supabase.rpc("increment_question_view", { question_id: questionId });
}
