import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Create a new order & deduct stock
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountPrice,
        totalPrice,
        paymentResult
    } = req.body;

    try {
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Double check inventory stock and update it
        for (const item of orderItems) {
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }
            if (dbProduct.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product: ${dbProduct.name}` });
            }
        }

        // Create order
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            discountPrice,
            totalPrice,
            isPaid: paymentMethod === 'COD' ? false : true,
            paidAt: paymentMethod === 'COD' ? null : Date.now(),
            paymentResult: paymentResult || { gateway: paymentMethod.toLowerCase(), status: 'paid' },
            status: 'Pending'
        });

        const createdOrder = await order.save();

        // Deduct stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('orderItems.product', 'images name sku');

        if (order) {
            // Allow user who placed the order or admin to view
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Not authorized to view this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order return status / request return
// @route   PUT /api/orders/:id/return
// @access  Private
router.put('/:id/return', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            if (order.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to request return' });
            }

            order.returnRequest = {
                isRequested: true,
                reason: req.body.reason,
                status: 'Pending',
                requestedAt: Date.now()
            };

            order.status = 'Returned';

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update order status / tracking details (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            order.trackingNumber = req.body.trackingNumber || order.trackingNumber;

            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            if (req.body.status === 'Cancelled') {
                // Restore inventory stock
                for (const item of order.orderItems) {
                    await Product.findByIdAndUpdate(item.product, {
                        $inc: { stock: item.quantity }
                    });
                }
            }

            // If resolving return
            if (req.body.returnStatus && order.returnRequest.isRequested) {
                order.returnRequest.status = req.body.returnStatus;
                if (req.body.returnStatus === 'Approved') {
                    // Additional restock on return approval
                    for (const item of order.orderItems) {
                        await Product.findByIdAndUpdate(item.product, {
                            $inc: { stock: item.quantity }
                        });
                    }
                }
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get sale and revenue dashboard metrics (Admin only)
// @route   GET /api/orders/admin/dashboard
// @access  Private/Admin
router.get('/admin/dashboard', protect, admin, async (req, res) => {
    try {
        // Total Sales & Orders count
        const totalOrders = await Order.countDocuments({});

        // Revenue aggregator
        const revenueData = await Order.aggregate([
            { $match: { isPaid: true, status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

        // Monthly aggregation
        const monthlySales = await Order.aggregate([
            { $match: { isPaid: true, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    sales: { $sum: '$totalPrice' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const recentOrders = await Order.find({})
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalOrders,
            totalRevenue,
            monthlySales,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
