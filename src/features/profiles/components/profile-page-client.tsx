"use client";

import { useState } from "react";
import { ProfileData } from "../actions";
import { GithubStats, BountyStats, UserSubmission } from "../types";
import { ProfileDetails } from "./profile-details";
import { EditProfileForm } from "./edit-profile-form";

interface ProfilePageClientProps {
    initialData: ProfileData;
    githubStats?: GithubStats;
    bountyStats?: BountyStats;
    userSubmissions?: UserSubmission[];
}

export function ProfilePageClient({ initialData, githubStats, bountyStats, userSubmissions }: ProfilePageClientProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="container max-w-4xl mx-auto">
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
                />
            )}
        </div>
    );
}
