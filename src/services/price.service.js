const Offer = require("../models/Offer");

const getFinalPrice = async (item) => {

const now = new Date();

const offer = await Offer.findOne({
$or: [
{ items: item._id },
{ combos: item._id }
],
isActive: true,
startDate: { $lte: now },
endDate: { $gte: now }
});

if (!offer) return item.basePrice;

if (offer.discountType === "PERCENTAGE") {
return item.basePrice - (item.basePrice * offer.discountValue / 100);
}

if (offer.discountType === "FLAT") {
return item.basePrice - offer.discountValue;
}

return item.basePrice;
};

module.exports = { getFinalPrice };