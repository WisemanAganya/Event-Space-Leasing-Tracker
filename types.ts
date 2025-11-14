
export interface Booking {
  id: string;
  date: Date;
}

export interface Space {
  id: string;
  name: string;
  location: string;
  capacity: number;
  amenities: string[];
  pricePerDay: number;
  description: string;
  imageUrl: string;
  bookings: Booking[];
}
   