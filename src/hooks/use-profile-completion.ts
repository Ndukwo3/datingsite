
"use client";

import { useMemo } from 'react';
import type { User } from '@/lib/types';

export const completionSteps = [
    { key: 'photos', check: (user: User) => user.photos && user.photos.length >= 3, weight: 20, title: "Add more photos", description: "Profiles with at least 3 photos get more attention.", buttonText: "Add Photos" },
    { key: 'bio', check: (user: User) => user.bio && user.bio.length >= 50, weight: 20, title: "Write a bio", description: "Tell us about yourself! A good bio is at least 50 characters long.", buttonText: "Write Bio" },
    { key: 'interests', check: (user: User) => user.interests && user.interests.length >= 3, weight: 15, title: "Add interests", description: "Select at least 3 interests to help us find better matches.", buttonText: "Add Interests" },
    { key: 'job', check: (user: User) => !!user.job, weight: 10, title: "Add your job", description: "What do you do for a living?", buttonText: "Add Job" },
    { key: 'education', check: (user: User) => !!user.education, weight: 10, title: "Add your education", description: "Where did you study?", buttonText: "Add Education" },
    { key: 'relationshipGoal', check: (user: User) => !!user.relationshipGoal, weight: 5, title: "Set your goal", description: "What are you looking for?", buttonText: "Set Goal" },
    { key: 'height', check: (user: User) => !!user.height, weight: 5, title: "Add your height", description: "Let people know your height.", buttonText: "Add Height" },
    { key: 'exercise', check: (user: User) => !!user.exercise, weight: 5, title: "Add exercise habits", description: "Share your fitness routine.", buttonText: "Set Habits" },
    { key: 'drinking', check: (user: User) => !!user.drinking, weight: 5, title: "Add drinking habits", description: "Share your drinking preferences.", buttonText: "Set Habits" },
    { key: 'smoking', check: (user: User) => !!user.smoking, weight: 5, title: "Add smoking habits", description: "Share your smoking preferences.", buttonText: "Set Habits" },
];

export function useProfileCompletion(user: User | null) {
    const { completionPercentage, nextStep } = useMemo(() => {
        if (!user) {
            return { completionPercentage: 0, nextStep: null };
        }

        let completedWeight = 0;
        let nextStep = null;

        for (const step of completionSteps) {
            if (step.check(user)) {
                completedWeight += step.weight;
            } else if (!nextStep) {
                nextStep = step;
            }
        }

        return { completionPercentage: completedWeight, nextStep };
    }, [user]);

    return { completionPercentage, nextStep };
}

    
