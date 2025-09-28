'use client';
import { Button } from '@/components/ui/button';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@clerk/nextjs';
import { ArrowDown, Globe2, Plane, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

import React from 'react';

export const suggestions = [
  {
    title: 'Create New Trip',
    icon: <Globe2 className="text-blue-400 h-5 w-5" />,
  },
  {
    title: 'Inspire me where to go',
    icon: <Plane className="text-green-500 h-5 w-5" />,
  },
  {
    title: 'Discover Hidden gems',
    icon: <Globe2 className="text-orange-500 h-5 w-5" />,
  },
  {
    title: 'Adventure Destination',
    icon: <Globe2 className="text-yellow-500 h-5 w-5" />,
  },
];

function Hero() {
  const { user } = useUser();
  const router = useRouter();

  const onSend = () => {
    if (!user) {
      router.push('/sign-in');
      return;
    }
    // Navigate to create Trip planner web page
    router.push('/create-new-trip');
  };

  return (
    <div className="mt-24 w-full flex items-center justify-center">
      {/* Content */}
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-xl md:text-5xl font-bold">
          Hey, I'm your personal{' '}
          <span className="text-primary">Trip Planner</span>
        </h1>
        <p className="text-lg">
          Tell me what you want, and I'll handle the rest: Flights, Hotels, trip
          planer - all in seconds...
        </p>

        {/* Input Box */}
        <div>
          <div className="border rounded-2xl p-4 shadow relative">
            <Textarea
              placeholder="Create a trip for Paris from Sweden"
              className="w-full h-25 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none"
            />
            <Button
              size={'icon'}
              className="absolute bottom-4 right-4"
              onClick={() => onSend()}
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Suggestion list */}
        <div className="flex gap-5 items-center">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-full p-2 cursor-pointer hover:bg-primary hover:text-white"
            >
              {suggestion.icon}
              <h2 className="text-sm">{suggestion.title}</h2>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center">
          <h2 className="my-7 mt-14 gap-2 text-center flex">
            Not sure where to start? <strong>See how it works</strong>{' '}
            <ArrowDown />
          </h2>

          {/* Video Section */}
          <HeroVideoDialog
            className="block dark:hidden mb-10"
            animationStyle="from-center"
            videoSrc="https://youtu.be/sXRDL-EPtrM?si=dN88tnI_ieVscXmC"
            thumbnailSrc="https://mma.prnewswire.com/media/2401528/1_MindtripProduct.jpg.?p=facebook"
            thumbnailAlt="Dummy Video Thumbnail"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
