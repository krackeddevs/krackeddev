"use client";

import { useState } from "react";
import { ProfileData } from "../actions";
import { GithubStats, BountyStats, UserSubmission, ContributionStats } from "../types";
import { ProfileDetails } from "./profile-details";
import { EditProfileForm } from "./edit-profile-form";

interface ProfilePageClientProps {
    initialData: ProfileData;
    githubStats?: GithubStats;
    bountyStats?: BountyStats;
    userSubmissions?: UserSubmission[];
    contributionStats?: ContributionStats | null;
}

export function ProfilePageClient({ initialData, githubStats, bountyStats, userSubmissions, contributionStats }: ProfilePageClientProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-6">

            {isEditing ? (
                <EditProfileForm
                    initialData={initialData}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <ProfileDetails
                    profile={initialData}
                    githubStats={githubStats}
                    bountyStats={bountyStats}
                    userSubmissions={userSubmissions}
                    onEdit={() => setIsEditing(true)}
                    contributionStats={contributionStats}
                />
            )}
        </div>
    );
}
