// Type definitions for the Apartmanım app

export interface User {
  id: string;
  name: string;
  surname: string;
  phone?: string;
  apartment: string;
  block: string;
  floor: number;
  email: string;
}

export interface Site {
  id: string;
  name: string;
  address: string;
  totalBlocks: number;
  totalApartments: number;
}

export interface Block {
  id: string;
  name: string;
  apartments: number;
  floors: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'urgent' | 'warning' | 'info';
  author: string;
  createdAt: Date;
}

export interface ShareItem {
  id: string;
  type: 'borrowing' | 'sharing';
  title: string;
  description: string;
  owner: string;
  floor: number;
  image?: string;
  createdAt: Date;
}

export interface Neighbor {
  id: string;
  name: string;
  surname: string;
  apartment: string;
  floor: number;
  phone?: string;
  email?: string;
}

export interface FaultReport {
  id: string;
  title: string;
  description: string;
  category: 'cleaning' | 'technical' | 'security' | 'other';
  status: 'pending' | 'in_progress' | 'resolved';
  reportedBy: string;
  createdAt: Date;
  image?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  attendees: string[];
  maxAttendees?: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'other';
  url: string;
  uploadedAt: Date;
  size?: string;
}

export interface LocalBusiness {
  id: string;
  name: string;
  category: 'food' | 'grocery' | 'service' | 'health' | 'other';
  description: string;
  discount: string;
  phone: string;
  address: string;
  distance: string;
  rating: number;
  image?: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorBlock: string;
  authorApartment: string;
  category: 'question' | 'discussion' | 'suggestion' | 'complaint';
  replies: ForumReply[];
  likes: number;
  views: number;
  createdAt: Date;
}

export interface ForumReply {
  id: string;
  content: string;
  author: string;
  authorBlock: string;
  authorApartment: string;
  likes: number;
  createdAt: Date;
}

export interface Settings {
  notifications: {
    announcements: boolean;
    messages: boolean;
    events: boolean;
  };
  darkMode: boolean;
}
