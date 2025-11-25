// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Falta STRIPE_SECRET_KEY en .env.local');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
 apiVersion: '2025-11-17.clover' // versión actual estable
});