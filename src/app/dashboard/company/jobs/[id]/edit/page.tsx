import { getJobById } from "@/features/companies/actions";
import { JobPostingWizard } from "@/features/companies/components/job-posting-wizard";
import { redirect } from "next/navigation";

interface EditJobPageProps {
    params: {
        id: string;
    };
}

export default async function EditJobPage({ params }: EditJobPageProps) {
    const { id } = await params; // Await params in Next.js 15+
    const { data: job } = await getJobById(id);

    if (!job) {
        redirect("/dashboard/company/jobs");
    }

    // Convert null values to undefined/empty strings for form compatibility
    const formData = {
        ...job,
        salary_min: job.salary_min ?? undefined,
        salary_max: job.salary_max ?? undefined,
        application_url: job.application_url ?? undefined,
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Edit Job</h1>
                <p className="text-muted-foreground">Update your job posting details</p>
            </div>
            <JobPostingWizard initialData={formData as any} isEditing={true} jobId={id} />
        </div>
    );
}
