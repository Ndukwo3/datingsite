import type { User, Match, Message, Conversation } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Aisha', age: 28, bio: 'Lover of art, travel, and good food. Looking for someone to explore Lagos with.', location: 'Lagos, Nigeria', interests: ['Art', 'Travel', 'Foodie', 'Music', 'Dancing'], photos: ['user-1', 'user-5'], isVerified: true, lastSeen: 'online' },
  { id: 'user-2', name: 'Bolu', age: 32, bio: 'Software engineer by day, musician by night. Let\'s talk tech, afrobeats, and everything in between.', location: 'Abuja, Nigeria', interests: ['Tech', 'Music', 'Movies', 'Gaming'], photos: ['user-2', 'user-6'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 3) },
  { id: 'user-3', name: 'Chioma', age: 25, bio: 'Fashion designer with a passion for sustainability. My perfect date is a walk in the park or visiting a gallery.', location: 'Port Harcourt, Nigeria', interests: ['Fashion', 'Nature', 'Art', 'Yoga'], photos: ['user-3', 'user-7'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 8) },
  { id: 'user-4', name: 'Deji', age: 30, bio: 'Fitness enthusiast and entrepreneur. If you can keep up with me at the gym, you might be the one.', location: 'Ibadan, Nigeria', interests: ['Fitness', 'Business', 'Reading', 'Hiking'], photos: ['user-4', 'user-8'], isVerified: true, lastSeen: 'online' },
  { id: 'user-5', name: 'Efe', age: 29, bio: 'Just a girl who loves to laugh and make others smile. I enjoy comedy shows, cooking, and spontaneous adventures.', location: 'Benin City, Nigeria', interests: ['Comedy', 'Cooking', 'Adventure'], photos: ['user-5', 'user-9'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 'user-6', name: 'Femi', age: 35, bio: 'Architect who appreciates good design, deep conversations, and a great cup of coffee.', location: 'Lagos, Nigeria', interests: ['Architecture', 'Coffee', 'Philosophy', 'Jazz'], photos: ['user-6', 'user-10'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 20) },
  { id: 'user-7', name: 'Gbemi', age: 27, bio: 'Writer and bookworm. Let\'s trade book recommendations and find a cozy cafe to chat in.', location: 'Abuja, Nigeria', interests: ['Writing', 'Reading', 'Coffee', 'Cats'], photos: ['user-7', 'user-11'], isVerified: true, lastSeen: 'online' },
  { id: 'user-8', name: 'Hassan', age: 31, bio: 'Doctor with a big heart. I unwind by hiking, playing football, and volunteering.', location: 'Kano, Nigeria', interests: ['Hiking', 'Football', 'Volunteering', 'Movies'], photos: ['user-8', 'user-12'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 12) },
  { id: 'user-9', name: 'Ify', age: 26, bio: 'Loves the beach, sunsets, and Nollywood classics. Looking for a genuine connection.', location: 'Lagos, Nigeria', interests: ['Beach', 'Movies', 'Dancing'], photos: ['user-9', 'user-1'], isVerified: false, lastSeen: 'online' },
  { id: 'user-10', name: 'Jide', age: 33, bio: 'Investment banker who works hard and plays harder. Seeking an ambitious and fun-loving partner.', location: 'Lagos, Nigeria', interests: ['Finance', 'Travel', 'Fine Dining', 'Sailing'], photos: ['user-10', 'user-2'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 2) },
  { id: 'user-11', name: 'Kemi', age: 29, bio: 'Artist who finds beauty in everything. Let\'s create something beautiful together.', location: 'Lagos, Nigeria', interests: ['Art', 'Photography', 'Museums', 'Indie Music'], photos: ['user-11', 'user-3'], isVerified: true, lastSeen: 'online' },
  { id: 'user-12', name: 'Lanre', age: 28, bio: 'Guitarist in a local band. I love live music, spicy food, and road trips.', location: 'Ibadan, Nigeria', interests: ['Music', 'Guitar', 'Foodie', 'Travel'], photos: ['user-12', 'user-4'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 7) },
  { id: 'user-13', name: 'Muna', age: 24, bio: 'Veterinarian student. My dog is my world. Animal lovers to the front!', location: 'Enugu, Nigeria', interests: ['Animals', 'Nature', 'Movies', 'Volunteering'], photos: ['user-13'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 'user-14', name: 'Ngozi', age: 30, bio: 'Chef and culinary artist. I express my love through food. Let me cook for you.', location: 'Lagos, Nigeria', interests: ['Cooking', 'Foodie', 'Travel', 'Wine'], photos: ['user-14'], isVerified: true, lastSeen: 'online' },
  { id: 'user-15', name: 'Obi', age: 34, bio: 'History teacher who loves a good debate. Tell me something I don\'t know.', location: 'Onitsha, Nigeria', interests: ['History', 'Politics', 'Reading', 'Chess'], photos: ['user-15'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 25) },
  { id: 'user-16', name: 'Patience', age: 26, bio: 'Dancer and choreographer. My life has a soundtrack, and I\'m always moving to the beat.', location: 'Abuja, Nigeria', interests: ['Dancing', 'Music', 'Afrobeats', 'Concerts'], photos: ['user-16'], isVerified: false, lastSeen: 'online' },
  { id: 'user-17', name: 'Rotimi', age: 29, bio: 'Photographer constantly chasing the perfect shot. Spontaneous trips are my specialty.', location: 'Calabar, Nigeria', interests: ['Photography', 'Travel', 'Adventure', 'Nature'], photos: ['user-17'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 4) },
  { id: 'user-18', name: 'Simi', age: 27, bio: 'Marketing exec with a love for brunch, fashion, and weekend getaways. Let\'s make some memories.', location: 'Lagos, Nigeria', interests: ['Fashion', 'Brunch', 'Travel', 'Social Media'], photos: ['user-18'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 9) },
  { id: 'user-19', name: 'Tunde', age: 31, bio: 'Entrepreneur with a passion for building things. Let\'s build a connection.', location: 'Abeokuta, Nigeria', interests: ['Business', 'Tech', 'Investing', 'Golf'], photos: ['user-19'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 11) },
  { id: 'user-20', name: 'Uche', age: 28, bio: 'A globetrotter who loves exploring new cultures. My next stop could be with you.', location: 'Owerri, Nigeria', interests: ['Travel', 'Culture', 'Languages', 'Photography'], photos: ['user-20'], isVerified: false, lastSeen: 'online' },
  { id: 'user-21', name: 'Victor', age: 29, bio: 'Film director and storyteller. I see the world in scenes and shots. What\'s your story?', location: 'Lagos, Nigeria', interests: ['Filmmaking', 'Storytelling', 'Art', 'Nollywood'], photos: ['user-21'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 6) },
  { id: 'user-22', name: 'Wunmi', age: 26, bio: 'Lover of all things natural. From hair to food. Let\'s keep it real.', location: 'Ilorin, Nigeria', interests: ['Natural Hair', 'Healthy Eating', 'Yoga', 'Reading'], photos: ['user-22'], isVerified: true, lastSeen: 'online' },
  { id: 'user-23', name: 'Yemi', age: 33, bio: 'Civil engineer creating landmarks. Looking for someone to build a future with.', location: 'Kaduna, Nigeria', interests: ['Engineering', 'Reading', 'Football', 'Documentaries'], photos: ['user-23'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 18) },
  { id: 'user-24', name: 'Zainab', age: 27, bio: 'Poet and spoken word artist. I have a way with words. Let\'s write our own story.', location: 'Jos, Nigeria', interests: ['Poetry', 'Spoken Word', 'Music', 'Nature'], photos: ['user-24'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 22) },
  { id: 'user-25', name: 'Ade', age: 30, bio: 'Marine biologist fascinated by the ocean. Seeking a partner for life\'s great adventures.', location: 'Lagos, Nigeria', interests: ['Marine Biology', 'Diving', 'Conservation', 'Travel'], photos: ['user-25'], isVerified: true, lastSeen: 'online' },
  { id: 'user-26', name: 'Blessing', age: 29, bio: 'Human rights lawyer fighting for justice. Passionate about making a difference.', location: 'Abuja, Nigeria', interests: ['Law', 'Activism', 'Politics', 'Reading'], photos: ['user-26'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 14) },
  { id: 'user-27', name: 'Chike', age: 32, bio: 'Musician and producer. I live and breathe music. Let\'s find our rhythm together.', location: 'Enugu, Nigeria', interests: ['Music Production', 'Songwriting', 'Afrobeats', 'Live Gigs'], photos: ['user-27'], isVerified: true, lastSeen: 'online' },
  { id: 'user-28', name: 'Dami', age: 25, bio: 'Graphic designer with a flair for vibrant colors. Life is my canvas.', location: 'Lagos, Nigeria', interests: ['Graphic Design', 'Art', 'Fashion', 'Festivals'], photos: ['user-28'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 1) },
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

export const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", 
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", 
  "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", 
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", 
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];
