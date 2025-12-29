import { JobsList } from "@/features/companies/components/jobs-list";
import { getCompanyJobs } from "@/features/companies/actions";
// Layout is already handled by layout.tsx in parent folder

export default async function CompanyJobsPage() {
    const { data: jobs } = await getCompanyJobs();

    return (
        <JobsList jobs={jobs || []} />
    );
}
