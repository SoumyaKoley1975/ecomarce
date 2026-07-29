import express from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Fetch all products with advanced filtering and sorting
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 12;
        const page = Number(req.query.page) || 1;

        // Filters
        const query = { isDeleted: { $ne: true } };

        // Search query (text search or regex fallback)
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } },
                { brand: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Category filter
        if (req.query.category) {
            query.category = req.query.category.toLowerCase();
        }

        // Subcategory filter
        if (req.query.subCategory) {
            query.subCategory = req.query.subCategory.toLowerCase();
        }

        // Brand filter
        if (req.query.brand) {
            query.brand = { $regex: new RegExp(`^${req.query.brand}$`, 'i') };
        }

        // Color filter
        if (req.query.color) {
            query['colors.name'] = { $regex: new RegExp(`^${req.query.color}$`, 'i') };
        }

        // Size filter
        if (req.query.size) {
            query.sizes = req.query.size.toUpperCase();
        }

        // Price range filter
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }

        // Rating filter
        if (req.query.rating) {
            query.ratings = { $gte: Number(req.query.rating) };
        }

        // Discount filter (Sale products)
        if (req.query.discount === 'true') {
            query.discountPrice = { $gt: 0 };
        }

        // Availability filter
        if (req.query.availability === 'in-stock') {
            query.stock = { $gt: 0 };
        }

        // Sorting
        let sortOption = {};
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'newest':
                    sortOption = { createdAt: -1 };
                    break;
                case 'price-asc':
                    sortOption = { price: 1 };
                    break;
                case 'price-desc':
                    sortOption = { price: -1 };
                    break;
                case 'best-selling':
                    sortOption = { bestSeller: -1, views: -1 };
                    break;
                case 'highest-rated':
                    sortOption = { ratings: -1 };
                    break;
                default:
                    sortOption = { createdAt: -1 };
            }
        } else {
            sortOption = { createdAt: -1 };
        }

        const count = await Product.countDocuments(query);
        const products = await Product.find(query)
            .sort(sortOption)
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get dashboard metrics / analytics (Admin only)
// @route   GET /api/products/admin/analytics
// @access  Private/Admin
router.get('/admin/analytics', protect, admin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ isDeleted: { $ne: true } });
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 3 }, isDeleted: { $ne: true } });
        const outOfStockProducts = await Product.countDocuments({ stock: 0, isDeleted: { $ne: true } });

        // Aggregate by category
        const categoriesStats = await Product.aggregate([
            { $match: { isDeleted: { $ne: true } } },
            { $group: { _id: '$category', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } }
        ]);

        res.json({
            totalProducts,
            lowStockProducts,
            outOfStockProducts,
            categoriesStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get top featured / recommendation lists
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const featured = await Product.find({ featured: true, isDeleted: { $ne: true } }).limit(8);
        const bestSellers = await Product.find({ bestSeller: true, isDeleted: { $ne: true } }).limit(8);
        const newArrivals = await Product.find({ newArrival: true, isDeleted: { $ne: true } }).limit(8);
        res.json({ featured, bestSellers, newArrivals });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch single product by ID (Increments views)
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product && !product.isDeleted) {
            // Increment view count asynchronously
            product.views = (product.views || 0) + 1;
            await product.save();

            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Fetch similar products based on category/subCategory
// @route   GET /api/products/:id/similar
// @access  Public
router.get('/:id/similar', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            const similar = await Product.find({
                _id: { $ne: product._id },
                category: product.category,
                isDeleted: { $ne: true }
            }).limit(4);
            res.json(similar);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            images,
            videoUrl,
            category,
            subCategory,
            sizes,
            colors,
            stock,
            sku,
            brand,
            featured,
            bestSeller,
            newArrival,
            tags
        } = req.body;

        const productExists = await Product.findOne({ sku });
        if (productExists) {
            return res.status(400).json({ message: 'Product with this SKU already exists' });
        }

        const product = new Product({
            name,
            description,
            price,
            discountPrice: discountPrice || 0,
            images,
            videoUrl,
            category: category.toLowerCase(),
            subCategory: subCategory.toLowerCase(),
            sizes,
            colors,
            stock: stock || 0,
            sku,
            brand: brand || 'Veloura',
            featured: featured || false,
            bestSeller: bestSeller || false,
            newArrival: newArrival !== undefined ? newArrival : true,
            tags: tags || []
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = req.body.name || product.name;
            product.description = req.body.description || product.description;
            product.price = req.body.price !== undefined ? req.body.price : product.price;
            product.discountPrice = req.body.discountPrice !== undefined ? req.body.discountPrice : product.discountPrice;
            product.images = req.body.images || product.images;
            product.videoUrl = req.body.videoUrl || product.videoUrl;
            product.category = req.body.category ? req.body.category.toLowerCase() : product.category;
            product.subCategory = req.body.subCategory ? req.body.subCategory.toLowerCase() : product.subCategory;
            product.sizes = req.body.sizes || product.sizes;
            product.colors = req.body.colors || product.colors;
            product.stock = req.body.stock !== undefined ? req.body.stock : product.stock;
            product.sku = req.body.sku || product.sku;
            product.brand = req.body.brand || product.brand;
            product.featured = req.body.featured !== undefined ? req.body.featured : product.featured;
            product.bestSeller = req.body.bestSeller !== undefined ? req.body.bestSeller : product.bestSeller;
            product.newArrival = req.body.newArrival !== undefined ? req.body.newArrival : product.newArrival;
            product.tags = req.body.tags || product.tags;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a product (Admin only, soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.isDeleted = true;
            await product.save();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
