export type UserRole = 'guest' | 'student' | 'faculty' | 'admin' | 'super-admin';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  rollNumber?: string;
  department?: string;
  year?: string;
  phone?: string;
  hostel?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  profilePicture?: string;
  role: UserRole;
  points: number;
  itemsReturned: number;
  itemsFound: number;
  badges: string[];
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
}

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'active' | 'claimed' | 'returned' | 'hidden';

export interface IItem {
  _id: string;
  type: ItemType;
  title: string;
  category: string;
  brand?: string;
  model?: string;
  color?: string;
  description: string;
  images: string[];
  date: string;
  time?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    building?: string;
    floor?: string;
    roomNumber?: string;
    description: string;
  };
  owner: string | IUser;
  status: ItemStatus;
  reward?: number;
  additionalNotes?: string;
  currentHolder?: string;
  canDeliver?: boolean;
  similarityScore?: number;
  createdAt: string;
  updatedAt: string;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'more-info-requested';

export interface IClaim {
  _id: string;
  item: string | IItem;
  claimer: string | IUser;
  proofDescription: string;
  uniqueMarks?: string;
  receiptImage?: string;
  extraImages: string[];
  status: ClaimStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 'match' | 'claim' | 'message' | 'system' | 'announcement';

export interface INotification {
  _id: string;
  user: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}
