const express = require("express");
const router = express.Router();
const {
  addOrUpdateItemToCart,
  getCartByTable,
  removeItemFromCart,
} = require("../../controllers/Staff/Cart");
const {
  generateBill,
  getAllBills,
 markBillAsPaid,
 getBillByNumber,
 deleteBill

} = require("../../controllers/Staff/Bill");

// Route to add or update an item in the cart
router.post("/cart/add-up", addOrUpdateItemToCart);
router.get("/cart/:tableName", getCartByTable);
router.post("/cart/remove-item", removeItemFromCart);


router.post("/bill/generate", generateBill);
router.get("/bills", getAllBills);
router.put("/bill/mark-paid/:billNumber", markBillAsPaid);
router.get("/bill/:billNumber", getBillByNumber);
router.delete("/bill/:billNumber", deleteBill);


module.exports = router;
