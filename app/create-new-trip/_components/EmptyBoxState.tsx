import { suggestions } from '@/app/_components/Hero';
import React from 'react';

function EmptyBoxState({ onSelectOption }: any) {
  return (
    <div className="mt-7">
      <h2 className="font-bold text-3xl text-center">
        Start Planning new <span className="text-primary">Trip</span> using AI
      </h2>
      <p className="text-center text-gray-400 mt-2">
        Discover personalized travel itineraries, find the best destinations,
        and plan your dream vacation effortlessly with the power of AI. Let our
        smart assistant do the hard work while you enjoy the journey.
      </p>

      <div className="flex gap-5 flex-col mt-8">
        {suggestions.map((suggestion, index) => (
          <div
            onClick={() => onSelectOption(suggestion.title)}
            key={index}
            className="flex items-center gap-2 border rounded-xl p-3 cursor-pointer hover:bg-primary hover:text-white"
          >
            {suggestion.icon}
            <h2 className="text-lg">{suggestion.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmptyBoxState;
