
import React from 'react';
import type { Space } from '../types';
import BookingCalendar from './BookingCalendar';
import { UsersIcon, CurrencyDollarIcon, MapPinIcon } from './icons';

interface SpaceDetailsProps {
  space: Space;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddBooking: (spaceId: string, date: Date) => void;
}

const SpaceDetails: React.FC<SpaceDetailsProps> = ({ space, onClose, onEdit, onDelete, onAddBooking }) => {
  const handleAddBooking = (date: Date) => {
    onAddBooking(space.id, date);
  };
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg relative h-full overflow-y-auto">
       <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 lg:hidden">&times;</button>
      <div className="max-w-4xl mx-auto">
        <img src={space.imageUrl} alt={space.name} className="w-full h-64 object-cover rounded-lg mb-6" />
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">{space.name}</h2>
                <p className="text-md text-gray-500 flex items-center mt-2">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    {space.location}
                </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <button onClick={onEdit} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">Edit</button>
                <button onClick={onDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Delete</button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 border-y py-6">
            <div className="flex items-center text-gray-700">
                <UsersIcon className="w-6 h-6 mr-3 text-primary-600" />
                <div>
                    <p className="font-semibold">Capacity</p>
                    <p>{space.capacity} Guests</p>
                </div>
            </div>
            <div className="flex items-center text-gray-700">
                <CurrencyDollarIcon className="w-6 h-6 mr-3 text-primary-600" />
                <div>
                    <p className="font-semibold">Price</p>
                    <p>${space.pricePerDay} / day</p>
                </div>
            </div>
        </div>
        
        <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">About this space</h3>
            <p className="text-gray-600 leading-relaxed">{space.description}</p>
        </div>

        <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
                {space.amenities.map(amenity => (
                    <span key={amenity} className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                        {amenity}
                    </span>
                ))}
            </div>
        </div>
        
        <BookingCalendar bookings={space.bookings} onAddBooking={handleAddBooking} />
      </div>
    </div>
  );
};

export default SpaceDetails;
   