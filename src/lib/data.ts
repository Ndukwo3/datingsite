
import type { User, Match, Message, Conversation } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Aisha', age: 28, bio: 'Lover of art, travel, and good food. Looking for someone to explore Lagos with.', location: 'Lagos, Nigeria', job: 'Art Curator', education: 'University of Lagos', interests: ['Art', 'Travel', 'Foodie', 'Music', 'Dancing'], photos: ['user-1', 'user-5', 'user-9', 'user-11'], isVerified: true, lastSeen: 'online', socials: { instagram: '@aisha_art', spotify: 'aisha-jams' } },
  { id: 'user-2', name: 'Bolu', age: 32, bio: 'Software engineer by day, musician by night. Let\'s talk tech, afrobeats, and everything in between.', location: 'Abuja, Nigeria', job: 'Software Engineer', education: 'Covenant University', interests: ['Tech', 'Music', 'Movies', 'Gaming'], photos: ['user-2', 'user-6', 'user-10', 'user-12'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 3), socials: { instagram: '@bolu_codes' } },
  { id: 'user-3', name: 'Chioma', age: 25, bio: 'Fashion designer with a passion for sustainability. My perfect date is a walk in the park or visiting a gallery.', location: 'Port Harcourt, Nigeria', job: 'Fashion Designer', education: 'Yaba College of Technology', interests: ['Fashion', 'Nature', 'Art', 'Yoga'], photos: ['user-3', 'user-7', 'user-13-2', 'user-14-2'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 8) },
  { id: 'user-4', name: 'Deji', age: 30, bio: 'Fitness enthusiast and entrepreneur. If you can keep up with me at the gym, you might be the one.', location: 'Ibadan, Nigeria', job: 'Entrepreneur', education: 'University of Ibadan', interests: ['Fitness', 'Business', 'Reading', 'Hiking'], photos: ['user-4', 'user-8', 'user-15-2', 'user-17-2'], isVerified: true, lastSeen: 'online', socials: { spotify: 'deji-lifts' } },
  { id: 'user-5', name: 'Efe', age: 29, bio: 'Just a girl who loves to laugh and make others smile. I enjoy comedy shows, cooking, and spontaneous adventures.', location: 'Benin City, Nigeria', job: 'Nurse', education: 'University of Benin', interests: ['Comedy', 'Cooking', 'Adventure'], photos: ['user-5', 'user-9', 'user-16-2', 'user-18-2'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 5) },
  { id: 'user-6', name: 'Femi', age: 35, bio: 'Architect who appreciates good design, deep conversations, and a great cup of coffee.', location: 'Lagos, Nigeria', job: 'Architect', education: 'Ahmadu Bello University', interests: ['Architecture', 'Coffee', 'Philosophy', 'Jazz'], photos: ['user-6', 'user-10', 'user-19-2', 'user-21-2'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 20), socials: { instagram: '@femi_designs' } },
  { id: 'user-7', name: 'Gbemi', age: 27, bio: 'Writer and bookworm. Let\'s trade book recommendations and find a cozy cafe to chat in.', location: 'Abuja, Nigeria', job: 'Journalist', education: 'University of Nigeria, Nsukka', interests: ['Writing', 'Reading', 'Coffee', 'Cats'], photos: ['user-7', 'user-11', 'user-20-2', 'user-22-2'], isVerified: true, lastSeen: 'online' },
  { id: 'user-8', name: 'Hassan', age: 31, bio: 'Doctor with a big heart. I unwind by hiking, playing football, and volunteering.', location: 'Kano, Nigeria', job: 'Doctor', education: 'Bayero University Kano', interests: ['Hiking', 'Football', 'Volunteering', 'Movies'], photos: ['user-8', 'user-12', 'user-23-2', 'user-25-2'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 12) },
  { id: 'user-9', name: 'Ify', age: 26, bio: 'Loves the beach, sunsets, and Nollywood classics. Looking for a genuine connection.', location: 'Lagos, Nigeria', job: 'Marketing Manager', education: 'Pan-Atlantic University', interests: ['Beach', 'Movies', 'Dancing'], photos: ['user-9', 'user-1', 'user-24-2', 'user-26-2'], isVerified: false, lastSeen: 'online' },
  { id: 'user-10', name: 'Jide', age: 33, bio: 'Investment banker who works hard and plays harder. Seeking an ambitious and fun-loving partner.', location: 'Lagos, Nigeria', job: 'Banker', education: 'Lagos Business School', interests: ['Finance', 'Travel', 'Fine Dining', 'Sailing'], photos: ['user-10', 'user-2', 'user-27-2', 'user-28-2'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 2), socials: { instagram: '@jide_invests', spotify: 'jide-global' } },
  { id: 'user-11', name: 'Kemi', age: 29, bio: "Artist who finds beauty in everything. Let's create something beautiful together. I love painting, exploring art galleries, and finding hidden gems in Lagos.", location: 'Lagos, Nigeria', job: 'Graphic Designer', education: 'University of Lagos', interests: ['Art', 'Photography', 'Museums', 'Indie Music', 'Painting', 'Coffee', 'Yoga'], photos: ['user-11', 'user-3', 'user-1', 'user-5'], isVerified: true, lastSeen: 'online', socials: { instagram: '@kemi_artistry', spotify: 'Indie & Afrobeats' } },
  { id: 'user-12', name: 'Lanre', age: 28, bio: 'Guitarist in a local band. I love live music, spicy food, and road trips.', location: 'Ibadan, Nigeria', job: 'Musician', education: 'The Polytechnic, Ibadan', interests: ['Music', 'Guitar', 'Foodie', 'Travel'], photos: ['user-12', 'user-4', 'user-2', 'user-6'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 7), socials: { spotify: 'lanre-live' } },
  { id: 'user-13', name: 'Muna', age: 24, bio: 'Veterinarian student. My dog is my world. Animal lovers to the front!', location: 'Enugu, Nigeria', job: 'Student', education: 'University of Nigeria', interests: ['Animals', 'Nature', 'Movies', 'Volunteering'], photos: ['user-13', 'user-13-2', 'user-3', 'user-7'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 'user-14', name: 'Ngozi', age: 30, bio: 'Chef and culinary artist. I express my love through food. Let me cook for you.', location: 'Lagos, Nigeria', job: 'Chef', education: 'Culinary Academy Nigeria', interests: ['Cooking', 'Foodie', 'Travel', 'Wine'], photos: ['user-14', 'user-14-2', 'user-4', 'user-8'], isVerified: true, lastSeen: 'online' },
  { id: 'user-15', name: 'Obi', age: 34, bio: 'History teacher who loves a good debate. Tell me something I don\'t know.', location: 'Onitsha, Nigeria', job: 'Teacher', education: 'Nnamdi Azikiwe University', interests: ['History', 'Politics', 'Reading', 'Chess'], photos: ['user-15', 'user-15-2', 'user-5', 'user-9'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 25) },
  { id: 'user-16', name: 'Patience', age: 26, bio: 'Dancer and choreographer. My life has a soundtrack, and I\'m always moving to the beat.', location: 'Abuja, Nigeria', job: 'Dancer', education: 'SPAN (Society for the Performing Arts in Nigeria)', interests: ['Dancing', 'Music', 'Afrobeats', 'Concerts'], photos: ['user-16', 'user-16-2', 'user-6', 'user-10'], isVerified: false, lastSeen: 'online' },
  { id: 'user-17', name: 'Rotimi', age: 29, bio: 'Photographer constantly chasing the perfect shot. Spontaneous trips are my specialty.', location: 'Calabar, Nigeria', job: 'Photographer', education: 'Self-taught', interests: ['Photography', 'Travel', 'Adventure', 'Nature'], photos: ['user-17', 'user-17-2', 'user-7', 'user-11'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 4) },
  { id: 'user-18', name: 'Simi', age: 27, bio: 'Marketing exec with a love for brunch, fashion, and weekend getaways. Let\'s make some memories.', location: 'Lagos, Nigeria', job: 'Marketing Executive', education: 'Babcock University', interests: ['Fashion', 'Brunch', 'Travel', 'Social Media'], photos: ['user-18', 'user-18-2', 'user-8', 'user-12'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 9), socials: { instagram: '@simi_styles' } },
  { id: 'user-19', name: 'Tunde', age: 31, bio: 'Entrepreneur with a passion for building things. Let\'s build a connection.', location: 'Abeokuta, Nigeria', job: 'Entrepreneur', education: 'Federal University of Agriculture, Abeokuta', interests: ['Business', 'Tech', 'Investing', 'Golf'], photos: ['user-19', 'user-19-2', 'user-9', 'user-1'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 11) },
  { id: 'user-20', name: 'Uche', age: 28, bio: 'A globetrotter who loves exploring new cultures. My next stop could be with you.', location: 'Owerri, Nigeria', job: 'Translator', education: 'Imo State University', interests: ['Travel', 'Culture', 'Languages', 'Photography'], photos: ['user-20', 'user-20-2', 'user-10', 'user-2'], isVerified: false, lastSeen: 'online' },
  { id: 'user-21', name: 'Victor', age: 29, bio: 'Film director and storyteller. I see the world in scenes and shots. What\'s your story?', location: 'Lagos, Nigeria', job: 'Film Director', education: 'AFDA Film School', interests: ['Filmmaking', 'Storytelling', 'Art', 'Nollywood'], photos: ['user-21', 'user-21-2', 'user-11', 'user-3'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 6) },
  { id: 'user-22', name: 'Wunmi', age: 26, bio: 'Lover of all things natural. From hair to food. Let\'s keep it real.', location: 'Ilorin, Nigeria', job: 'Dietitian', education: 'University of Ilorin', interests: ['Natural Hair', 'Healthy Eating', 'Yoga', 'Reading'], photos: ['user-22', 'user-22-2', 'user-12', 'user-4'], isVerified: true, lastSeen: 'online' },
  { id: 'user-23', name: 'Yemi', age: 33, bio: 'Civil engineer creating landmarks. Looking for someone to build a future with.', location: 'Kaduna, Nigeria', job: 'Civil Engineer', education: 'Kaduna Polytechnic', interests: ['Engineering', 'Reading', 'Football', 'Documentaries'], photos: ['user-23', 'user-23-2', 'user-13', 'user-13-2'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 18) },
  { id: 'user-24', name: 'Zainab', age: 27, bio: 'Poet and spoken word artist. I have a way with words. Let\'s write our own story.', location: 'Jos, Nigeria', job: 'Artist', education: 'University of Jos', interests: ['Poetry', 'Spoken Word', 'Music', 'Nature'], photos: ['user-24', 'user-24-2', 'user-14', 'user-14-2'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 22) },
  { id: 'user-25', name: 'Ade', age: 30, bio: 'Marine biologist fascinated by the ocean. Seeking a partner for life\'s great adventures.', location: 'Lagos, Nigeria', job: 'Marine Biologist', education: 'University of Lagos', interests: ['Marine Biology', 'Diving', 'Conservation', 'Travel'], photos: ['user-25', 'user-25-2', 'user-15', 'user-15-2'], isVerified: true, lastSeen: 'online' },
  { id: 'user-26', name: 'Blessing', age: 29, bio: 'Human rights lawyer fighting for justice. Passionate about making a difference.', location: 'Abuja, Nigeria', job: 'Lawyer', education: 'University of Abuja', interests: ['Law', 'Activism', 'Politics', 'Reading'], photos: ['user-26', 'user-26-2', 'user-16', 'user-16-2'], isVerified: false, lastSeen: new Date(Date.now() - 1000 * 60 * 14) },
  { id: 'user-27', name: 'Chike', age: 32, bio: 'Musician and producer. I live and breathe music. Let\'s find our rhythm together.', location: 'Enugu, Nigeria', job: 'Music Producer', education: 'IMT, Enugu', interests: ['Music Production', 'Songwriting', 'Afrobeats', 'Live Gigs'], photos: ['user-27', 'user-27-2', 'user-17', 'user-17-2'], isVerified: true, lastSeen: 'online', socials: { instagram: '@chike_beatz', spotify: 'chikes-playlist' } },
  { id: 'user-28', name: 'Dami', age: 25, bio: 'Graphic designer with a flair for vibrant colors. Life is my canvas.', location: 'Lagos, Nigeria', job: 'Graphic Designer', education: 'Self-taught', interests: ['Graphic Design', 'Art', 'Fashion', 'Festivals'], photos: ['user-28', 'user-28-2', 'user-18', 'user-18-2'], isVerified: true, lastSeen: new Date(Date.now() - 1000 * 60 * 1) },
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
