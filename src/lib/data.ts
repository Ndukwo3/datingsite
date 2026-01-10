import type { User, Match, Message, Conversation } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Aisha', age: 28, bio: 'Lover of art, travel, and good food. Looking for someone to explore Lagos with.', location: 'Lagos, Nigeria', interests: ['Art', 'Travel', 'Foodie', 'Music', 'Dancing'], photos: ['user-1', 'user-5'], isVerified: true },
  { id: 'user-2', name: 'Bolu', age: 32, bio: 'Software engineer by day, musician by night. Let\'s talk tech, afrobeats, and everything in between.', location: 'Abuja, Nigeria', interests: ['Tech', 'Music', 'Movies', 'Gaming'], photos: ['user-2', 'user-6'], isVerified: true },
  { id: 'user-3', name: 'Chioma', age: 25, bio: 'Fashion designer with a passion for sustainability. My perfect date is a walk in the park or visiting a gallery.', location: 'Port Harcourt, Nigeria', interests: ['Fashion', 'Nature', 'Art', 'Yoga'], photos: ['user-3', 'user-7'], isVerified: false },
  { id: 'user-4', name: 'Deji', age: 30, bio: 'Fitness enthusiast and entrepreneur. If you can keep up with me at the gym, you might be the one.', location: 'Ibadan, Nigeria', interests: ['Fitness', 'Business', 'Reading', 'Hiking'], photos: ['user-4', 'user-8'], isVerified: true },
  { id: 'user-5', name: 'Efe', age: 29, bio: 'Just a girl who loves to laugh and make others smile. I enjoy comedy shows, cooking, and spontaneous adventures.', location: 'Benin City, Nigeria', interests: ['Comedy', 'Cooking', 'Adventure'], photos: ['user-5', 'user-9'], isVerified: true },
  { id: 'user-6', name: 'Femi', age: 35, bio: 'Architect who appreciates good design, deep conversations, and a great cup of coffee.', location: 'Lagos, Nigeria', interests: ['Architecture', 'Coffee', 'Philosophy', 'Jazz'], photos: ['user-6', 'user-10'], isVerified: false },
  { id: 'user-7', name: 'Gbemi', age: 27, bio: 'Writer and bookworm. Let\'s trade book recommendations and find a cozy cafe to chat in.', location: 'Abuja, Nigeria', interests: ['Writing', 'Reading', 'Coffee', 'Cats'], photos: ['user-7', 'user-11'], isVerified: true },
  { id: 'user-8', name: 'Hassan', age: 31, bio: 'Doctor with a big heart. I unwind by hiking, playing football, and volunteering.', location: 'Kano, Nigeria', interests: ['Hiking', 'Football', 'Volunteering', 'Movies'], photos: ['user-8', 'user-12'], isVerified: true },
  { id: 'user-9', name: 'Ify', age: 26, bio: 'Loves the beach, sunsets, and Nollywood classics. Looking for a genuine connection.', location: 'Lagos, Nigeria', interests: ['Beach', 'Movies', 'Dancing'], photos: ['user-9', 'user-1'], isVerified: false },
  { id: 'user-10', name: 'Jide', age: 33, bio: 'Investment banker who works hard and plays harder. Seeking an ambitious and fun-loving partner.', location: 'Lagos, Nigeria', interests: ['Finance', 'Travel', 'Fine Dining', 'Sailing'], photos: ['user-10', 'user-2'], isVerified: true },
  { id: 'user-11', name: 'Kemi', age: 29, bio: 'Artist who finds beauty in everything. Let\'s create something beautiful together.', location: 'Lagos, Nigeria', interests: ['Art', 'Photography', 'Museums', 'Indie Music'], photos: ['user-11', 'user-3'], isVerified: true },
  { id: 'user-12', name: 'Lanre', age: 28, bio: 'Guitarist in a local band. I love live music, spicy food, and road trips.', location: 'Ibadan, Nigeria', interests: ['Music', 'Guitar', 'Foodie', 'Travel'], photos: ['user-12', 'user-4'], isVerified: true },
];

export const currentUser: User = users[0];

export const potentialMatches: User[] = users.slice(1);

export const matches: Match[] = [
  { id: 'match-1', userId: 'user-1', matchedUserId: 'user-2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: 'match-2', userId: 'user-1', matchedUserId: 'user-4', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: 'match-3', userId: 'user-1', matchedUserId: 'user-10', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72) },
];

export const messages: { [key: string]: Message[] } = {
  'user-2': [
    { id: 'msg-1-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hey Aisha! Love your profile. That gallery you visited looks amazing.', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 'msg-1-2', senderId: 'user-1', receiverId: 'user-2', text: 'Thanks Bolu! It was great. Your music setup looks professional!', timestamp: new Date(Date.now() - 1000 * 60 * 25) },
    { id: 'msg-1-3', senderId: 'user-2', receiverId: 'user-1', text: 'Haha, thanks! Maybe I can play for you sometime?', timestamp: new Date(Date.now() - 1000 * 60 * 20) },
    { id: 'msg-1-4', senderId: 'user-1', receiverId: 'user-2', text: 'I\'d love that! What kind of music do you play?', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
  ],
  'user-4': [
    { id: 'msg-2-1', senderId: 'user-4', receiverId: 'user-1', text: 'Hi, read your bio. Where in Lagos do you recommend for good food?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
    { id: 'msg-2-2', senderId: 'user-1', receiverId: 'user-4', text: 'Hey! So many places. Depends on what you like. For local, I love Nkoyo.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
  ],
  'user-10': [
    { id: 'msg-3-1', senderId: 'user-10', receiverId: 'user-1', text: 'Aisha, impressive travel photos. Where to next?', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  ],
};

export const conversations: Conversation[] = matches.map(match => {
  const participant = users.find(u => u.id === match.matchedUserId)!;
  const conversationMessages = messages[participant.id] || [];
  const lastMessage = conversationMessages.length > 0 ? conversationMessages[conversationMessages.length - 1] : {
    id: 'start',
    senderId: '',
    receiverId: '',
    text: `You matched with ${participant.name}`,
    timestamp: match.timestamp
  };
  return {
    id: participant.id,
    participant,
    lastMessage,
  };
}).sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());
