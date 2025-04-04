const express = require("express");
const router = express.Router();
const { addMenu ,fetchAllMenuItems,EditMenuItem,deleteMenuItem} = require("../../controllers/admin/menuItem");

router.post("/add-menu", addMenu);
router.get("/fetch-menu", fetchAllMenuItems);
router.put("/update-menu/:id", EditMenuItem);
router.delete("/delete-menu/:id", deleteMenuItem);

module.exports = router;
