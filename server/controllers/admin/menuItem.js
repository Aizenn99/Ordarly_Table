const menuitem = require("../../models/menuitem");

const addMenu = async (req, res) => {
  try {
    const { imageURL, title, description, category, subcategory, price } =
      req.body;

    const menuItem = new menuitem({
      imageURL,
      title,
      description,
      category,
      subcategory,
      price,
    });
    await menuItem.save();

    res.status(200).json({
      success: true,
      message: "Menu item added successfully!",
      menuItem,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ success: false, message: "Error adding menu item" });
  }
};

const fetchAllMenuItems = async (req, res) => {
  try {
    const listOfMenuItems = await menuitem.find();
    res.status(200).json({
      success: true,
      message: "Menu items fetched successfully!",
      listOfMenuItems,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching menu items" });
  }
};

const EditMenuItem = async (req, res) => {
  try {
    const id = req.params.id;
    const { imageURL, title, description, category, subcategory, price } =
      req.body;

    let findMenuItem = await menuitem.findById(id);
    findMenuItem.imageURL = imageURL || findMenuItem.imageURL;
    findMenuItem.title = title || findMenuItem.title;
    findMenuItem.description = description || findMenuItem.description;
    findMenuItem.category = category || findMenuItem.category;
    findMenuItem.subcategory = subcategory || findMenuItem.subcategory;
    findMenuItem.price = price === "" ? 0 : price || findMenuItem.price;

    await findMenuItem.save();
    res.status(200).json({
      success: true,
      message: "Menu item edited successfully!",
      findMenuItem,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error editing menu item" });
  }
};

const deleteMenuItem = async (req, res) => {
    try {
        const id = req.params.id;
        const menuItem = await menuitem.findByIdAndDelete(id);
        if (!menuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }
        res.status(200).json({ success: true, message: "Menu item deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting menu item" });
    }
}

module.exports = {
  addMenu,
  fetchAllMenuItems,
  EditMenuItem,
  deleteMenuItem
};
