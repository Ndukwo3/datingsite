
import { Timestamp } from 'firebase/firestore';

export type User = {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  job: string;
  education: string;
  interests: string[];
  photos: string[]; // Array of image URLs from Firebase Storage
  isVerified: boolean;
  lastSeen: Date | 'online';
  onboardingComplete?: boolean;
  socials?: {
    instagram?: string;
    spotify?: string;
  },
  relationshipGoal?: string;
  height?: string;
  exercise?: string;
  drinking?: string;
  smoking?: string;
  gender?: string;
  email?: string;
};

export type Match = {
  id: string;
  userId: string;
  matchedUserId: string;
  timestamp: Timestamp;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: Message;
  createdAt: Timestamp;
};

export type Post = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: Timestamp;
    likes: number;
    author?: Partial<User>;
};

export type Comment = {
    id: string;
    text: string;
    authorId: string;
    postId: string;
    createdAt: Timestamp;
    author?: Partial<User>;
};
