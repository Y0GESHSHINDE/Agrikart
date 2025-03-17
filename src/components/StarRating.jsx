import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div 
      className="group flex items-center" 
      role="group" 
      aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
    >
      {[...Array(fullStars)].map((_, i) => (
        <Star 
          key={`full-${i}`} 
          className="h-4 w-4 fill-yellow-400 text-yellow-400 transition-transform group-hover:scale-110" 
          aria-hidden="true" 
        />
      ))}
      {hasHalfStar && (
        <div className="relative">
          <Star 
            className="h-4 w-4 text-yellow-400 transition-transform group-hover:scale-110" 
            aria-hidden="true" 
          />
          <div className="absolute left-0 top-0 w-1/2 overflow-hidden">
            <Star 
              className="h-4 w-4 fill-yellow-400 text-yellow-400" 
              aria-hidden="true" 
            />
          </div>
        </div>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Star 
          key={`empty-${i}`} 
          className="h-4 w-4 text-yellow-400 transition-transform group-hover:scale-110" 
          aria-hidden="true" 
        />
      ))}
      <span 
        className="ml-1 text-sm text-gray-600 transition-opacity group-hover:opacity-100" 
        aria-hidden="true"
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

export default StarRating;