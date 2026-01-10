
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { LandingHeader } from '@/components/LandingHeader';
import { AnimatedFeatures } from '@/components/AnimatedFeatures';
import { LandingFooter } from '@/components/LandingFooter';

export default function LandingPage() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5, // Delay text animation until after image fade-in
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <LandingHeader theme="dark" />
      <main className="flex-1">
        <motion.section 
          className="relative h-screen"
          initial="hidden"
          animate="visible"
        >
          {heroImage && (
            <motion.div
              variants={imageVariants}
              className="absolute inset-0"
            >
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                data-ai-hint={heroImage.imageHint}
              />
            </motion.div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="container mx-auto px-4 text-center text-primary-foreground"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1
                className="mb-4 font-headline text-4xl font-bold md:text-6xl"
                variants={itemVariants}
              >
                Connect with Your Perfect Match
              </motion.h1>
              <motion.p
                className="mx-auto mb-8 max-w-2xl text-lg md:text-xl"
                variants={itemVariants}
              >
                Join LinkUp9ja and discover meaningful connections with amazing people across Nigeria.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-transform duration-300 hover:scale-105">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
        <section className="bg-pink-100/50 py-16 text-center">
          <div className="container mx-auto px-4">
            <h2 className="mb-4 font-headline text-3xl font-bold">Why LinkUp9ja?</h2>
            <p className="mx-auto mb-12 max-w-3xl text-muted-foreground md:text-lg">
              We are dedicated to helping you find genuine relationships. With our advanced features and focus on safety, your journey to love starts here.
            </p>
            <AnimatedFeatures />
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}

