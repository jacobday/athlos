const PromotionData = [
  {
    _id: { $oid: "00" },
    promotionCode: "ATHLOS10",
    promotionEnd: "2022-09-30",
    promotionInfo: "",
    promotionName: "Summer 10% Off",
    promotionPercentage: { $numberDouble: "0.1" },
    promotionStart: "2022-06-13",
    __v: { $numberInt: "0" },
  },
  {
    _id: { $oid: "01" },
    promotionCode: "ATHL05",
    promotionEnd: "2022-12-31",
    promotionInfo: "Enjoy 5% off your next reservation.",
    promotionName: "5% Off",
    promotionPercentage: { $numberDouble: "0.05" },
    promotionStart: "2022-06-13",
    __v: { $numberInt: "0" },
  },
];

export default PromotionData;
