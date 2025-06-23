const Bill = require("../../models/Bill");
const ItemCart = require("../../models/ItemCart");
const MenuItem = require("../../models/menuitem");
const {getNextBillNumber} = require("../../helper/utils")


exports.generateBill = async (req, res) => {
  try {
    const { tableName, spaceName } = req.body;

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

      const billNumber = await getNextBillNumber(); // this should return new one every time

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
      });

      try {
        await bill.save();
        break; // success!
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


// 2. Get all bills
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json(bills);
  } catch (error) {
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

    const bill = await Bill.findOneAndUpdate(
      { billNumber: parseInt(billNumber) },
      { status: "PAID" },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // ✅ Emit updated bill through socket
    const io = req.app.get("io");
    io.emit("bill-paid", bill); // <-- send full updated bill

    res.status(200).json({ message: "Bill marked as PAID", bill });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 5. Delete a bill (if needed)
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
