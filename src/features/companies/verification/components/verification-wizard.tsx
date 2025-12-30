"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { VerificationWizardData } from "../types";
import { VerificationStep1 } from "./verification-step-1";
import { VerificationStep2 } from "./verification-step-2";
import { VerificationStep3 } from "./verification-step-3";
import { VerificationStep4 } from "./verification-step-4";
import { VerificationStep5 } from "./verification-step-5";
import { submitVerificationRequest } from "../actions";
import { toast } from "sonner";

interface VerificationWizardProps {
    companyId: string;
    companyName: string;
}

const STEP_TITLES = [
    "Business Documents",
    "Email Verification",
    "Contact Details",
    "Additional Context",
    "Review & Submit",
];

export function VerificationWizard({ companyId, companyName }: VerificationWizardProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [wizardData, setWizardData] = useState<VerificationWizardData>({
        businessRegistrationNumber: "",
        registrationDocument: null,
        taxId: "",
        verificationEmail: "",
        emailVerified: false,
        requesterName: "",
        requesterTitle: "",
        requesterPhone: "",
        reason: "",
        expectedJobCount: "1-5",
        confirmAccuracy: false,
        currentStep: 1,
        companyId,
    });

    const updateData = (data: Partial<VerificationWizardData>) => {
        setWizardData((prev) => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (currentStep < 5) {
            setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
        }
    };

    const handleSubmit = async () => {
        if (!wizardData.confirmAccuracy) {
            toast.error("Please confirm that all information is accurate");
            return;
        }

        if (!wizardData.registrationDocumentUrl) {
            toast.error("Registration document not uploaded");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await submitVerificationRequest({
                companyId,
                businessRegistrationNumber: wizardData.businessRegistrationNumber,
                registrationDocumentUrl: wizardData.registrationDocumentUrl,
                taxId: wizardData.taxId,
                verificationEmail: wizardData.verificationEmail,
                requesterName: wizardData.requesterName,
                requesterTitle: wizardData.requesterTitle,
                requesterPhone: wizardData.requesterPhone,
                reason: wizardData.reason,
                expectedJobCount: wizardData.expectedJobCount,
            });

            if (result.success) {
                toast.success("Verification request submitted successfully!");
                router.push("/dashboard/company");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to submit verification request");
        } finally {
            setIsSubmitting(false);
        }
    };

    const progress = (currentStep / 5) * 100;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Request Verification</h1>
                <p className="text-muted-foreground">
                    Verify {companyName} to display a verified badge and build trust with job seekers
                </p>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Step {currentStep} of 5</span>
                    <span>{STEP_TITLES[currentStep - 1]}</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{STEP_TITLES[currentStep - 1]}</CardTitle>
                    <CardDescription>
                        {currentStep === 1 && "Upload your business registration documents"}
                        {currentStep === 2 && "Verify your company email address"}
                        {currentStep === 3 && "Provide your contact information"}
                        {currentStep === 4 && "Tell us why you want to be verified"}
                        {currentStep === 5 && "Review and submit your verification request"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {currentStep === 1 && (
                        <VerificationStep1
                            data={wizardData}
                            updateData={updateData}
                            onNext={nextStep}
                        />
                    )}
                    {currentStep === 2 && (
                        <VerificationStep2
                            data={wizardData}
                            updateData={updateData}
                            onNext={nextStep}
                            onBack={prevStep}
                            companyId={companyId}
                        />
                    )}
                    {currentStep === 3 && (
                        <VerificationStep3
                            data={wizardData}
                            updateData={updateData}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 4 && (
                        <VerificationStep4
                            data={wizardData}
                            updateData={updateData}
                            onNext={nextStep}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 5 && (
                        <VerificationStep5
                            data={wizardData}
                            updateData={updateData}
                            onBack={prevStep}
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
