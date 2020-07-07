const mongoose = require("mongoose");

const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quantity: Number,
});

module.exports = mongoose.model("Orders", OrderSchema);
