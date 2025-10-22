import { assets } from "../assets/assets"

export const mockTours = [
  {
    id: 1,
    title: 'Ancient Temples & Cultural Heritage',
    image: assets.cultural,
    category: 'Cultural',
    price: '$65',
    location: 'Anuradhapura & Polonnaruwa',
    description: 'Explore magnificent Buddhist temples, ancient ruins, and experience traditional Sri Lankan ceremonies with a local cultural expert.',
    duration: '8 hours',
    capacity: 'Max 6',
    rating: '4.9',
    reviews: 124,
    guide: { name: 'Chaminda Perera', initials: 'CP' }
  },
  {
    id: 2,
    title: 'Wildlife Safari & National Parks',
    image: assets.nature,
    category: 'Wildlife',
    price: '$85',
    location: 'Yala & Udawalawe',
    description: 'Witness elephants, leopards, and exotic birds in their natural habitat. Visit pristine beaches and tropical rainforests.',
    duration: '10 hours',
    capacity: 'Max 4',
    rating: '5.0',
    reviews: 89,
    guide: { name: 'Ruwan Silva', initials: 'RS' }
  },
  {
    id: 3,
    title: 'Local Village Life Experience',
    image: assets.local,
    category: 'Authentic',
    price: '$45',
    location: 'Kandy Rural Areas',
    description: 'Live like a local: traditional cooking, farming, handicrafts, and authentic village hospitality with local families.',
    duration: '6 hours',
    capacity: 'Max 8',
    rating: '4.8',
    reviews: 156,
    guide: { name: 'Malini Fernando', initials: 'MF' }
  }
]

export const mockGuides = [
  {
    id: 1,
    name: 'Chaminda Perera',
    initials: 'CP',
    specialty: 'Cultural Heritage Expert',
    location: 'Colombo & Ancient Cities',
    description: 'Born and raised in Anuradhapura, I have been sharing the rich history and culture of Sri Lanka for over 8 years. My passion is bringing ancient stories to life.',
    rating: '4.9',
    ratingCount: 187,
    tours: 245,
    languages: ['English', 'Sinhala', 'German'],
    badges: ['Certified Guide', 'Heritage Expert', 'Safety Trained']
  },
  {
    id: 2,
    name: 'Malini Fernando',
    initials: 'MF',
    specialty: 'Village Life & Authentic Experiences',
    location: 'Kandy & Hill Country',
    description: 'Welcome to my village! I love showing visitors our traditional way of life, from rice farming to authentic Sri Lankan cooking passed down through generations.',
    rating: '5.0',
    ratingCount: 134,
    tours: 156,
    languages: ['English', 'Sinhala', 'Tamil'],
    badges: ['Village Expert', 'Cooking Teacher', 'Family Friendly']
  },
  {
    id: 3,
    name: 'Ruwan Silva',
    initials: 'RS',
    specialty: 'Wildlife & Nature Guide',
    location: 'Yala & Southern Province',
    description: 'As a wildlife photographer and naturalist, I know the best spots to see elephants, leopards, and exotic birds. Every safari is an adventure!',
    rating: '4.8',
    ratingCount: 203,
    tours: 298,
    languages: ['English', 'Sinhala', 'Japanese'],
    badges: ['Wildlife Expert', 'Photographer', 'Eco-Certified']
  }
]