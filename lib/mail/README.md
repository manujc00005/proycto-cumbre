# Email System Architecture

Modular, template-based email system for Proyecto Cumbre with always-dark theme.

## 📁 Structure

```
lib/mail/
├── templates/                       # ⭐ Modular email templates
│   ├── order-mail-template.ts      # Order emails (all states)
│   ├── event-mail-template.ts      # Event confirmation emails
│   ├── membership-mail-template.ts # Membership emails
│   ├── license-mail-template.ts    # License activation emails
│   ├── contact-mail-template.ts    # Contact form emails
│   └── index.ts                     # Centralized exports
├── email-service.ts                 # ⭐ Main email service (entry point)
├── event-email-configs.ts           # Event-specific configurations
├── types.ts                         # TypeScript interfaces
└── README.md                        # This documentation
```

## 🎨 Template Features

### Always-Black Dark Theme
All templates enforce a dark theme that works across all email clients:
- No reliance on `prefers-color-scheme`
- Explicit `background-color: #000000 !important`
- `color-scheme: dark only` metadata
- Works on Android, iOS, desktop, and webmail

### Modular & Flexible
Each template is:
- **Self-contained** - Encapsulates HTML, subject, and text
- **Props-driven** - Content comes from TypeScript interfaces
- **Reusable** - Single template handles multiple states/scenarios
- **Type-safe** - Full TypeScript support

---

## 📧 Email Templates

### 1. Order Email Template

**File:** `templates/order-mail-template.ts`

Single flexible template for **all order states**: `CREATED`, `PAID`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`, `EXPIRED`

#### Usage

```typescript
import { buildOrderMail, OrderMailProps } from '@/lib/mail/templates/order-mail-template';

// Example: Order confirmation (PAID)
const orderProps: OrderMailProps = {
  status: 'PAID',
  email: 'customer@example.com',
  name: 'Juan García',
  orderNumber: 'ORD-2024-001',
  items: [
    { name: 'Camiseta Técnica', quantity: 2, price: 2500 },
    { name: 'Gorra', quantity: 1, price: 1500 }
  ],
  subtotal: 6500,
  shipping: 500,
  total: 7000,
  shippingAddress: {
    street: 'Calle Mayor 123',
    city: 'Madrid',
    province: 'Madrid',
    postalCode: '28001'
  }
};

const { subject, html, text } = buildOrderMail(orderProps);

// Send via email service
await EmailService.send({
  to: orderProps.email,
  subject,
  html,
  text
});
```

#### Order States

| Status | Icon | Color | Use Case |
|--------|------|-------|----------|
| `CREATED` | 📝 | Gray | Order created, awaiting payment |
| `PAID` | ✓ | Green | Payment confirmed |
| `PROCESSING` | ⚙️ | Blue | Order being prepared |
| `SHIPPED` | 📦 | Orange | Order shipped with tracking |
| `DELIVERED` | ✓ | Green | Order delivered |
| `CANCELLED` | × | Red | Order cancelled |
| `REFUNDED` | ↩ | Purple | Refund processed |
| `EXPIRED` | ⏱ | Gray | Payment expired |

#### Optional Props

- `trackingNumber`, `trackingUrl`, `carrier` - For `SHIPPED` status
- `reason`, `refundInfo` - For `CANCELLED`/`REFUNDED` status
- `createdAt`, `paidAt` - Timestamp information

---

### 2. Event Email Template

**File:** `templates/event-mail-template.ts`

100% flexible template for **any event type**: trail runs, barranquismo, MISA, etc.

#### Usage

```typescript
import { buildEventMail, EventMailProps } from '@/lib/mail/templates/event-mail-template';

const eventProps: EventMailProps = {
  email: 'participant@example.com',
  name: 'María López',
  phone: '+34 600 123 456',
  amount: 2500,
  eventName: 'Trail Nocturno Sierra Nevada',
  eventDate: new Date('2024-06-15T20:00:00'),
  eventLocation: 'Refugio Poqueira',
  heroColor: '#10b981', // Optional accent color

  // Optional WhatsApp group
  whatsappLink: 'https://chat.whatsapp.com/...',
  whatsappMessage: 'Información logística exclusiva por WhatsApp.',

  // Event details
  eventDetails: {
    meetingPoint: 'Parking Refugio Poqueira',
    duration: '4-5 horas',
    difficulty: 'Media-Alta',
    requiredEquipment: 'Frontal potente, bastones, 1L agua',
    startTime: '20:00',
    endTime: '01:00'
  },

  // What's included
  features: [
    { icon: '💡', title: 'Frontal LED incluido' },
    { icon: '🥤', title: 'Avituallamiento cada 5km' },
    { icon: '📸', title: 'Fotos profesionales' }
  ],

  // Important notice
  importantNote: {
    icon: '🌙',
    title: 'Salida nocturna',
    message: 'Llega 30 minutos antes para el briefing.'
  }
};

