

const express = require("express");
const router = express.Router();
const firebaseAuth = require("../middlewares/authMiddlewares");
const {
  initPayment,
} = require("../controllers/paymentController");
const {
  paymentSuccess,
  paymentIPN,
} = require("../controllers/paymentCallbackController");

router.post("/init",  initPayment);
router.post("/success", paymentSuccess);
router.post("/ipn", paymentIPN);




module.exports = router;
