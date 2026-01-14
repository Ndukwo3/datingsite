
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
  createdAt?: Timestamp;
  city?: string;
  state?: string;
};

export type Match = {
  id: string;
  userIds: string[];
  timestamp: Timestamp;
  allowedUsers: Record<string, boolean>;
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
  lastMessage?: Message;
  createdAt: Timestamp;
  allowedUsers: Record<string, boolean>;
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

export type Swipe = {
    id: string;
    swiperId: string;
    swipedId: string;
    direction: 'left' | 'right' | 'up';
    timestamp: Timestamp;
};

export type NotificationItem = {
  id: string;
  type: 'like' | 'match' | 'welcome';
  fromUserId: string;
  createdAt: number; // Using JS Date.now() timestamp
  read: boolean;
  isSuperLike?: boolean;
};

export type Notification = {
  items: NotificationItem[];
  updatedAt: number;
  unreadCount: number;
};
