import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all reviews of a single product
// @route   GET /api/reviews/:productId
// @access  Public
router.get('/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId, isApproved: true })
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
    const { productId, rating, comment } = req.body;

    try {
        if (!rating || !comment || !productId) {
            return res.status(400).json({ message: 'Rating, comment, and productId are required' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed this product
        const alreadyReviewed = await Review.findOne({
            product: productId,
            user: req.user._id
        });

        if (alreadyReviewed) {
            alreadyReviewed.rating = Number(rating);
            alreadyReviewed.comment = comment;
            await alreadyReviewed.save();
            return res.status(200).json({ message: 'Review updated' });
        }

        const review = new Review({
            product: productId,
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
            isApproved: true // default approved, admin moderator can disable it
        });

        await review.save();
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all reviews (Admin only)
// @route   GET /api/reviews
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('product', 'name sku')
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle review approval (Admin only - moderation)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
router.put('/:id/approve', protect, admin, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (review) {
            review.isApproved = !review.isApproved;
            await review.save();

            // Re-trigger averages calculations
            await Review.calculateAverageRating(review.product);

            res.json({ message: `Review approval status set to ${review.isApproved}` });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (review) {
            // Allow author or admin to delete
            if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to delete this review' });
            }

            const productId = review.product;
            await Review.findByIdAndDelete(req.params.id);

            // Trigger average updates
            await Review.calculateAverageRating(productId);

            res.json({ message: 'Review deleted successfully' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
