export function formatMemberSince(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(date);
}

export function formatCompactDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}
