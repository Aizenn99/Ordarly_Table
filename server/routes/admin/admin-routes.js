const express = require("express");
const router = express.Router();
const { addMenu ,fetchAllMenuItems,EditMenuItem,deleteMenuItem} = require("../../controllers/admin/menuItem");
const upload = require("../../controllers/admin/uploadMiddleWare");

router.post("/add-menu", addMenu);
router.get("/fetch-menu", fetchAllMenuItems);
router.put("/update-menu/:id", EditMenuItem);
router.delete("/delete-menu/:id", deleteMenuItem);

router.post("/upload-image", upload.single("image"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;


    res.status(200).json({ message: "File uploaded successfully", imageUrl });
  });

module.exports = router;
