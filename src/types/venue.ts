export interface Location {
  address: string; // Could be road or street
  county: string;  // e.g., Nairobi, Kiambu, Mombasa
  estate?: string; // e.g., Kilimani, Westlands, Nyali
  landmark?: string; // Crucial in Kenya (e.g., 'Opposite Sarit Centre')
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  location: Location;
  pricePerHour: number;
  capacity: number;
  isVerified: boolean;
  mlRecommendationScore?: number; // Represented as a percentage (0-100)
  tags?: string[];
}

export interface VenueCardProps {
  venue: Venue;
  onClick?: (venueId: string) => void;
}
