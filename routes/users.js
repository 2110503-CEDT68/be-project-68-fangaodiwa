const express = require('express');
const { updateUserTier } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ต้อง Login และเป็น admin เท่านั้น
router.use(protect);
router.use(authorize('admin'));

router.route('/:id/tier').put(updateUserTier);

module.exports = router;