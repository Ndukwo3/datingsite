
export type User = {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: string;
  job: string;
  education: string;
  interests: string[];
  photos: string[]; // Array of image placeholder IDs
  isVerified: boolean;
  lastSeen: Date | 'online';
  socials?: {
    instagram?: string;
    spotify?: string;
  }
};

export type Match = {
  id: string;
  userId: string;
  matchedUserId: string;
  timestamp: Date;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  participant: User;
  lastMessage: Message;
};
