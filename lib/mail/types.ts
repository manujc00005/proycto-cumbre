export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

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

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
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