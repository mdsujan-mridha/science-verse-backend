

const Payment = require("../models/PaymentModel");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");

exports.paymentSuccess = async (req, res) => {
  try {
    const { tran_id } = req.body;

    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment || payment.status === "success") {
      return res.redirect("/payment-failed");
    }

    payment.status = "success";
    await payment.save();

    const user = await User.findById(payment.user);
    const course = await Course.findById(payment.course);

    user.enrolledCourses.push(course._id);
    course.studentsCount += 1;

    await user.save();
    await course.save();

    res.redirect("/payment-success");
  } catch (error) {
    res.redirect("/payment-failed");
  }
};


exports.paymentIPN = async (req, res) => {
  try {
    const { tran_id, status } = req.body;

    if (status !== "VALID") return res.send("FAILED");

    const payment = await Payment.findOne({ transactionId: tran_id });
    if (!payment || payment.status === "success") {
      return res.send("OK");
    }

    payment.status = "success";
    await payment.save();

    const user = await User.findById(payment.user);
    const course = await Course.findById(payment.course);

    user.enrolledCourses.push(course._id);
    course.studentsCount += 1;

    await user.save();
    await course.save();

    res.send("OK");
  } catch {
    res.send("FAILED");
  }
};
