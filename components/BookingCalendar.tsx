
import React, { useState } from 'react';
import type { Booking } from '../types';

interface BookingCalendarProps {
  bookings: Booking[];
  onAddBooking: (date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, onAddBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const bookedDates = new Set(
    bookings.map(b => new Date(b.date).toDateString())
  );

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const daysInMonth = endOfMonth.getDate();

  const days = Array.from({ length: startDay }, (_, i) => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1))
  );
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const handleDayClick = (day: Date | null) => {
    if (day && day >= today && !bookedDates.has(day.toDateString())) {
      onAddBooking(day);
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mt-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          &lt;
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500">
        {weekDays.map(day => <div key={day} className="font-medium">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-2">
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`}></div>;

          const isBooked = bookedDates.has(day.toDateString());
          const isPast = day < today;
          const isToday = day.toDateString() === today.toDateString();

          let dayClasses = "w-full aspect-square flex items-center justify-center rounded-full transition-colors";
          
          if (isBooked) {
            dayClasses += " bg-red-500 text-white cursor-not-allowed";
          } else if (isPast) {
            dayClasses += " text-gray-400 cursor-not-allowed";
          } else {
            dayClasses += " text-gray-700 cursor-pointer hover:bg-primary-100";
          }
          if (isToday) {
            dayClasses += " border-2 border-primary-500";
          }

          return (
            <div key={day.toISOString()} onClick={() => handleDayClick(day)} className={dayClasses}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
       <div className="flex items-center space-x-4 mt-4 text-sm">
        <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>Booked</div>
        <div className="flex items-center"><span className="w-3 h-3 rounded-full border-2 border-primary-500 mr-2"></span>Today</div>
      </div>
    </div>
  );
};

export default BookingCalendar;
   