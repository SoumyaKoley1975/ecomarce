import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import Review from './models/Review.js';
import Order from './models/Order.js';

dotenv.config();
connectDB();

const initialProducts = [
    // Men's Collection
    {
        name: 'Minimalist Relaxed Fit Trench Coat',
        description: 'Double-breasted long trench coat crafted from a water-repellent organic cotton blend. Features side pockets, adjustable button cuffs, and a classic tie belt. Inspired by clean Scandinavian design. Perfect for transitioning seasons.',
        price: 189.00,
        discountPrice: 159.00,
        images: [
            'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'men',
        subCategory: 'outerwear',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Khaki Beige', hex: '#C3B091' },
            { name: 'Obsidian Black', hex: '#111111' }
        ],
        stock: 12,
        sku: 'VEL-M-TC-001',
        brand: 'Veloura Core',
        ratings: 4.8,
        numReviews: 12,
        featured: true,
        bestSeller: true,
        newArrival: true,
        tags: ['coat', 'premium', 'minimal', 'winter']
    },
    {
        name: 'Heavyweight Supima Cotton Tee',
        description: 'Made from 100% extra-long staple Supima cotton for unparalleled softness and durability. Features dynamic structured drape and resilient crewneck collar.',
        price: 39.00,
        discountPrice: 0,
        images: [
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'men',
        subCategory: 'shirts',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        colors: [
            { name: 'Pure White', hex: '#FFFFFF' },
            { name: 'Slate Gray', hex: '#708090' },
            { name: 'Midnight Navy', hex: '#1E3F66' }
        ],
        stock: 45,
        sku: 'VEL-M-TEE-002',
        brand: 'Veloura Basics',
        ratings: 4.7,
        numReviews: 24,
        featured: false,
        bestSeller: true,
        newArrival: false,
        tags: ['t-shirt', 'basics', 'cotton', 'comfort']
    },
    {
        name: 'Structured Crop Premium Denim Jacket',
        description: 'An iconic silhouette reconstructed with raw organic self-selvedge Japanese denim. Heavyweight 14oz build that forms to your silhouette with time.',
        price: 135.00,
        discountPrice: 120.00,
        images: [
            'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'men',
        subCategory: 'outerwear',
        sizes: ['S', 'M', 'L'],
        colors: [
            { name: 'Indigo Wash', hex: '#3B5998' }
        ],
        stock: 14,
        sku: 'VEL-M-DJ-003',
        brand: 'Veloura Denim',
        ratings: 4.6,
        numReviews: 9,
        featured: true,
        bestSeller: false,
        newArrival: true,
        tags: ['jacket', 'denim', 'blue', 'casual']
    },

    // Women's Collection
    {
        name: 'Silk Blend Asymmetric Slip Dress',
        description: 'Elevated slip dress designed in a lustrous silk-viscose blend. Asymmetrical bias drape with low scoop back and fine shoulder straps. Sleek and glamorous.',
        price: 145.00,
        discountPrice: 0,
        images: [
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'women',
        subCategory: 'dresses',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
            { name: 'Champagne Gold', hex: '#F1E9D2' },
            { name: 'Emerald Forest', hex: '#0B6623' },
            { name: 'Classic Black', hex: '#000000' }
        ],
        stock: 22,
        sku: 'VEL-W-SD-004',
        brand: 'Veloura Evening',
        ratings: 4.9,
        numReviews: 18,
        featured: true,
        bestSeller: true,
        newArrival: true,
        tags: ['dress', 'silk', 'formal', 'party']
    },
    {
        name: 'Oversized Wool Blend Knit Sweater',
        description: 'Cozy and warm knit sweater containing alpaca and wool fibres. Crafted with a soft ribbed crew neck and voluminous sleeves for an architectural shape.',
        price: 98.00,
        discountPrice: 79.00,
        images: [
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'women',
        subCategory: 'outerwear',
        sizes: ['S', 'M', 'L'],
        colors: [
            { name: 'Cream Ivory', hex: '#FFFFF0' },
            { name: 'Rose Quartz', hex: '#F7CAC9' }
        ],
        stock: 19,
        sku: 'VEL-W-KS-005',
        brand: 'Veloura Knits',
        ratings: 4.5,
        numReviews: 14,
        featured: false,
        bestSeller: false,
        newArrival: true,
        tags: ['knitwear', 'warm', 'sweater', 'autumn']
    },
    {
        name: 'Tailored High Waist Pleated Trousers',
        description: 'High-waisted trousers with sharp front pleats and a relaxed wide leg. Tailored from a premium Italian bi-stretch wool blend. Elevates office style.',
        price: 115.00,
        discountPrice: 0,
        images: [
            'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1200&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'women',
        subCategory: 'jeans',
        sizes: ['XS', 'S', 'M', 'L'],
        colors: [
            { name: 'Taupe Gray', hex: '#B38B6D' },
            { name: 'Onyx Black', hex: '#0F0F0F' }
        ],
        stock: 16,
        sku: 'VEL-W-PT-006',
        brand: 'Veloura Workwear',
        ratings: 4.7,
        numReviews: 8,
        featured: true,
        bestSeller: true,
        newArrival: false,
        tags: ['trousers', 'formal', 'high-wait', 'office']
    },

    // Kids Collection
    {
        name: 'Organic Cotton Breton Striped Set',
        description: 'Cozy two-piece set featuring a long-sleeve Breton striped tee and knit bottoms. Made from 100% GOTS certified premium organic cotton. Gentle on sensitive skin.',
        price: 49.00,
        discountPrice: 39.00,
        images: [
            'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'kids',
        subCategory: 'shirts',
        sizes: ['2T', '3T', '4T', '5T'],
        colors: [
            { name: 'Nautical Navy', hex: '#002060' }
        ],
        stock: 30,
        sku: 'VEL-K-BS-007',
        brand: 'Veloura Mini',
        ratings: 4.9,
        numReviews: 15,
        featured: true,
        bestSeller: false,
        newArrival: true,
        tags: ['stripe', 'cotton', 'baby', 'set']
    },
    {
        name: 'Recycled Tech Puffer Vest',
        description: 'Waterproof outer shell insulated with PrimaLoft recycled down-alternative filling. Keeps them warm and moving comfortably through the snow and wind.',
        price: 65.00,
        discountPrice: 0,
        images: [
            'https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?q=80&w=1200&auto=format&fit=crop'
        ],
        category: 'kids',
        subCategory: 'outerwear',
        sizes: ['3T', '4T', '5T', '6-7Y'],
        colors: [
            { name: 'Mustard Yellow', hex: '#E1AD01' },
            { name: 'Hunter Green', hex: '#355E3B' }
        ],
        stock: 25,
        sku: 'VEL-K-PV-008',
        brand: 'Veloura Active',
        ratings: 4.8,
        numReviews: 11,
        featured: false,
        bestSeller: true,
        newArrival: true,
        tags: ['vest', 'jacket', 'puffer', 'winter']
    }
];

const initialCoupons = [
    {
        code: 'VELOURA10',
        discountType: 'percentage',
        discountAmount: 10,
        minPurchaseAmount: 50,
        expireDate: new Date('2027-12-31')
    },
    {
        code: 'FIRST20',
        discountType: 'fixed',
        discountAmount: 20,
        minPurchaseAmount: 100,
        expireDate: new Date('2027-12-31')
    },
    {
        code: 'FLASH30',
        discountType: 'percentage',
        discountAmount: 30,
        minPurchaseAmount: 150,
        expireDate: new Date('2026-12-31')
    }
];

const importData = async () => {
    try {
        // Clear existing DB collections
        await User.deleteMany();
        await Product.deleteMany();
        await Coupon.deleteMany();
        await Review.deleteMany();
        await Order.deleteMany();

        console.log('Database Cleared...');

        // Create Admin User
        const adminUser = await User.create({
            name: 'Executive Admin',
            email: 'admin@veloura.com',
            password: 'veloura_admin_secure',
            role: 'admin'
        });

        // Create Demo User
        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('Users Seeded (Admin: admin@veloura.com / veloura_admin_secure)...');

        // Create Products
        await Product.insertMany(initialProducts);
        console.log('Products Seeded...');

        // Create Coupons
        await Coupon.insertMany(initialCoupons);
        console.log('Coupons Seeded...');

        // Add some random reviews to the first product to calculate averages
        const firstProduct = await Product.findOne({ sku: 'VEL-M-TC-001' });
        if (firstProduct) {
            await Review.create({
                product: firstProduct._id,
                user: adminUser._id,
                name: 'Alex Mercer',
                rating: 5,
                comment: 'Absolutely stunning drape and fit. Matches high-end brands easily.',
                isApproved: true
            });
            await Review.create({
                product: firstProduct._id,
                user: adminUser._id,
                name: 'Sarah K.',
                rating: 4,
                comment: 'Comfortable fabric and looks premium. Sizing is slightly oversized, I recommend ordering a size down if you prefer a tight fit.',
                isApproved: true
            });
            console.log('Initial Reviews Seeded...');
        }

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error importing data: ${error}`);
        process.exit(1);
    }
};

importData();
