
import React from 'react';
import type { Space } from '../types';
import { UsersIcon, CurrencyDollarIcon, MapPinIcon } from './icons';

interface SpaceCardProps {
  space: Space;
  onSelect: (space: Space) => void;
  isSelected: boolean;
}

const SpaceCard: React.FC<SpaceCardProps> = ({ space, onSelect, isSelected }) => {
  return (
    <div
      onClick={() => onSelect(space)}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected ? 'bg-primary-100 shadow-md' : 'hover:bg-gray-100'
      }`}
    >
      <img src={space.imageUrl} alt={space.name} className="w-24 h-24 sm:w-32 sm:h-24 object-cover rounded-md" />
      <div className="ml-4 flex-grow">
        <h3 className="font-bold text-gray-800 text-lg">{space.name}</h3>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          <MapPinIcon className="w-4 h-4 mr-1.5" />
          {space.location}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
          <div className="flex items-center">
            <UsersIcon className="w-4 h-4 mr-1.5 text-gray-500" />
            <span>{space.capacity} Guests</span>
          </div>
          <div className="flex items-center font-semibold">
            <CurrencyDollarIcon className="w-4 h-4 mr-1 text-gray-500" />
            <span>{space.pricePerDay} / day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceCard;
   