// Test Stripe Configuration
const Stripe = require('stripe');

// Test with the global stripe instance approach
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
    })
  : null;

console.log('Stripe configured:', !!stripe);
console.log('Stripe API Version:', stripe?.VERSION);

if (stripe) {
  // Test creating a payment intent
  stripe.paymentIntents.create({
    amount: 1000, // $10.00 in cents
    currency: "usd",
    metadata: {
      test: "true"
    },
  })
  .then(paymentIntent => {
    console.log('✅ Payment Intent created successfully:', paymentIntent.id);
    console.log('Client Secret:', paymentIntent.client_secret);
  })
  .catch(error => {
    console.error('❌ Error creating payment intent:', error.message);
    console.error('Error type:', error.type);
    if (error.raw) {
      console.error('Raw error:', error.raw);
    }
  });
} else {
  console.log('❌ Stripe not configured - missing STRIPE_SECRET_KEY');
}
