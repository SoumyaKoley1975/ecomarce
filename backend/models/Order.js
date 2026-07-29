import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // price at the time of purchase
    size: { type: String },
    color: { type: String }
});

const paymentResultSchema = new mongoose.Schema({
    id: { type: String }, // Transaction ID
    status: { type: String }, // e.g. 'succeeded', 'paid'
    update_time: { type: String },
    email_address: { type: String },
    gateway: { type: String, enum: ['stripe', 'razorpay', 'cod'], required: true }
});

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true }, // 'Stripe', 'Razorpay', 'COD'
    paymentResult: paymentResultSchema,
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    discountPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
        default: 'Pending'
    },
    trackingNumber: { type: String },
    returnRequest: {
        isRequested: { type: Boolean, default: false },
        reason: { type: String },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'] },
        requestedAt: { type: Date }
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
