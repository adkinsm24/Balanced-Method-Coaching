# Stripe Payment Configuration Fixes

## Changes Made:

### 1. **server/routes.ts** - Created Global Stripe Instance
- Added a global Stripe instance at the top of the file after imports:
```typescript
// Initialize Stripe instance
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    })
  : null;
```

### 2. **server/routes.ts** - Updated All Payment Routes
- Replaced all instances of `new Stripe()` with the global `stripe` instance
- Changed all `if (!process.env.STRIPE_SECRET_KEY)` checks to `if (!stripe)`
- Updated the following endpoints:
  - `/api/create-payment-intent` (course payments)
  - `/api/confirm-course-payment` 
  - `/api/coaching-calls/create-payment-intent`
  - `/api/coaching-calls/confirm-payment`

### 3. **Frontend Files** - Already Correct
- `client/src/pages/checkout.tsx` - Already using `loadStripe()` without API version
- `client/src/pages/checkout-coaching.tsx` - Already using `loadStripe()` without API version

## Key Points:

1. **API Version**: We're now using `2024-06-20` which is a valid, stable Stripe API version
2. **Single Instance**: All routes now use the same Stripe instance, preventing version conflicts
3. **Frontend Simplification**: Frontend doesn't specify API version, letting Stripe.js handle it

## What This Fixes:

1. **400 Bad Request Error**: The invalid API version `2025-03-31.basil` was causing Stripe to reject requests
2. **Payment Element Not Mounting**: Consistent API versions allow the PaymentElement to load properly
3. **Authentication Issues**: The 401 errors are separate - they're from the auth system checking user status, which is expected for anonymous checkout

## Next Steps:

1. Ensure your environment variables are set correctly:
   - `STRIPE_SECRET_KEY` should be your actual Stripe secret key
   - `VITE_STRIPE_PUBLIC_KEY` should be your actual Stripe public key (without the `=` prefix)

2. Test the payment flow:
   - Try creating a payment intent
   - The PaymentElement should now load without errors
   - Payments should process successfully

## Testing:

You can run the test script I created:
```bash
node test-stripe-config.js
```

This will verify if your Stripe configuration is working correctly.
