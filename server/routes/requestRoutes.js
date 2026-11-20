const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getSentRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendRequest);
router.get('/sent', protect, getSentRequests);
router.get('/received', protect, getReceivedRequests);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);

module.exports = router;
