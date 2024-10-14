// import mongoose from "mongoose";

// const ComplaintSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   date: { type: Date, default: Date.now },
//   subject: { type: String, required: true },
//   description: { type: String, required: true },
//   status: {
//     type: String,
//     enum: ["open", "in-progress", "closed"],
//     default: "open",
//   },
//   attachment: { type: String }, // URL or path to the uploaded file
// });

// export default mongoose.models.Complaint ||
//   mongoose.model("Complaint", ComplaintSchema);

import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: "open",
  },
  attachment: {
    name: String,
    data: Buffer,
    contentType: String,
  },
});

export default mongoose.models.Complaint ||
  mongoose.model("Complaint", ComplaintSchema);
