export interface EventLocation {
  id: string;
  name: string;
  subCounty: string;
  county: 'Nairobi' | 'Nyeri' | 'Kiambu' | 'Nakuru' | 'Mombasa';
  idealFor: ('Weddings' | 'Corporate' | 'Concerts' | 'Photo Shoots' | 'Chama Meetings')[];
  terrain: 'Manicured Gardens' | 'Indoor Hall' | 'Rooftop' | 'Lakeside' | 'Forest';
}

export type Amenity = 
  | 'In-house catering' 
  | 'Ample parking' 
  | 'Backup Generator/Inverter' 
  | 'Chama-friendly pricing' 
  | string;

export interface Venue {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  eventLocation: EventLocation;
  pricePerDay: number; // KES
  capacity: number;
  isLocyfyVerified: boolean;
  mlRecommendationScore?: number; // Represented as a percentage (0-100)
  amenities: Amenity[];
}

export interface VenueCardProps {
  venue: Venue;
  onClick?: (venueId: string) => void;
}
