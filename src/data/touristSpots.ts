export interface TouristSpot {
  id: string;
  position: [number, number];
  name: string;
  image: string;
  description: string;
  rarity: 'common' | 'rare' | 'legendary';
  category: string;
}

export const touristSpots: TouristSpot[] = [
  {
    id: 'bannerghatta',
    position: [12.8438, 77.6606],
    name: 'Bannerghatta National Park',
    image: 'https://i.pinimg.com/736x/dd/f5/0d/ddf50d344952d5cba166eb4ace41bac6.jpg',
    description: 'Home to majestic Bengal tigers roaming freely in lush green forests with their families',
    rarity: 'legendary',
    category: 'Wildlife'
  },
  {
    id: 'lalbagh',
    position: [12.9507, 77.5848],
    name: 'Lalbagh Botanical Garden',
    image: 'https://media1.thrillophilia.com/filestore/63znh36mzyxi2gmmbn4c38mekupu_1562854402_lal_bagh.jpg',
    description: 'A 240-acre botanical paradise with over 1,800 species of plants and the iconic Glass House',
    rarity: 'rare',
    category: 'Nature'
  },
  {
    id: 'vidhana-soudha',
    position: [12.9791, 77.5913],
    name: 'Vidhana Soudha',
    image: 'https://images.yourstory.com/cs/wordpress/2016/07/Yourstory-Vidhana-Soudha.jpg?mode=crop&crop=faces&ar=16%3A9&format=auto&w=1920&q=75',
    description: 'Magnificent neo-Dravidian architecture housing the Karnataka Legislature',
    rarity: 'legendary',
    category: 'Heritage'
  },
  {
    id: 'iskcon',
    position: [13.0097, 77.5505],
    name: 'ISKCON Temple',
    image: 'https://www.trawell.in/admin/images/upload/148027305ISKCONTemple_Main.jpg',
    description: 'Stunning spiritual sanctuary with intricate carvings and peaceful ambiance',
    rarity: 'rare',
    category: 'Spiritual'
  },
  {
    id: 'cubbon-park',
    position: [12.9762, 77.5929],
    name: 'Cubbon Park',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQhUFxGWQmMCYh1mIrGNOO9cY1xsgNQ_erLA&s',
    description: '300-acre green oasis in the heart of the city with Victorian-era architecture',
    rarity: 'common',
    category: 'Nature'
  },
  {
    id: 'bangalore-palace',
    position: [12.9986, 77.5921],
    name: 'Bangalore Palace',
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/01/e4/9c/more-far.jpg?w=900&h=500&s=1',
    description: 'Tudor-style palace with elegant wood carvings and beautiful fortified towers',
    rarity: 'legendary',
    category: 'Heritage'
  },
  {
    id: 'tipu-palace',
    position: [12.9591, 77.5742],
    name: 'Tipu Sultan Palace',
    image: 'https://www.theleela.com/prod/content/assets/2023-08/Bangalore-Palace-.jpg?VersionId=7KUg6IYk_MYNWAtwh3y.jJqkogdduyHR',
    description: 'Historic summer palace with Indo-Islamic architecture and ornate pillars',
    rarity: 'rare',
    category: 'Heritage'
  },
  {
    id: 'ulsoor-lake',
    position: [12.9817, 77.6192],
    name: 'Ulsoor Lake',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8ObbFOmq44izu1st3PJ-COQh_jm-KmdEjPA&s',
    description: 'Serene lake perfect for boating with stunning sunset views',
    rarity: 'common',
    category: 'Nature'
  },
  {
    id: 'nandi-hills',
    position: [13.3704, 77.6838],
    name: 'Nandi Hills',
    image: 'https://solopassport.com/wp-content/uploads/2022/06/View-from-the-peak.jpeg',
    description: 'Breathtaking hilltop fortress with panoramic views and misty mornings',
    rarity: 'legendary',
    category: 'Adventure'
  },
  {
    id: 'wonderla',
    position: [12.8347, 77.4017],
    name: 'Wonderla Amusement Park',
    image: 'https://imgmediagumlet.lbb.in/media/2020/11/5fbb6667f74d5711361163fb_1606116967165.jpg',
    description: 'Thrilling rides and water slides for an exciting family adventure',
    rarity: 'rare',
    category: 'Entertainment'
  }
];

export const safeHotels = [
  {
    id: 'taj-west-end',
    name: 'Taj West End',
    position: [12.9986, 77.5921],
    rating: 5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    description: '5-star luxury heritage hotel with lush gardens',
    price: '₹15,000+',
    verified: true,
    bookingUrl: 'https://www.booking.com/hotel/in/taj-west-end.en-gb.html'
  },
  {
    id: 'itc-gardenia',
    name: 'ITC Gardenia',
    position: [12.9698, 77.6411],
    rating: 5,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    description: 'Ultra-luxury hotel with world-class amenities',
    price: '₹12,000+',
    verified: true,
    bookingUrl: 'https://www.booking.com/hotel/in/itc-royal-gardenia.en-gb.html'
  },
  {
    id: 'leela-palace',
    name: 'The Leela Palace',
    position: [12.9352, 77.6245],
    rating: 5,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    description: 'Opulent palace-style hotel with royal treatment',
    price: '₹18,000+',
    verified: true,
    bookingUrl: 'https://www.booking.com/hotel/in/the-leela-palace-bangalore.en-gb.html'
  },
  {
    id: 'oberoi',
    name: 'The Oberoi Bengaluru',
    position: [12.9716, 77.6411],
    rating: 5,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    description: 'Contemporary luxury with impeccable service',
    price: '₹14,000+',
    verified: true,
    bookingUrl: 'https://www.booking.com/hotel/in/the-oberoi-bangalore.en-gb.html'
  },
  {
    id: 'jw-marriott',
    name: 'JW Marriott Hotel',
    position: [12.9279, 77.6271],
    rating: 5,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
    description: 'Modern elegance with rooftop dining',
    price: '₹10,000+',
    verified: true,
    bookingUrl: 'https://www.booking.com/hotel/in/jw-marriott-bengaluru.en-gb.html'
  }
];

export const embassies = [
  { name: 'US Consulate', phone: '+91-80-2220-6500', address: 'Racecourse Road' },
  { name: 'UK Deputy High Commission', phone: '+91-80-2221-1200', address: 'Vittal Mallya Road' },
  { name: 'German Consulate', phone: '+91-80-2220-0100', address: 'Prestige Takt' },
  { name: 'French Consulate', phone: '+91-80-4012-4200', address: 'Shanthala Nagar' },
  { name: 'Australian Consulate', phone: '+91-80-4178-4000', address: 'Prestige Shantiniketan' },
  { name: 'Canadian Consulate', phone: '+91-80-4178-2000', address: 'Prestige Shantiniketan' }
];
