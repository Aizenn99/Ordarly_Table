const Counter = require("../models/counter");

const getNextBillNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "billNumber" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return counter.value;
};

module.exports = getNextBillNumber;


const KitchenOrder = require("../models/KitchenOrder");

const getNextKOTNumber = async () => {
  const lastOrder = await KitchenOrder.findOne().sort({ kotNumber: -1 });
  return lastOrder ? lastOrder.kotNumber + 1 : 1000;
};

module.exports = getNextKOTNumber;
