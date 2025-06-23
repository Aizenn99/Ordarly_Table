const KitchenOrder = require("../../models/KitchenOrder");
const {getNextKOTNumber} = require("../../helper/utils");
const Cart = require("../../models/ItemCart");

// @desc   Send order to kitchen
// @route  POST /api/kitchen/send
// @access Public (or protect later if needed)
exports.sendToKitchen = async (req, res) => {
  try {
    const { tableName, spaceName, guestCount, items, username } = req.body;

    if (!tableName || !spaceName || !guestCount || !items || !username) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const kotNumber = await getNextKOTNumber();

    const newOrder = await KitchenOrder.create({
      kotNumber,
      tableName,
      spaceName,
      guestCount,
      items,
      username,
    });

    // Emit to kitchen via socket.io (optional)
    if (req.io) {
      req.io.emit("new-kot", newOrder);
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error sending to kitchen:", error);
    res.status(500).json({ error: "Failed to send order to kitchen." });
  }
};

exports.markKOTItemsSent = async (req, res) => {
  const { tableName } = req.params;

  try {
    const cart = await Cart.findOne({ tableName });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(404).json({ error: "Cart not found or empty" });
    }

    cart.items.forEach((item) => {
      // Update sentQuantity only if new quantity is added
      if (item.quantity > item.sentQuantity) {
        item.sentQuantity = item.quantity;
      }
    });

    await cart.save();

    return res.status(200).json({ message: "Items marked as sent to kitchen" });
  } catch (error) {
    console.error("Failed to mark KOT items:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};



// @desc   Get all pending/preparing kitchen orders
// @route  GET /api/kitchen/orders
exports.getKitchenOrders = async (req, res) => {
  try {
    const orders = await KitchenOrder.find({
      status: { $in: ["pending", "preparing"] },
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching kitchen orders:", error);
    res.status(500).json({ error: "Failed to fetch kitchen orders." });
  }
};

// @desc   Update status of a KOT (e.g., to 'preparing' or 'ready')
// @route  PATCH /api/kitchen/:kotNumber/status
exports.updateKOTStatus = async (req, res) => {
  try {
    const { kotNumber } = req.params;
    const { status } = req.body;

    const validStatus = ["pending", "preparing", "ready"];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const updatedOrder = await KitchenOrder.findOneAndUpdate(
      { kotNumber },
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Kitchen Order not found." });
    }

    // Notify staff when ready
    if (status === "ready" && req.io) {
      req.io.emit("kot-ready", {
        kotNumber: updatedOrder.kotNumber,
        username: updatedOrder.username,
        message: `Order for table ${updatedOrder.tableName} is ready.`,
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating KOT status:", error);
    res.status(500).json({ error: "Failed to update order status." });
  }
};