const { subject, html, text } = buildEventMail(eventProps);
```

#### Optional Sections

- **WhatsApp Block** - Only renders if `whatsappLink` provided
- **Event Information** - Only if `eventDate`/`eventLocation`/`eventDetails` provided
- **Features List** - Only if `features` array has items
- **Calendar Links** - Auto-generated if `eventDate` provided (Google, Apple, Outlook)
- **Important Note** - Only if `importantNote` provided
- **CTA Buttons** - Only if `ctaButtons` array provided

---

### 3. Membership Email Template

**File:** `templates/membership-mail-template.ts`

Handles membership confirmation and payment failures.

#### Usage

```typescript
import { buildMembershipMail, MembershipMailProps } from '@/lib/mail/templates/membership-mail-template';

// Success case
const membershipProps: MembershipMailProps = {
  paymentStatus: 'success',
  email: 'socio@example.com',
  firstName: 'Carlos',
  lastName: 'Ruiz',
  memberNumber: 'PC-2024-042',
  licenseType: 'A',
  amount: 5000,
  currency: 'EUR'
};

const { subject, html, text } = buildMembershipMail(membershipProps);

// Failed case
const failedProps: MembershipMailProps = {
  paymentStatus: 'failed',
  email: 'socio@example.com',
  firstName: 'Carlos',
  lastName: 'Ruiz'
};

const failed = buildMembershipMail(failedProps);
```

#### Payment States

- `success` - Membership activated, shows details
- `failed` - Payment rejected, shows retry instructions
- `pending` - Payment processing (optional)

---

### 4. License Email Template

**File:** `templates/license-mail-template.ts`

FEDME license notifications.

#### Usage

```typescript
import { buildLicenseMail, LicenseMailProps } from '@/lib/mail/templates/license-mail-template';

const licenseProps: LicenseMailProps = {
  status: 'activated',
  email: 'socio@example.com',
  firstName: 'Laura',
  memberNumber: 'PC-2024-015',
  licenseType: 'B',
  licenseNumber: 'FEDME-2024-12345',
  validFrom: new Date('2024-01-01'),
  validUntil: new Date('2024-12-31')
};

const { subject, html, text } = buildLicenseMail(licenseProps);
```

#### License States

- `activated` - License is now active
- `renewed` - License renewed successfully
- `expiring` - License expiring soon (warning)
- `expired` - License has expired

---

### 5. Contact Form Email Template

**File:** `templates/contact-mail-template.ts`

Contact form submissions sent to administrators.

#### Usage

```typescript
import { buildContactMail, ContactMailProps } from '@/lib/mail/templates/contact-mail-template';

const contactProps: ContactMailProps = {
  name: 'Carlos García',
  email: 'carlos@example.com',
  subject: 'Consulta sobre eventos',
  message: 'Hola, me gustaría más información sobre los próximos eventos de trail running.'
};

const { subject, html, text } = buildContactMail(contactProps);
```

**Features:**
- Professional admin notification layout
- Escape HTML in message content
- Reply-to header suggestion
- Clean dark theme design

---

## 🔧 Email Service API

### Using the Service

```typescript
import EmailService from '@/lib/mail/email-service';

// Order confirmation
await EmailService.sendOrderConfirmation({
  email: 'customer@example.com',
  name: 'Juan García',
  orderNumber: 'ORD-001',
  items: [...],
  subtotal: 6500,
  shipping: 500,
  total: 7000,
  shippingAddress: {...}
});

// Event confirmation
await EmailService.sendEventConfirmation('misa', {
  email: 'participant@example.com',
  name: 'María López',
  phone: '+34 600 123 456',
  amount: 2500,
  eventName: 'MISA™',
  eventDate: new Date('2024-06-15')
});

// Membership welcome
await EmailService.sendWelcomeWithPaymentStatus({
  email: 'socio@example.com',
  firstName: 'Carlos',
  lastName: 'Ruiz',
  memberNumber: 'PC-2024-042',
  licenseType: 'A',
  paymentStatus: 'success',
  amount: 5000
});

// License activation
await EmailService.sendLicenseActivated({
  email: 'socio@example.com',
  firstName: 'Laura',
  memberNumber: 'PC-2024-015',
  licenseType: 'B',
  validUntil: new Date('2024-12-31')
});

