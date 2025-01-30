const mongoose = require("mongoose");
const { Schema } = mongoose;

const monitoringSchema = new Schema(
  {
    eventType: { type: String, required: true }, // Type of event (e.g., "login", "error", "system_metric")
    eventDetails: { type: Schema.Types.Mixed }, // Flexible field for event-specific details
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: Reference to the user involved
    timestamp: { type: Date, default: Date.now }, // When the event occurred
    severity: { type: String, enum: ["low", "medium", "high"] }, // Severity level (optional)
    ipAddress: { type: String }, // IP address of the user or system
    deviceInfo: { type: String }, // Device or browser information
    status: { type: String, enum: ["success", "failure", "warning"] }, // Status of the event
  },
  { timestamps: true } // Automatically add `createdAt` and `updatedAt`
);

module.exports = mongoose.model("Monitoring", monitoringSchema);
