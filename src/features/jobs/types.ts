export interface JobStats {
    totalJobs: number;
    remoteJobs: number;
    verifiedCompanies: number;
    newJobs: number;
}

export interface JobFilters {
    search: string;
    location: string;
    type: string;
    salaryMin: number;
}
