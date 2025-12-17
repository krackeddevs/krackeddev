"use client";

import { useState } from "react";
import { ProfileData } from "../actions";
import { ProfileDetails } from "./profile-details";
import { EditProfileForm } from "./edit-profile-form";

interface ProfilePageClientProps {
    initialData: ProfileData;
}

export function ProfilePageClient({ initialData }: ProfilePageClientProps) {
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
                    onEdit={() => setIsEditing(true)}
                />
            )}
        </div>
    );
}
