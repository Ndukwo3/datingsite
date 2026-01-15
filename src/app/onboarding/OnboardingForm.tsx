
"use client";

import { useState, useRef } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, Upload, Camera, ArrowLeft, Info, ChevronDown, Check, Star, X, PartyPopper, MapPin } from 'lucide-react';
import { cn, compressImage } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GenderSelector } from '@/components/GenderSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { nigerianStates, interestOptions, lifestyleOptions } from '@/lib/data';
import { Slider } from '@/components/ui/slider';
import Link from 'next/link';
import { parse, isValid as isValidDate } from 'date-fns';


const step1Schema = z.object({
  fullName: z.string().min(2, { message: "This is the name everyone will see. It needs to be at least 2 characters." }),
  dob: z.string().refine(val => {
    if (val.length !== 10) return false;
    const parsedDate = parse(val, 'MM/dd/yyyy', new Date());
    return isValidDate(parsedDate) && parsedDate < new Date();
  }, { message: "Please enter a valid date in MM/DD/YYYY format." }).refine(val => {
    const parsedDate = parse(val, 'MM/dd/yyyy', new Date());
    const age = new Date().getFullYear() - parsedDate.getFullYear();
    return age >= 18;
  }, { message: "You must be 18 or older to use LinkUp9ja" }),
  gender: z.enum(['male', 'female', 'other'], { required_error: "Please select a gender." }),
});

