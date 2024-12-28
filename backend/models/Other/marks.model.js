const mongoose = require("mongoose");

const Marks = new mongoose.Schema({
  enrollmentNo: {
    type: Number,
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  internal: {
    type: Number, 
    required: true,
  },
  external: {
    type: Number, 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Mark", Marks);
