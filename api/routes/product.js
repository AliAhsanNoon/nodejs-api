const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .then((result) => {
      const response = {
        count: { totalRecords: result.length },
        products: result.map((x) => {
          return {
            name: x.name,
            price: x.price,
            _id: x._id,
            request: {
              url: "http://localhost:3000/products/" + x._id,
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
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then((result) => {
      res.json({ message: "Product saved scuccessfully" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: error });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id")
    .then((result) => {
      res.json(result);
    })
    .catch((error) => res.json({ message: error }));
});

router.patch("/:pId", (req, res, next) => {
  const id = req.params.pId;
  const updateOps = {
    name: req.body.name,
    price: req.body.price,
  };

  Product.updateOne({ _id: id }, { $set: updateOps })
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

router.delete("/:pId", (req, res, next) => {
  Product.deleteOne({ _id: req.params.pId })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log("Error Removing Record");
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
