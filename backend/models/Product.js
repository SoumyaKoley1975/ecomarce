import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, default: 0 }, // If set, represents the sale price
    images: [{ type: String, required: true }], // Cloudinary URLs
    videoUrl: { type: String }, // Optional video demonstration
    category: { type: String, required: true, index: true }, // e.g., 'men', 'women', 'kids'
    subCategory: { type: String, required: true }, // e.g., 'shirts', 't-shirts', 'outerwear', 'jeans'
    sizes: [{ type: String, required: true }], // e.g., ['XS', 'S', 'M', 'L', 'XL']
    colors: [{
        name: { type: String, required: true },
        hex: { type: String, required: true }
    }], // e.g., [{ name: 'Off-White', hex: '#FAF9F6' }]
    stock: { type: Number, required: true, min: 0, default: 10 },
    sku: { type: String, required: true, unique: true, index: true },
    brand: { type: String, default: 'Veloura' },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    tags: [{ type: String }],
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Compound check for text indexing
productSchema.index({ name: 'text', description: 'text', brand: 'text', category: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
