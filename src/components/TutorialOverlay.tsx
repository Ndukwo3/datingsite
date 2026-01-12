
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ProfileCard } from "./ProfileCard";
import { potentialMatches, users } from "@/lib/data";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { isValidHttpUrl } from "@/lib/is-valid-url";


const tutorialSlides = [
  {
    icon: <Heart className="w-8 h-8 text-primary" />,
    title: "Swipe Right to Like",
    description: "If you're interested in someone, swipe their card to the right.",
    animation: {
      action: "right",
      icon: <Heart className="w-16 h-16 text-green-400 fill-green-400" />,
    }
  },
  {
    icon: <X className="w-8 h-8 text-red-500" />,
    title: "Swipe Left to Pass",
    description: "Not interested? Swipe left to see the next profile.",
    animation: {
      action: "left",
      icon: <X className="w-16 h-16 text-red-500" />,
    }
  },
  {
    icon: <Star className="w-8 h-8 text-blue-500" />,
    title: "Super Like Someone Special",
    description: "Really like someone? Swipe up to send a Super Like and stand out.",
    note: "You get 1 free Super Like per day",
    animation: {
        action: "up",
        icon: <Star className="w-16 h-16 text-blue-500 fill-blue-500" />,
    }
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: "Match & Start Chatting",
    description: "When someone likes you back, it's a match! You can now send messages and get to know each other.",
    note: "Only mutual matches can message",
    animation: {
        action: "match",
    }
  },
];


export function TutorialOverlay() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const router = useRouter();
  
  const currentUserImage = PlaceHolderImages.find(p => p.id === 'tutorial-match-1')?.imageUrl;
  const chiomaUserImage = PlaceHolderImages.find(p => p.id === 'tutorial-match-2')?.imageUrl;


  const handleNext = () => {
    setDirection(1);
    if (currentSlide < tutorialSlides.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrev = () => {
    setDirection(-1);
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleFinish = () => {
    router.push('/feed');
  };

  const slideVariants = {
    hidden: (direction: number) => ({ opacity: 0, x: direction > 0 ? "50%" : "-50%" }),
    visible: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? "-50%" : "50%" }),
  };
  
  const currentAnimation = tutorialSlides[currentSlide]?.animation;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto text-white p-4 h-full flex flex-col">
        <div className="flex justify-end">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white" asChild>
                <Link href="/discover">Skip Tutorial</Link>
            </Button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center">
            {/* Visual Element */}
            <div className="relative w-64 h-[22rem] mb-12">
                 <AnimatePresence>
                     {currentAnimation && currentAnimation.action !== 'match' && (
                       <motion.div
                         key={currentSlide}
                         className="absolute inset-0"
                         initial={{ scale: 0.8 }}
                         animate={{ scale: 1, rotate: currentAnimation.action === 'right' ? 10 : currentAnimation.action === 'left' ? -10 : 0, x: currentAnimation.action === 'right' ? '120%' : currentAnimation.action === 'left' ? '-120%' : 0, y: currentAnimation.action === 'up' ? '-120%' : 0, opacity: 0}}
                         transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                       >
                         <ProfileCard user={potentialMatches[currentSlide]} />
                          <motion.div 
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{opacity: 0, scale: 0.5}}
                            animate={{opacity: 1, scale: 1}}
                            transition={{delay: 0.5, duration: 0.3, repeat: Infinity, repeatDelay: 1.2}}>
                            {currentAnimation.icon}
                          </motion.div>
                       </motion.div>
                     )}
                 </AnimatePresence>
                 {currentAnimation && currentAnimation.action === 'match' && (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <motion.div initial={{opacity: 0, scale: 0.5}} animate={{opacity:1, scale:1, transition: {delay: 1.5}}} className="absolute text-center z-10">
                            <h2 className="text-4xl font-headline font-bold bg-primary-gradient text-transparent bg-clip-text">It's a Match!</h2>
                            <p>You and Chioma liked each other.</p>
                        </motion.div>

                        <motion.div className="absolute" initial={{x: -100, rotate: -15}} animate={{x: -40, rotate: -10}} transition={{duration: 1}}>
                           {currentUserImage && isValidHttpUrl(currentUserImage) && <Image src={currentUserImage} alt="user 1" width={180} height={240} className="rounded-2xl object-cover shadow-lg"/>}
                           <Heart className="w-10 h-10 text-primary fill-primary absolute -bottom-5 -right-5"/>
                        </motion.div>
                        <motion.div className="absolute" initial={{x: 100, rotate: 15}} animate={{x: 40, rotate: 10}} transition={{duration: 1}}>
                            {chiomaUserImage && isValidHttpUrl(chiomaUserImage) && <Image src={chiomaUserImage} alt="user 2" width={180} height={240} className="rounded-2xl object-cover shadow-lg"/>}
                            <Heart className="w-10 h-10 text-primary fill-primary absolute -bottom-5 -left-5"/>
                        </motion.div>
                    </div>
                 )}
                 {currentAnimation && currentAnimation.action !== 'match' && <ProfileCard user={potentialMatches[currentSlide]} />}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={currentSlide}
                    custom={direction}
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="max-w-md"
                >
                    {tutorialSlides[currentSlide] && (
                        <>
                            <h2 className="text-2xl font-headline font-bold mb-2 flex items-center justify-center gap-3">
                                <span>{tutorialSlides[currentSlide].title}</span>
                                {tutorialSlides[currentSlide].icon}
                            </h2>
                            <p className="text-base text-white/80">{tutorialSlides[currentSlide].description}</p>
                            {tutorialSlides[currentSlide].note && <p className="text-sm text-white/60 mt-2">{tutorialSlides[currentSlide].note}</p>}
                        </>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center gap-4 pb-8">
            <div className="flex gap-2">
                {tutorialSlides.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={cn(
                        "h-2 rounded-full transition-all",
                        i === currentSlide ? "w-6 bg-primary" : "w-2 bg-white/50"
                    )} />
                ))}
            </div>
            
             <p className="text-sm text-white/70">{currentSlide + 1} of {tutorialSlides.length}</p>

            <div className="flex justify-between w-full max-w-xs items-center">
                 {currentSlide > 0 ? (
                    <Button variant="ghost" onClick={handlePrev} className="text-white hover:text-white">
                        &larr; Back
                    </Button>
                ) : <div className="w-20"/>}

                {currentSlide < tutorialSlides.length - 1 ? (
                    <Button onClick={handleNext} className="bg-primary-gradient rounded-full px-8">
                        Next &rarr;
                    </Button>
                ) : (
                    <Button onClick={handleFinish} className="bg-primary-gradient rounded-full px-8">
                        Start Discovering 🔥
                    </Button>
                )}
                 {currentSlide < tutorialSlides.length - 1 ? (
                    <div className="w-20"/>
                 ) : (
                    currentSlide === tutorialSlides.length && <div className="w-20" />
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}
