import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // User's name captured at review time
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: true } // Admin can moderate
}, {
    timestamps: true
});

// Calculate product average rating whenever a review is saved or removed
reviewSchema.statics.calculateAverageRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId, isApproved: true } },
        {
            $group: {
                _id: '$product',
                numReviews: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                ratings: Math.round(stats[0].avgRating * 10) / 10,
                numReviews: stats[0].numReviews
            });
        } else {
            await mongoose.model('Product').findByIdAndUpdate(productId, {
                ratings: 0,
                numReviews: 0
            });
        }
    } catch (error) {
        console.error('Error updating product rating stats:', error);
    }
};

reviewSchema.post('save', function () {
    this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        doc.constructor.calculateAverageRating(doc.product);
    }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
