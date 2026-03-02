const User = require('../models/User');

// @desc    Update user tier
// @route   PUT /api/v1/users/:id/tier
// @access  Private (Admin only)
exports.updateUserTier = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { tier: req.body.tier },
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.name} has been upgraded to ${user.tier}`,
            data: user
        });
    } catch (err) {
        console.log(err.stack);
        res.status(400).json({ success: false });
    }
};