// ========================================
// EMAIL TYPES - CENTRALIZED
// Updated for modular template architecture
// lib/mail/types.ts
// ========================================

// Base email options
export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Contact form data (unchanged)
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Legacy types - kept for backward compatibility during migration
export interface MembershipEmailData {
  email: string;
  firstName: string;
  lastName: string;
  memberNumber: string;
  licenseType: string;
  paymentStatus: 'success' | 'failed';
  amount?: number;
  currency?: string;
}

export interface LicenseActivatedData {
  email: string;
  firstName: string;
  memberNumber: string;
  licenseType: string;
  validUntil: Date;
}

export interface BaseEventEmailData {
  email: string;
  name: string;
  phone: string;
  dni?: string;
  shirtSize?: string;
  amount: number;
  eventName: string;
  eventDate?: Date;
}

export interface OrderEmailData {
  email: string;
  name: string;
  orderNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
}

export interface EventEmailConfig {
  eventName: string;
  eventDate?: Date;
  eventLocation?: string;
  heroColor?: string;
  whatsappLink?: string;
  whatsappMessage?: string;

  eventDetails?: {
    meetingPoint?: string;
    duration?: string;
    difficulty?: string;
    requiredEquipment?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
  };

  customDetails?: Array<{
    label: string;
    value: string;
  }>;

  features?: Array<{
    icon: string;
    title: string;
    description?: string;
  }>;

  importantNote?: {
    icon?: string;
    title: string;
    message: string;
  };

  ctaButtons?: Array<{
    text: string;
    url: string;
    style?: 'primary' | 'secondary';
  }>;
}