// Contact form
await EmailService.sendContactForm({
  name: 'Carlos García',
  email: 'carlos@example.com',
  subject: 'Consulta',
  message: 'Me gustaría más información...'
});
```

### Available Methods

| Method | Template Used | Description |
|--------|--------------|-------------|
| `sendOrderConfirmation(data)` | Order (PAID) | Initial order confirmation |
| `sendOrderProcessing(data)` | Order (PROCESSING) | Order being prepared |
| `sendOrderShipped(data)` | Order (SHIPPED) | Order shipped with tracking |
| `sendOrderDelivered(data)` | Order (DELIVERED) | Order delivered |
| `sendOrderCancelled(data)` | Order (CANCELLED) | Order cancelled |
| `sendEventConfirmation(slug, data)` | Event | Event booking confirmation |
| `sendWelcomeWithPaymentStatus(data)` | Membership | Welcome email (success/failed) |
| `sendLicenseActivated(data)` | License | License activation |
| `sendContactForm(data)` | Contact | Contact form admin notification |

---

## 🎯 Design Principles

### 1. Always-Black Background
Every template enforces a black background with:
```html
<meta name="color-scheme" content="dark only">
<style>
  * { color-scheme: dark only !important; }
  body { background-color: #000000 !important; }
</style>
```

### 2. Props-Driven Content
No hardcoded strings. Everything comes from props:
```typescript
// ✅ Good
<h1>${props.eventName}</h1>

// ❌ Bad
<h1>Trail Nocturno</h1>
```

### 3. Optional Rendering
Only render sections if data is provided:
```typescript
${props.trackingNumber ? `
  <div>Tracking: ${props.trackingNumber}</div>
` : ''}
```

### 4. Status-Driven Logic
Single template handles multiple states:
```typescript
const config = STATUS_CONFIGS[props.status];
// Renders different icon, color, message per status
```

### 5. Professional Minimal Style
- Clean, modern design
- Focused on information
- No unnecessary graphics
- Email-safe HTML (tables, inline styles)

---

## 📝 Adding New Templates

1. Create template file in `templates/`:
```typescript
// templates/my-template.ts
export interface MyMailProps {
  email: string;
  // ... other props
}

export function buildMyMail(props: MyMailProps): {
  subject: string;
  html: string;
  text: string;
} {
  return {
    subject: `My Subject`,
    html: generateHTML(props),
    text: generateText(props)
  };
}
```

2. Export from `templates/index.ts`:
```typescript
export * from './my-template';
```

3. Add service method in `email-service.ts`:
```typescript
static async sendMyEmail(data: MyData) {
  const { subject, html, text } = buildMyMail(data);
  return this.send({ to: data.email, subject, html, text });
}
```

---

## 🧪 Testing

### Manual Testing
```typescript
// Test order email
const testOrder = buildOrderMail({
  status: 'SHIPPED',
  email: 'test@example.com',
  name: 'Test User',
  orderNumber: 'TEST-001',
  items: [],
  total: 1000,
  trackingNumber: 'TRACK123',
  trackingUrl: 'https://...',
  carrier: 'Correos'
});

console.log(testOrder.subject);
console.log(testOrder.html);
```

### Email Preview
In development, emails redirect to `DEV_TEST_EMAIL` environment variable.

---

## 🎨 Theme Customization

### Color Palette
```typescript
const COLORS = {
  primary: '#f97316',     // Orange (Proyecto Cumbre brand)
  success: '#10b981',     // Green
  error: '#ef4444',       // Red
  warning: '#f59e0b',     // Amber
  info: '#3b82f6',        // Blue
  background: '#000000',  // Black (always)
  surface: '#0a0a0a',     // Near-black
  card: '#18181b',        // Zinc-900
  border: '#27272a',      // Zinc-800
};
```

### Typography
- **Font:** System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- **Headings:** 700-900 weight, tight letter-spacing
- **Body:** 400-600 weight, 1.6-1.8 line-height
- **Monospace:** 'Courier New' for codes/IDs

---

## 🚀 Performance

- **Inline styles** - No external CSS
- **Table-based layout** - Maximum email client compatibility
- **Minimal HTML** - Fast rendering
- **No images** - Text and emojis only (instant load)

---

## 📚 References

- [Email Template Builder](./email-template-builder.ts) - Base wrapper (legacy)
- [Event Configs](./event-email-configs.ts) - Event-specific data
- [Types](./types.ts) - All TypeScript interfaces
- [Base Styles](./email-base-styles.ts) - Shared CSS (legacy)
