const Bill = require("../../models/Bill");
const ItemCart = require("../../models/ItemCart");
const MenuItem = require("../../models/menuitem");
const { getNextBillNumber } = require("../../helper/utils");

// 1. Generate Bill
exports.generateBill = async (req, res) => {
  try {
    const { tableName, spaceName, paymentMethod } = req.body;

    if (!tableName || !spaceName || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    console.log("Generating bill for table:", tableName, "in space:", spaceName);

    const cart = await ItemCart.findOne({ tableName }).populate("items.itemId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "No items found for this table" });
    }

    const itemDetails = cart.items.map((item) => ({
      itemName: item.itemId.title,
      quantity: item.quantity,
      unitPrice: item.itemId.price,
      totalPrice: item.quantity * item.itemId.price,
    }));

    const subtotal = itemDetails.reduce((sum, i) => sum + i.totalPrice, 0);
    const charges = subtotal * 0.05;
    const totalAmount = subtotal + charges;

    let bill;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;

      const billNumber = await getNextBillNumber();

      bill = new Bill({
        billNumber,
        tableName,
        spaceName,
        guestCount: cart.guestCount,
        items: itemDetails,
        subtotal,
        charges,
        totalAmount,
        status: "UNPAID",
        paymentMethod,
        createdBy: req.user?.userName, // ✅ Add creator
      });
   
      try {
        await bill.save();
        break;
      } catch (err) {
        if (err.code === 11000) {
          console.warn(`⚠️ Duplicate billNumber: ${billNumber}, retrying...`);
        } else {
          throw err;
        }
      }
    }

    if (attempts === maxAttempts) {
      return res.status(500).json({ message: "Could not generate unique bill number" });
    }

    await ItemCart.deleteOne({ tableName });

    const io = req.app.get("io");
    io.emit("new-bill", bill);

    res.status(201).json({ message: "Bill generated", bill });
  } catch (error) {
    console.error("Error generating bill:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 2. Get Bills Only Created By Logged-In Staff
exports.getAllBills = async (req, res) => {
  try {
    console.log("🔐 Authenticated user in getAllBills:", req.user);

    const userName = req.user?.userName;
    if (!userName) {
      console.warn("❌ No userName found in req.user");
      return res.status(401).json({ message: "Unauthorized: No user info" });
    }

    const bills = await Bill.find({ createdBy: userName }).sort({ createdAt: -1 });

    console.log(`🎯 Found ${bills.length} bills for user: ${userName}`);

    res.status(200).json(bills);
  } catch (error) {
    console.error("❌ Error fetching staff bills:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// 3. Get all bills
exports.getAllBillsAdmin = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
    console.error("Error fetching staff bills:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 3. Get bill by billNumber
exports.getBillByNumber = async (req, res) => {
  try {
    const { billNumber } = req.params;
    const bill = await Bill.findOne({ billNumber: parseInt(billNumber) });

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json(bill);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 4. Mark bill as PAID
exports.markBillAsPaid = async (req, res) => {
  try {
    const { billNumber } = req.params;
    const { paymentMethod } = req.body;

    if (!["CASH", "UPI", "CARD", "CREDIT"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid or missing payment method" });
    }

    const bill = await Bill.findOneAndUpdate(
      { billNumber: parseInt(billNumber) },
      { status: "PAID", paymentMethod },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    const io = req.app.get("io");
    io.emit("bill-paid", bill);
    io.emit("dashboard:update");

    res.status(200).json({ message: "Bill marked as PAID", bill });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 5. Delete a bill
exports.deleteBill = async (req, res) => {
  try {
    const { billNumber } = req.params;
    const result = await Bill.findOneAndDelete({
      billNumber: parseInt(billNumber),
    });

    if (!result) {
      return res.status(404).json({ message: "Bill not found" });
    }

    res.status(200).json({ message: "Bill deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
