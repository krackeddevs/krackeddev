'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Loader2, MapPin, Code, User } from 'lucide-react';
import { saveOnboardingDetails } from '../actions';
import { developerRoles, techStacks, type OnboardingFormData } from '../schema';

export function OnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<OnboardingFormData>({
        developerRole: 'junior',
        stack: [],
        location: '',
        country: 'Malaysia',
        state: '',
        otherCountry: '',
    });

    const handleRoleSelect = (role: string) => {
        setFormData(prev => ({ ...prev, developerRole: role as OnboardingFormData['developerRole'] }));
    };

    const handleStackToggle = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            stack: prev.stack.includes(tech)
                ? prev.stack.filter(t => t !== tech)
                : [...prev.stack, tech],
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const result = await saveOnboardingDetails(formData);

        if (result.error) {
            setError(result.error);
            setLoading(false);
            return;
        }

        router.push('/');
        router.refresh();
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!formData.developerRole;
            case 2: return formData.stack.length > 0;
            case 3: return formData.location.length >= 2;
            default: return false;
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`w-3 h-3 rounded-full transition-colors ${s <= step ? 'bg-neon-primary' : 'bg-muted'
                                }`}
                        />
                    ))}
                </div>

                <div className="bg-card border border-neon-primary/30 p-8 shadow-[0_0_30px_rgba(21,128,61,0.2)]">
                    {/* Step 1: Role */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <User className="w-12 h-12 text-neon-primary mx-auto" />
                                <h1 className="text-2xl font-bold text-foreground">What's your experience level?</h1>
                                <p className="text-muted-foreground">This helps us match you with relevant bounties.</p>
                            </div>

                            <div className="grid gap-3">
                                {developerRoles.map((role) => (
                                    <button
                                        key={role.value}
                                        onClick={() => handleRoleSelect(role.value)}
                                        className={`p-4 border text-left transition-all ${formData.developerRole === role.value
                                            ? 'border-neon-primary bg-neon-primary/10 text-neon-primary'
                                            : 'border-border hover:border-neon-primary/50 text-foreground'
                                            }`}
                                    >
                                        <span className="font-medium">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Stack */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <Code className="w-12 h-12 text-neon-primary mx-auto" />
                                <h1 className="text-2xl font-bold text-foreground">What's your tech stack?</h1>
                                <p className="text-muted-foreground">Select all technologies you work with.</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {techStacks.map((tech) => (
                                    <button
                                        key={tech}
                                        onClick={() => handleStackToggle(tech)}
                                        className={`px-3 py-1.5 text-sm border transition-all ${formData.stack.includes(tech)
                                            ? 'border-neon-primary bg-neon-primary/10 text-neon-primary'
                                            : 'border-border hover:border-neon-primary/50 text-foreground'
                                            }`}
                                    >
                                        {formData.stack.includes(tech) && <Check className="w-3 h-3 inline mr-1" />}
                                        {tech}
                                    </button>
                                ))}
                            </div>

                            {formData.stack.length > 0 && (
                                <p className="text-sm text-muted-foreground text-center">
                                    Selected: {formData.stack.length} technologies
                                </p>
                            )}
                        </div>
                    )}

                    {/* Step 3: Location */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <MapPin className="w-12 h-12 text-neon-primary mx-auto" />
                                <h1 className="text-2xl font-bold text-foreground">Where are you based?</h1>
                                <p className="text-muted-foreground">Help us connect you with local opportunities.</p>
                            </div>

                            {/* Country Selection */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-2">Country</label>
                                    <select
                                        value={formData.country || 'Malaysia'}
                                        onChange={(e) => {
                                            const country = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                country,
                                                state: '',
                                                location: country === 'Malaysia' ? '' : prev.location,
                                            }));
                                        }}
                                        className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-neon-primary"
                                    >
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Other">Other Country</option>
                                    </select>
                                </div>

                                {formData.country === 'Other' ? (
                                    <>
                                        {/* Other Country - Text inputs */}
                                        <div>
                                            <label className="block text-sm text-muted-foreground mb-2">Country Name</label>
                                            <input
                                                type="text"
                                                value={formData.otherCountry || ''}
                                                onChange={(e) => {
                                                    const otherCountry = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        otherCountry,
                                                        location: `${prev.state || ''}, ${otherCountry}`.replace(/^, /, ''),
                                                    }));
                                                }}
                                                placeholder="e.g., Singapore"
                                                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-muted-foreground mb-2">State / City</label>
                                            <input
                                                type="text"
                                                value={formData.state || ''}
                                                onChange={(e) => {
                                                    const state = e.target.value;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        state,
                                                        location: `${state}, ${prev.otherCountry || ''}`.replace(/, $/, ''),
                                                    }));
                                                }}
                                                placeholder="e.g., Central Region"
                                                className="w-full px-4 py-3 bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-primary"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    /* Malaysia - State dropdown */
                                    <div>
                                        <label className="block text-sm text-muted-foreground mb-2">State</label>
                                        <select
                                            value={formData.state || ''}
                                            onChange={(e) => {
                                                const state = e.target.value;
                                                setFormData(prev => ({
                                                    ...prev,
                                                    state,
                                                    location: `${state}, Malaysia`,
                                                }));
                                            }}
                                            className="w-full px-4 py-3 bg-background border border-border text-foreground focus:outline-none focus:border-neon-primary"
                                        >
                                            <option value="">Select a state</option>
                                            <option value="Johor">Johor</option>
                                            <option value="Kedah">Kedah</option>
                                            <option value="Kelantan">Kelantan</option>
                                            <option value="Kuala Lumpur">Kuala Lumpur</option>
                                            <option value="Labuan">Labuan</option>
                                            <option value="Melaka">Melaka</option>
                                            <option value="Negeri Sembilan">Negeri Sembilan</option>
                                            <option value="Pahang">Pahang</option>
                                            <option value="Penang">Penang</option>
                                            <option value="Perak">Perak</option>
                                            <option value="Perlis">Perlis</option>
                                            <option value="Putrajaya">Putrajaya</option>
                                            <option value="Sabah">Sabah</option>
                                            <option value="Sarawak">Sarawak</option>
                                            <option value="Selangor">Selangor</option>
                                            <option value="Terengganu">Terengganu</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={() => setStep(prev => prev - 1)}
                            disabled={step === 1}
                            className="px-4 py-2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={() => setStep(prev => prev + 1)}
                                disabled={!canProceed()}
                                className="flex items-center gap-2 px-6 py-2 bg-neon-primary text-black font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-primary/90 transition-colors"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={!canProceed() || loading}
                                className="flex items-center gap-2 px-6 py-2 bg-neon-primary text-black font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neon-primary/90 transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        Complete Setup
                                        <Check className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
