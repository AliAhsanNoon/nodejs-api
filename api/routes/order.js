const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .then((result) => {
      const response = {
        count: { totalRecords: result.length },
        products: result.map((data) => {
          return {
            quantity: data.name,
            product: data.product,
            _id: data._id,
            request: {
              url: "http://localhost:3000/orders/" + data._id,
              type: "GET",
            },
          };
        }),
      };
      res.json(response);
    })
    .catch((err) => res.json({ message: err }));
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product Not Found" });
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      res.json({ message: "Order saved scuccessfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: error });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Product.findById(id)
    .select("quantity product _id")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json({ message: error }));
});

router.patch("/:oId", (req, res, next) => {
  const id = req.params.oId;
  const updateOps = {
    quantity: req.body.quantity,
    product: req.body.product,
  };

  Order.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/:oId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.oId })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("Error Occured While Deleting the Record");
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
