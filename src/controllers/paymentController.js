

const axios = require("axios");
const Payment = require("../models/PaymentModel");
const Course = require("../models/CourseModel");
const User = require("../models/UserModel");
const { v4: uuidv4 } = require("uuid");
const SSLCommerzPayment = require("sslcommerz-lts");

// exports.initPayment = async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.user.uid });
//     const { courseId } = req.body;

//     const course = await Course.findById(courseId);
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     // Already enrolled?
//     if (
//       user.enrolledCourses.some(id => id.toString() === courseId)
//     ) {
//       return res.status(400).json({ message: "Already enrolled" });
//     }

//     const transactionId = uuidv4();

//     await Payment.create({
//       user: user._id,
//       course: courseId,
//       transactionId,
//       amount: course.price,
//     });

//     const payload = {
//       store_id:'scien69616c550c5e5',
//       store_passwd:'scien69616c550c5e5@ssl',
//       total_amount: course.price,
//       currency: "BDT",
//       tran_id: transactionId,
//       success_url: `${process.env.SERVER_URL}/api/payment/success`,
//       fail_url: `${process.env.SERVER_URL}/api/payment/fail`,
//       cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
//       ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
//       cus_name: user.name,
//       cus_email: user.email,
//       cus_add1: "Bangladesh",
//       cus_phone: user.phone || "01700000000",
//       product_name: course.title,
//       product_category: "Education",
//       product_profile: "general",
//     };

//     const response = await axios.post(
//       `${process.env.SSLCOMMERZ_BASE_URL}/gwprocess/v4/api.php`,
//       payload
//     );
//     console.log(response.data);
//     res.json({ paymentUrl: response.data.GatewayPageURL });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


exports.initPayment = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Already enrolled check
    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const transactionId = uuidv4();

    await Payment.create({
      user: user._id,
      course: courseId,
      transactionId,
      amount: course.price,
      // status: "PENDING",
    });

    const data = {
      total_amount: course.price,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.SERVER_URL}/api/payment/success`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
      ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
      shipping_method: "NO",

      product_name: course.title,
      product_category: "Education",
      product_profile: "general",

      cus_name: user.name,
      cus_email: user.email,
      cus_add1: "Bangladesh",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: user.phone || "01700000000",
   
    };

    const sslcz = new SSLCommerzPayment(
      process.env.SSLCOMMERZ_STORE_ID,
      process.env.SSLCOMMERZ_STORE_PASSWORD,
      false // sandbox
    );

    const apiResponse = await sslcz.init(data);

    // console.log(apiResponse);

    return res.json({
      paymentUrl: apiResponse.GatewayPageURL,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};