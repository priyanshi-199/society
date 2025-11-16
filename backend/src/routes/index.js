const express = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const noticeRoutes = require('./noticeRoutes');
const maintenanceRoutes = require('./maintenanceRoutes');
const complaintRoutes = require('./complaintRoutes');
const pollRoutes = require('./pollRoutes');
const visitorRoutes = require('./visitorRoutes');
const paymentRoutes = require('./paymentRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const communityRoutes = require('./communityRoutes');
const chatbotRoutes = require('./chatbotRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/notices', noticeRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/complaints', complaintRoutes);
router.use('/polls', pollRoutes);
router.use('/visitors', visitorRoutes);
router.use('/payments', paymentRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/community', communityRoutes);
router.use('/chatbot', chatbotRoutes);

module.exports = router;

