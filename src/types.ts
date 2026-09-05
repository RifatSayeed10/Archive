export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'editor' | 'admin' | 'user';
  bookmarks: string[]; // List of paper IDs
  isBlocked?: boolean;
  downloads?: DownloadRecord[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  message: string;
  createdAt: string;
}

export interface DownloadRecord {
  paperId: string;
  downloadedAt: string;
  orderId: string;
  price: number;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  reply?: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  reply?: string;
  status: 'open' | 'resolved';
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteBranding {
  siteName: string;
  siteTagline: string;
  logoUrl: string;
  footerText: string;
  allowRegistration: boolean;
  emailNotifications: boolean;
  themeMode: 'light' | 'dark' | 'auto';
}

export type PublicationType = 
  | 'Undergraduate Thesis'
  | "Master's Thesis"
  | 'Conference Paper'
  | 'Journal Article'
  | 'Capstone Project';

export interface Paper {
  id: string;
  title: string;
  authors: string[]; // Student authors / researchers
  supervisor?: string; // Faculty Advisor / Supervisor name
  coSupervisor?: string; // Optional Co-Supervisor
  publicationType?: PublicationType; // Thesis, Conference, Journal
  year: number;
  pages: number;
  views: number;
  likes: number;
  downloadsCount: number;
  categories: string[]; // Research Tracks (e.g. AI & ML, Software Eng, Networks)
  keywords?: string[]; // Searchable tag keywords
  summary: string; // Abstract
  fileUrl: string; // PDF link or scanned document URL
  researcherId?: string; // Associated faculty ID if any
  coverImage?: string;
  status: 'Active' | 'Inactive';
  price: number; // 0 for free
  createdAt: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  paperCount?: number;
}

export type ProjectCategory = 'Software' | 'Hardware' | 'Hybrid / IoT';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  teamMembers: string[]; // Names & Roll numbers of student developers
  supervisor?: string; // Faculty Advisor / Supervisor
  batch?: string; // e.g. "Batch 19 (2019-20)", "Batch 20", "MSc CSE"
  academicYear: number;
  description: string;
  techStack: string[]; // e.g. ["Arduino", "ESP32", "LoRa", "React", "Python"]
  demoImages: string[]; // Demo screenshots, hardware photos, circuit diagrams
  coverImage?: string;
  githubUrl?: string; // Repository or Hardware schematics
  liveDemoUrl?: string; // Live deployment or video demonstration
  documentationUrl?: string; // Project manual or PDF documentation
  status: 'Completed' | 'Ongoing' | 'Prototype' | 'Featured';
  likes: number;
  views: number;
  featured?: boolean;
  createdBy?: string;
  createdAt: string;
}

export interface Researcher {
  id: string;
  name: string;
  affiliation: string;
  position: string;
  bio: string;
  email: string;
  website: string;
  profilePhoto: string; // Icon index or SVG/image URL
  paperCount?: number;
  userId?: string;
}

export interface DatabaseState {
  users: (User & { passwordHash: string })[];
  papers: Paper[];
  projects?: Project[];
  topics: Topic[];
  researchers: Researcher[];
  tickets: Ticket[];
  contactMessages: ContactMessage[];
  faqs: FAQItem[];
  branding: SiteBranding;
  chats?: ChatMessage[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
