

const express = require("express");
const router = express.Router();
const firebaseAuth = require("../middlewares/authMiddlewares");
const {
  initPayment,
} = require("../controllers/paymentController");
const {
  paymentSuccess,
  paymentIPN,
  paymentFail,
  paymentCancel,
} = require("../controllers/paymentCallbackController");

router.post("/init", firebaseAuth, initPayment);
router.post("/success", paymentSuccess);
router.post("/ipn", paymentIPN);
router.post("/fail", paymentFail);
router.post("/cancel", paymentCancel);




module.exports = router;
