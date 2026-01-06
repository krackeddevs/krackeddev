"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface GovernmentContactFormProps {
    inquiryType: 'policy_maker' | 'mdec_ministry' | 'glc_company';
    title: string;
    description: string;
}

export function GovernmentContactForm({ inquiryType, title, description }: GovernmentContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        organization_name: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        position_title: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch('/api/government-inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inquiry_type: inquiryType,
                    ...formData
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit inquiry');
            }

            setSubmitStatus('success');
            // Reset form
            setFormData({
                organization_name: '',
                contact_name: '',
                contact_email: '',
                contact_phone: '',
                position_title: '',
                message: ''
            });
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit inquiry');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (submitStatus === 'success') {
        return (
            <div className="bg-neon-primary/10 border border-neon-primary/30 rounded-xl p-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-neon-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold font-mono text-foreground mb-2 uppercase">
                    Thank You!
                </h3>
                <p className="text-muted-foreground mb-4">
                    Your inquiry has been submitted successfully. We'll be in touch soon.
                </p>
                <Button
                    variant="outline"
                    onClick={() => setSubmitStatus('idle')}
                    className="border-neon-primary/50 text-neon-primary hover:bg-neon-primary/10"
                >
                    Submit Another Inquiry
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-card/40 backdrop-blur-md border border-border rounded-xl p-6">
            <div className="mb-6">
                <h3 className="text-xl font-bold font-mono text-foreground mb-2 uppercase">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {description}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="organization_name" className="font-mono text-sm">
                            Organization Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="organization_name"
                            name="organization_name"
                            value={formData.organization_name}
                            onChange={handleChange}
                            required
                            placeholder="e.g., MDEC, Ministry of Digital"
                            className="bg-background/50 border-border focus:border-neon-cyan"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact_name" className="font-mono text-sm">
                            Your Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="contact_name"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            required
                            placeholder="Full name"
                            className="bg-background/50 border-border focus:border-neon-cyan"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact_email" className="font-mono text-sm">
                            Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="contact_email"
                            name="contact_email"
                            type="email"
                            value={formData.contact_email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@organization.gov.my"
                            className="bg-background/50 border-border focus:border-neon-cyan"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact_phone" className="font-mono text-sm">
                            Phone Number
                        </Label>
                        <Input
                            id="contact_phone"
                            name="contact_phone"
                            type="tel"
                            value={formData.contact_phone}
                            onChange={handleChange}
                            placeholder="+60 12-345 6789"
                            className="bg-background/50 border-border focus:border-neon-cyan"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="position_title" className="font-mono text-sm">
                        Position / Title
                    </Label>
                    <Input
                        id="position_title"
                        name="position_title"
                        value={formData.position_title}
                        onChange={handleChange}
                        placeholder="e.g., Director, Policy Advisor"
                        className="bg-background/50 border-border focus:border-neon-cyan"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="message" className="font-mono text-sm">
                        Message <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us about your interest in partnering with Kracked Devs..."
                        className="bg-background/50 border-border focus:border-neon-cyan resize-none"
                    />
                </div>

                {submitStatus === 'error' && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-destructive">
                                Failed to submit inquiry
                            </p>
                            <p className="text-xs text-destructive/80 mt-1">
                                {errorMessage || 'Please try again later.'}
                            </p>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-neon-cyan text-primary-foreground hover:bg-neon-cyan/90 font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-all duration-300"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Inquiry'
                    )}
                </Button>
            </form>
        </div>
    );
}
