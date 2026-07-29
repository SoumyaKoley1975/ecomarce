import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountAmount: { type: Number, required: true },
    minPurchaseAmount: { type: Number, default: 0 },
    expireDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