const step2Schema = z.object({
  state: z.string({ required_error: "Please select your state." }),
  city: z.string().min(2, "Please enter your city."),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

const step3Schema = z.object({
  photos: z.array(z.string()).min(3, "Please upload at least 3 photos.").max(6),
});

const step4Schema = z.object({
  bio: z.string().min(20, "Bio must be at least 20 characters.").max(500, "Bio cannot exceed 500 characters."),
  interests: z.array(z.string()).min(3, "Please select at least 3 interests.").max(10),
});

const step5Schema = z.object({
    relationshipGoal: z.string({required_error: "Please select what you're looking for."}),
    height: z.string().min(2, "Please enter your height"),
    exercise: z.string({required_error: "Please select your exercise habits."}),
    drinking: z.string({required_error: "Please select your drinking habits."}),
    smoking: z.string({required_error: "Please select your smoking habits."}),
});

const step6Schema = z.object({
    interestedIn: z.enum(['men', 'women', 'everyone']),
    ageRange: z.tuple([z.number(), z.number()]),
    maxDistance: z.number(),
});

const fullSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema).merge(step5Schema).merge(step6Schema);

type FormData = z.infer<typeof fullSchema>;

const steps = [
  { id: 1, title: 'Basic Information', schema: step1Schema, fields: ['fullName', 'dob', 'gender'] },
  { id: 2, title: 'Location', schema: step2Schema, fields: ['state', 'city', 'coordinates'] },
  { id: 3, title: 'Upload Photos', schema: step3Schema, fields: ['photos'] },
  { id: 4, title: 'Bio & Interests', schema: step4Schema, fields: ['bio', 'interests'] },
  { id: 5, title: 'Lifestyle & Details', schema: step5Schema, fields: ['relationshipGoal', 'height', 'exercise', 'drinking', 'smoking'] },
  { id: 6, title: 'Dating Preferences', schema: step6Schema, fields: ['interestedIn', 'ageRange', 'maxDistance'] },
  { id: 7, title: 'Complete', schema: z.object({}), fields: [] },
];

const getAge = (dobString: string | undefined) => {
    if (!dobString) return null;
    const dob = parse(dobString, 'MM/dd/yyyy', new Date());
    if (!isValidDate(dob)) return null;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

const formatDobInput = (value: string) => {
    let input = value.replace(/\D/g, '').substring(0, 8);
    const month = input.substring(0, 2);
    const day = input.substring(2, 4);
    const year = input.substring(4, 8);

    if (input.length > 4) {
        return `${month}/${day}/${year}`;
    } else if (input.length > 2) {
        return `${month}/${day}`;
    }
    return input;
};

const toTitleCase = (str: string) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentSchema = steps[currentStep].schema;

  const methods = useForm<FormData>({
    resolver: zodResolver(currentStep < steps.length - 2 ? currentSchema : fullSchema),
    mode: "onChange",
     defaultValues: {
        fullName: '',
        dob: '',
        gender: undefined,
        state: '',
        city: '',
        photos: [],
        bio: '',
        interests: [],
        relationshipGoal: undefined,
        height: '',
        exercise: undefined,
        drinking: undefined,
        smoking: undefined,
        interestedIn: 'everyone',
        ageRange: [18, 35],
        maxDistance: 50,
    }
  });

  const {
    trigger,
    getValues,
    setValue,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const dob = watch('dob');
  const photos = watch('photos', []);
  const bio = watch('bio', '');
  const interests = watch('interests', []);
  const ageRange = watch('ageRange');
  const maxDistance = watch('maxDistance');
  const coordinates = watch('coordinates');
  const isValid = Object.keys(errors).length === 0;

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as (keyof FormData)[]);

    if (!output) return;

    if (currentStep === 1 && !getValues('coordinates')) {
        handleGetLocation();
        return; // Wait for location before proceeding
    }

    if (currentStep < steps.length - 2) {
        setDirection(1);
        setCurrentStep(step => step + 1);
    } else {
        await handleSubmit(onSubmit)();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(step => step - 1);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!authUser || !firestore) {
        toast({ title: 'You must be logged in to complete onboarding.', variant: 'destructive' });
        return;
    }
    
    setIsSubmitting(true);
    
    const userDocRef = doc(firestore, 'users', authUser.uid);
    const age = getAge(data.dob);

    const finalUserData = {
        name: data.fullName,
        age: age,
        gender: data.gender,
        location: `${data.city}, ${data.state}`,
        coordinates: data.coordinates,
        bio: data.bio,
        interests: data.interests,
        photos: data.photos,
        relationshipGoal: data.relationshipGoal,
        height: data.height,
        exercise: data.exercise,
        drinking: data.drinking,
        smoking: data.smoking,
        onboardingComplete: true,
        createdAt: serverTimestamp(),
        email: authUser.email,
        id: authUser.uid,
    };

    setDoc(userDocRef, finalUserData, { merge: true })
      .then(() => {
        setDirection(1);
        setCurrentStep(step => step + 1);
      })
      .catch(error => {
        const permissionError = new FirestorePermissionError({
          path: userDocRef.path,
          operation: 'update',
          requestResourceData: finalUserData,
        });
        errorEmitter.emit('permission-error', permissionError);
      }).finally(() => {
        setIsSubmitting(false);
      });
  };


  const toggleInterest = (interest: string) => {
    const currentInterests = getValues('interests') || [];
    const isSelected = currentInterests.includes(interest);
    let newInterests;
    if (isSelected) {
      newInterests = currentInterests.filter(i => i !== interest);
    } else {
        if(currentInterests.length >= 10) {
            toast({ title: 'You can select up to 10 interests.', variant: 'destructive' });
            return;
        }
      newInterests = [...currentInterests, interest];
    }
    setValue('interests', newInterests, { shouldValidate: true });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const currentPhotos = getValues('photos') || [];
      
      setUploadingIndex(index);
      
      const placeholderUrl = URL.createObjectURL(file);
      const tempPhotos = [...currentPhotos];
      tempPhotos[index] = placeholderUrl;
      setValue('photos', tempPhotos, { shouldValidate: true });

        try {
            const dataUri = await compressImage(file);
            
            const updatedPhotos = getValues('photos');
            updatedPhotos[index] = dataUri;
            setValue('photos', [...updatedPhotos], { shouldValidate: true });

        } catch (error) {
            console.error("Photo processing failed", error);
            toast({ title: "Photo processing failed", description: "Please try a different image.", variant: 'destructive' });
            const updatedPhotos = getValues('photos').filter((_, i) => i !== index);
            setValue('photos', updatedPhotos, { shouldValidate: true });
        } finally {
            setUploadingIndex(null);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = getValues('photos');
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    setValue('photos', newPhotos, { shouldValidate: true });
  };
  
  const triggerPhotoUpload = (index: number) => {
    if (fileInputRef.current) {
        fileInputRef.current.onchange = (e) => handlePhotoUpload(e as any, index);
        fileInputRef.current.click();
    }
  };

  const navigateTo = (path: string) => {
    if(isSubmitting) return;

    if (authUser && firestore) {
      setIsSubmitting(true);
      const userDocRef = doc(firestore, 'users', authUser.uid);
      setDoc(userDocRef, { onboardingComplete: true }, { merge: true })
        .then(() => {
          router.push(path);
        })
        .catch(() => {
          toast({ title: 'Could not complete setup. Please try again.', variant: 'destructive' });
          setIsSubmitting(false);
        });
    }
  }

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setValue('coordinates', { lat: latitude, lng: longitude }, { shouldValidate: true });
            setIsGettingLocation(false);
            toast({ title: "Location captured!", description: "We've securely saved your location." });
            handleNext(); // Automatically move to the next step
        },
        (error) => {
            console.error("Geolocation error:", error);
            toast({ title: "Location Access Denied", description: "Please enable location services in your browser to continue.", variant: 'destructive' });
            setIsGettingLocation(false);
        }
    );
  };


  const progress = ((currentStep + 1) / (steps.length - 1)) * 100;
  const slideVariants = {
    hidden: (direction: number) => ({ opacity: 0, x: direction > 0 ? '100%' : '-100%' }),
    visible: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? '-100%' : '100%' }),
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full space-y-6">
        <div className="flex items-center gap-4">
            <Progress value={progress} className="h-1 flex-1" />
            <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of {steps.length - 1}</span>
        </div>
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="min-h-[500px]"
          >
            {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button onClick={handlePrev} variant="ghost" className="absolute top-24 left-4 text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back
              </Button>
            )}

            {currentStep === 0 && (
              <div className="space-y-8">
                <div className='text-center'>
                    <h2 className="text-2xl font-headline font-bold">Let's get to know you</h2>
                    <p className="text-muted-foreground">Tell us about yourself</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fullName" className="mb-2 block">What should we call you?</Label>
                    <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="fullName" 
                                placeholder="e.g., Baddo 🌶️" 
                                {...field}
                                onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                            />
                        )}
                    />
                    {errors.fullName && <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor="dob" className="mb-2 block">When's your birthday?</Label>
                    <Controller
                      name="dob"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="dob"
                          placeholder="MM/DD/YYYY"
                          onChange={(e) => {
                            const formatted = formatDobInput(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
                      )}
                    />
                    {errors.dob ? (
                      <p className="text-sm text-destructive mt-1">{errors.dob.message}</p>
                    ) : (
                      dob && getAge(dob) !== null && <p className="text-sm text-muted-foreground mt-1">You are {getAge(dob)} years old</p>
                    )}
                   </div>
                  <div>
                    <Label className="mb-2 block">I am a</Label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <GenderSelector value={field.value} onChange={(value) => field.onChange(value)} />
                        )}
                    />
                    {errors.gender && <p className="text-sm text-destructive mt-1">{errors.gender.message}</p>}
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 1 && (
              <div className="space-y-8">
                 <div className='text-center'>
                    <h2 className="text-2xl font-headline font-bold">Where are you located?</h2>
                    <p className="text-muted-foreground">This helps us show you matches nearby</p>
                </div>
                 <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <Label htmlFor="state">Your State</Label>
                        </div>
                        <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your state" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {nigerianStates.map(state => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.state && <p className="text-sm text-destructive mt-1">{errors.state.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="city" className="mb-2 block">Your City</Label>
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => <Input id="city" placeholder="e.g., Ikeja, Victoria Island" {...field} />}
                        />
                        {errors.city && <p className="text-sm text-destructive mt-1">{errors.city.message}</p>}
                    </div>
                     <div className="rounded-lg bg-blue-500/10 p-3 text-blue-800 dark:bg-blue-300/10 dark:text-blue-200 border border-blue-500/20 flex items-start gap-3">
                        <Info className="h-5 w-5 mt-0.5 shrink-0"/>
                        <p className="text-sm">Your exact location is private. We only show your city and approximate distance to potential matches.</p>
                    </div>
                    {coordinates ? (
                        <div className="rounded-lg bg-green-500/10 p-3 text-green-800 dark:bg-green-300/10 dark:text-green-200 border border-green-500/20 flex items-center gap-3">
                            <Check className="h-5 w-5"/>
                            <p className="text-sm font-medium">Location captured successfully!</p>
                        </div>
                    ) : (
                        <Button onClick={handleGetLocation} disabled={isGettingLocation} className="w-full">
                            {isGettingLocation && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {isGettingLocation ? 'Getting Location...' : 'Use My Current Location'}
                        </Button>
                    )}
                 </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                 <div className='text-center'>
                    <h2 className="text-2xl font-headline font-bold">Show your best self</h2>
                    <p className="text-muted-foreground">Add at least 3 photos. The first will be your main photo.</p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                    />
                    {Array.from({ length: 6 }).map((_, i) => {
                       const photo = photos[i];
                       const isUploading = uploadingIndex === i;

                       return (
                            <div key={`photo-${i}`} className="relative group">
                                <div className="aspect-square rounded-xl border-2 flex items-center justify-center bg-muted/50 overflow-hidden">
                                {photo ? (
                                     <img
                                        src={photo}
                                        alt={`upload-preview-${i}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className='text-center text-muted-foreground p-2'>
                                        <Camera className="w-8 h-8 mb-2 mx-auto"/>
                                        <span className='text-sm'>Add Photo</span>
                                    </div>
                                )}

                                {(isUploading || photo) && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        {isUploading ? (
                                            <Loader2 className="w-8 h-8 animate-spin text-white"/>
                                        ) : (
                                            photo && <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={() => removePhoto(i)}><X className="h-4 w-4"/></Button>
                                        )}
                                    </div>
                                )}
                                
                                {i === 0 && photo && <Badge className='absolute top-2 left-2 bg-primary text-primary-foreground'><Star className='w-3 h-3 mr-1'/> Main</Badge>}

                                {!photo && !isUploading && (
                                    <button type='button' onClick={() => triggerPhotoUpload(i)} className="absolute inset-0 cursor-pointer" aria-label={`Add photo ${i+1}`} />
                                )}
                                </div>
                            </div>
                         )
                    })}
                 </div>
                 {errors.photos && <p className="text-sm text-destructive text-center">{errors.photos.message as string}</p>}
                 <div className='space-y-2 text-sm'>
                    <div className={cn('flex items-center gap-2', photos.length >= 3 ? 'text-green-600' : 'text-muted-foreground')}>
                        {photos.length >= 3 ? <Check className='w-4 h-4'/> : <span className="w-4 h-4" />}
                        At least 3 photos (required)
                    </div>
                    <div className={cn('flex items-center gap-2', photos.length >= 1 ? 'text-green-600' : 'text-muted-foreground')}>
                        <Star className='w-4 h-4'/>
                        First photo is your main profile picture
                    </div>
                    <div className={cn('flex items-center gap-2', 'text-muted-foreground')}>
                        <Camera className='w-4 h-4'/>
                        Clear face photos work best
                    </div>
                 </div>
              </div>
            )}
            
            {currentStep === 3 && (
                <div className="space-y-8">
                    <div className='text-center'>
                        <h2 className="text-2xl font-headline font-bold">Tell your story</h2>
                        <p className="text-muted-foreground">Help others get to know the real you</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="bio" className="mb-2 block">About Me</Label>
                            <Controller
                                name="bio"
                                control={control}
                                render={({ field }) => (
                                    <Textarea 
                                        id="bio" 
                                        placeholder="Share a bit about yourself... What do you love doing? What makes you unique?" 
                                        className="min-h-[120px] bg-muted/50"
                                        {...field}
                                        maxLength={500}
                                    />
                                )}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.bio ? <p className="text-sm text-destructive">{errors.bio.message}</p> : <div/>}
                                <p className="text-sm text-muted-foreground">{bio.length}/500</p>
                            </div>
                        </div>
                        <div>
                            <Label className="mb-2 block">What are you into?</Label>
                            <p className="text-sm text-muted-foreground">Select at least 3 interests ({interests.length}/10 selected)</p>
                             <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] rounded-md border border-input p-2">
                                {interestOptions.map(interest => (
                                    <Badge
                                        key={interest}
                                        variant={interests.includes(interest) ? 'default' : 'secondary'}
                                        onClick={() => toggleInterest(interest)}
                                        className="cursor-pointer transition-colors"
                                    >
                                        {interest}
                                    </Badge>
                                ))}
                            </div>
                            {errors.interests && <p className="text-sm text-destructive mt-1">{errors.interests.message as string}</p>}
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className='text-center'>
                    <h2 className="text-2xl font-headline font-bold">Lifestyle & Details</h2>
                    <p className="text-muted-foreground">Share a little more about your lifestyle.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="relationshipGoal">I'm looking for...</Label>
                        <Controller
                            name="relationshipGoal"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="relationshipGoal">
                                        <SelectValue placeholder="Select your goal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lifestyleOptions.relationshipGoal.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.relationshipGoal && <p className="text-sm text-destructive mt-1">{errors.relationshipGoal.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="height">Height</Label>
                        <Controller name="height" control={control} render={({ field }) => <Input id="height" placeholder="e.g., 5' 10''" {...field} />} />
                        {errors.height && <p className="text-sm text-destructive mt-1">{errors.height.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="exercise">Exercise</Label>
                        <Controller
                            name="exercise"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="exercise">
                                        <SelectValue placeholder="How often do you exercise?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lifestyleOptions.exercise.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.exercise && <p className="text-sm text-destructive mt-1">{errors.exercise.message}</p>}
                    </div>
                     <div>
                        <Label htmlFor="drinking">Drinking</Label>
                        <Controller
                            name="drinking"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="drinking">
                                        <SelectValue placeholder="Do you drink?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lifestyleOptions.drinking.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.drinking && <p className="text-sm text-destructive mt-1">{errors.drinking.message}</p>}
                    </div>
                     <div className='sm:col-span-2'>
                        <Label htmlFor="smoking">Smoking</Label>
                        <Controller
                            name="smoking"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger id="smoking">
                                        <SelectValue placeholder="Do you smoke?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {lifestyleOptions.smoking.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.smoking && <p className="text-sm text-destructive mt-1">{errors.smoking.message}</p>}
                    </div>
                </div>
              </div>
            )}

             {currentStep === 5 && (
                <div className="space-y-8">
                    <div className='text-center'>
                        <h2 className="text-2xl font-headline font-bold">Who are you looking for?</h2>
                        <p className="text-muted-foreground">Set your match preferences (you can change these later)</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <Label className="mb-2 block">Show me</Label>
                            <Controller
                                name="interestedIn"
                                control={control}
                                render={({ field }) => (
                                    <GenderSelector value={field.value} onChange={field.onChange} options={[{value: 'men', label: "Men"}, {value: 'women', label: "Women"}, {value: 'everyone', label: "Everyone"}]} />
                                )}
                            />
                        </div>
                        <div>
                            <Label className="mb-2 block">Age Range</Label>
                            <p className="text-sm text-muted-foreground">{ageRange[0]} - {ageRange[1]} years old</p>
                             <Controller
                                name="ageRange"
                                control={control}
                                render={({ field }) => (
                                    <Slider
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        min={18}
                                        max={65}
                                        step={1}
                                        className="mt-2"
                                    />
                                )}
                            />
                        </div>
                         <div>
                            <Label className="mb-2 block">Maximum Distance</Label>
                            <p className="text-sm text-muted-foreground">Within {maxDistance} km</p>
                            <Controller
                                name="maxDistance"
                                control={control}
                                render={({ field }) => (
                                     <Slider
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        min={10}
                                        max={100}
                                        step={5}
                                        className="mt-2"
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
             )}

            {currentStep === 6 && (
              <div className="space-y-6 text-center flex flex-col items-center justify-center h-[500px]">
                 <motion.div initial={{scale: 0}} animate={{scale: 1}} transition={{delay: 0.2, type: 'spring'}}>
                    <div className="relative inline-block">
                        <Check className="w-24 h-24 text-green-500 bg-green-100 rounded-full p-4"/>
                        {Array.from({length: 10}).map((_, i) => (
                           <motion.div
                             key={i}
                             initial={{ opacity: 0, scale: 0.5 }}
                             animate={{ opacity: [0, 1, 0], scale: 1 }}
                             transition={{ duration: 1.5, delay: 0.5 + i * 0.1, repeat: Infinity, repeatDelay: 2 }}
                             className="absolute top-0 left-0 w-full h-full"
                             style={{
                                transform: `rotate(${i * 36}deg) translateY(-80px) scale(0.5)`,
                                background: `hsl(${i * 36}, 100%, 70%)`,
                                borderRadius: '50%',
                                width: '10px',
                                height: '10px'
                             }}
                           />
                        ))}
                    </div>
                 </motion.div>
                 <h2 className="text-3xl font-headline font-bold mt-8">You're all set, {getValues('fullName').split(' ')[0]}!</h2>
                 <p className="text-muted-foreground max-w-md mx-auto">Welcome to LinkUp9ja! Get ready to start connecting with amazing people.</p>
                 <Button onClick={() => navigateTo('/tutorial')} disabled={isSubmitting} size="lg" className="w-full bg-primary-gradient text-primary-foreground font-bold text-lg py-6 transition-transform duration-300 hover:scale-105">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Take a Quick Tour
                 </Button>
                  <Button onClick={() => navigateTo('/discover')} disabled={isSubmitting} size="lg" variant="ghost" className="w-full font-bold transition-transform duration-300 hover:scale-105">
                    Start Swiping 🔥
                  </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {currentStep < steps.length - 2 && (
          <div className="flex justify-end pt-4">
            <Button onClick={handleNext} disabled={!isValid || isGettingLocation} size="lg" className="w-full bg-primary-gradient text-primary-foreground font-semibold">
              {currentStep === 1 && !coordinates ? 'Enable Location & Continue' : 'Next Step →'}
            </Button>
          </div>
        )}
        {currentStep === steps.length - 2 && (
             <div className="flex justify-end pt-4">
                <Button onClick={handleNext} disabled={!isValid || isSubmitting} size="lg" className="w-full bg-primary-gradient text-primary-foreground font-semibold">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete Profile
                </Button>
            </div>
        )}
      </div>
    </FormProvider>
  );
}

    
