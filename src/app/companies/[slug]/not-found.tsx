import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Company Not Found",
    description: "The company you're looking for could not be found.",
};

export default function CompanyNotFound() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex flex-col items-center justify-center text-center">
                <h1 className="text-4xl font-bold mb-4">Company Not Found</h1>
                <p className="text-muted-foreground mb-8">
                    The company you're looking for doesn't exist or may have been removed.
                </p>
                <a
                    href="/jobs"
                    className="text-primary hover:underline"
                >
                    Browse all jobs →
                </a>
            </div>
        </div>
    );
}
