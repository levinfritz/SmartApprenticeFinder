'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  label: string;
}

const StarRating: React.FC<StarRatingProps> = ({ value, onChange, max = 5, label }) => {
  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-medium">{label}</span>
        <span className="text-white/60 text-sm">{value}/{max}</span>
      </div>
      
      <div className="flex gap-2">
        {[...Array(max)].map((_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= value;
          
          return (
            <motion.button
              key={index}
              type="button"
              onClick={() => onChange(starValue)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`transition-all duration-200 ${
                isActive 
                  ? 'text-yellow-400 drop-shadow-sm' 
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              <Star 
                className={`w-8 h-8 ${isActive ? 'fill-current' : ''}`}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default StarRating;