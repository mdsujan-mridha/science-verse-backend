const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String, // Cloudinary URL
      
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
      default: 0,
    },

    isFree: {
      type: Boolean,
      default: false,
    },

    level: {
      type: String,
      enum: ["SSC", "HSC", "Admission"],
      required: true,
    },

    subject: {
      type: String,
      enum: ["Physics", "Chemistry", "Math", "ICT"],
      required: true,
    },

    totalLessons: {
      type: Number,
      default: 1,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    studentsCount: {
      type: Number,
      default: 1,
    },
    chapters: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chapter",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
