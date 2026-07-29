import express from 'express';
import Coupon from '../models/Coupon.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Validate a discount coupon
// @route   POST /api/coupons/validate
// @access  Private
router.post('/validate', protect, async (req, res) => {
    const { code, cartTotal } = req.body;

    try {
        if (!code) {
            return res.status(400).json({ message: 'Coupon code is required' });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or active coupon code' });
        }

        // Check expiration date
        if (new Date(coupon.expireDate) < new Date()) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        // Check minimum purchase amount
        if (cartTotal && cartTotal < coupon.minPurchaseAmount) {
            return res.status(400).json({
                message: `Minimum purchase of $${coupon.minPurchaseAmount} required for this coupon`
            });
        }

        res.json({
            code: coupon.code,
            discountType: coupon.discountType,
            discountAmount: coupon.discountAmount,
            message: 'Coupon applied successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { code, discountType, discountAmount, minPurchaseAmount, expireDate } = req.body;

    try {
        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });

        if (couponExists) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountType,
            discountAmount,
            minPurchaseAmount: minPurchaseAmount || 0,
            expireDate
        });

        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a coupon (Admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (coupon) {
            await Coupon.findByIdAndDelete(req.params.id);
            res.json({ message: 'Coupon removed successfully' });
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
