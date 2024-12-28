const mongoose = require("mongoose");

const studentDetails = new mongoose.Schema(
  {
    enrollmentNo: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    semester: {
      type: Number,
      required: true, // Indicates the current semester of the student
    },
    branch: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    semesterDetails: [
      {
        semesterNumber: {
          type: Number, // Semester number (e.g., 1, 2, 3, etc.)
          required: true,
        },
        sgpa: {
          type: Number,
          required: true,
          min: 0, 
          max: 10,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentDetail", studentDetails);
