export interface Testimonial {
  id: number;
  name: string;
  location: string;
  quote: string;
  rating: number;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sophia Rodriguez",
    location: "New York, NY",
    quote: "I've tried mangoes from all over the world, but nothing compares to the Alphonso mangoes from MangoLuxury. The flavor is extraordinary, and the presentation makes it feel like a true luxury experience.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    name: "Michael Chang",
    location: "San Francisco, CA",
    quote: "The Limited Drop Honey Gold mangoes were worth every penny. The packaging was exquisite, and the mangoes arrived perfectly ripened. It was the highlight of our family dinner.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    name: "Emma Johnson",
    location: "Chicago, IL",
    quote: "As a chef, I'm extremely particular about my ingredients. These mangoes have elevated my desserts to a whole new level. The consistency in quality is remarkable.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 4,
    name: "David Williams",
    location: "Austin, TX",
    quote: "I ordered the premium selection as a gift for my wife who grew up eating mangoes in India. She was speechless at the quality and said they tasted just like the ones from her childhood.",
    rating: 4,
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 5,
    name: "Priya Patel",
    location: "Miami, FL",
    quote: "The subscription service is fantastic. Having these premium mangoes delivered monthly has been a wonderful treat. The quality has been consistent with every delivery.",
    rating: 5,
    avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];