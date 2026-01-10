

const Payment = require("../models/PaymentModel");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");

// exports.paymentSuccess = async (req, res) => {
//   try {
//     const { tran_id } = req.body;

//     const payment = await Payment.findOne({ transactionId: tran_id });
//     if (!payment || payment.status === "success") {
//       return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
//     }

//     payment.status = "success";
//     await payment.save();

//     const user = await User.findById(payment.user);
//     const course = await Course.findById(payment.course);

//     user.enrolledCourses.push(course._id);
//     course.studentsCount += 1;

//     await user.save();
//     await course.save();

//     res.redirect(
//       `${process.env.CLIENT_URL}/payment-success?tran_id=${tran_id}`
//     );
//   } catch (error) {
//      return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
//   }
// };

exports.paymentSuccess = async (req, res) => {
  try {
    // console.log("Payment Success Data:", req.body);

    const tranId = req.body.tran_id;

    if (!tranId) {
      return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }

    const payment = await Payment.findOne({ transactionId: tranId });

    if (!payment) {
      return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
    }

    // prevent duplicate success hit
    if (payment.status === "success") {
      return res.redirect(
        `${process.env.CLIENT_URL}/payment-success?tran_id=${tranId}`
      );
    }

    payment.status = "success";
    await payment.save();

    await User.findByIdAndUpdate(payment.user, {
      $addToSet: { enrolledCourses: payment.course },
    });

    await Course.findByIdAndUpdate(payment.course, {
      $inc: { studentsCount: 1 },
    });

    return res.redirect(
      `${process.env.CLIENT_URL}/payment-success?tran_id=${tranId}`
    );
  } catch (error) {
    console.error("Payment Success Error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
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


exports.paymentFail = async (req, res) => {
  const { tran_id } = req.body;

  await Payment.findOneAndUpdate(
    { transactionId: tran_id },
    { status: "FAILED" }
  );

  res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
};


exports.paymentCancel = async (req, res) => {
  const { tran_id } = req.body;

  await Payment.findOneAndUpdate(
    { transactionId: tran_id },
    { status: "CANCELLED" }
  );

  res.redirect(`${process.env.CLIENT_URL}/payment-cancelled`);
};
