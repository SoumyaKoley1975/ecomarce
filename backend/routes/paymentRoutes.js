import express from 'express';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Initialize Stripe (if secret key starts with sk_, otherwise use dummy)
let stripe;
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key_v51d';
if (stripeKey && !stripeKey.includes('mock')) {
    stripe = new Stripe(stripeKey);
}

// Initialize Razorpay
let razorpay;
const rzpKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id';
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_key_secret';
if (rzpKeyId && !rzpKeyId.includes('mock')) {
    razorpay = new Razorpay({
        key_id: rzpKeyId,
        key_secret: rzpKeySecret
    });
}

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/stripe/create-checkout-session
// @access  Private
router.post('/stripe/create-checkout-session', protect, async (req, res) => {
    const { orderItems, discountPrice, taxPrice, shippingPrice } = req.body;

    try {
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No items in payment request' });
        }

        if (!stripe) {
            // Return a simulated mock checkout session since Stripe keys might be placeholders
            const mockSessionId = 'cs_test_' + crypto.randomBytes(16).toString('hex');
            console.log('Stripe not configured. Returning simulated mock session ID:', mockSessionId);
            return res.json({
                id: mockSessionId,
                url: `${req.headers.origin || 'http://localhost:3000'}/order-success?session_id=${mockSessionId}&gateway=stripe`,
                mock: true
            });
        }

        // Convert items to Stripe compatible data structure
        const lineItems = orderItems.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    metadata: {
                        productId: item.product.toString(),
                        size: item.size || '',
                        color: item.color || ''
                    }
                },
                unit_amount: Math.round(item.price * 100) // cents
            },
            quantity: item.quantity
        }));

        // If there is discount/tax/shipping, add them as separate line items for simplicity or apply discount via coupon
        if (shippingPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Shipping Charges' },
                    unit_amount: Math.round(shippingPrice * 100)
                },
                quantity: 1
            });
        }
        if (taxPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Estimated Sales Tax' },
                    unit_amount: Math.round(taxPrice * 100)
                },
                quantity: 1
            });
        }
        if (discountPrice > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Discount Applied' },
                    unit_amount: -Math.round(discountPrice * 100) // Negative price data is not fully supported in simple stripe checkouts standard items, so we adjust client side or add it
                },
                quantity: 1
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/order-success?session_id={CHECKOUT_SESSION_ID}&gateway=stripe`,
            cancel_url: `${req.headers.origin}/cart`,
            customer_email: req.user.email,
            metadata: {
                userId: req.user._id.toString()
            }
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create Razorpay Order
// @route   POST /api/payments/razorpay/create-order
// @access  Private
router.post('/razorpay/create-order', protect, async (req, res) => {
    const { amount } = req.body; // Total amount in original currency (e.g. INR)

    try {
        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        if (!razorpay) {
            // Mock order creation when Razorpay is not configured
            const mockOrderId = 'order_mock_' + crypto.randomBytes(8).toString('hex');
            console.log('Razorpay not configured. Returning simulated mock order ID:', mockOrderId);
            return res.json({
                id: mockOrderId,
                amount: amount * 100, // paisa
                currency: 'INR',
                mock: true
            });
        }

        const options = {
            amount: Math.round(amount * 100), // paisa
            currency: 'INR',
            receipt: 'rcpt_' + crypto.randomBytes(8).toString('hex')
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/razorpay/verify
// @access  Private
router.post('/razorpay/verify', protect, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        if (razorpay_order_id.startsWith('order_mock_')) {
            return res.json({ status: 'success', message: 'Mock payment verified successfully' });
        }

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', rzpKeySecret)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            return res.json({ status: 'success', message: 'Payment verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
