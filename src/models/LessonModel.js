const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    videoId: {
      type: String,
      required: true, // YouTube video ID only
    },

    duration: {
      type: String, // "12:35"
    },

    order: {
      type: Number,
      required: true,
    },

    isPreview: {
      type: Boolean,
      default: false, // Free preview lesson
    },

    notes: {
      type: String, // Optional Google Drive / PDF link
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
