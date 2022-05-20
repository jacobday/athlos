import axios from "axios";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

export var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}

export const fetchFacilities = async () => {
  try {
    var result = [];

    await axios.get(`${api_url}/facilities`).then((res) => {
      for (let fac of res.data) {
        const facData = {
          uniqFacId: fac.facilityId,
          facilityName: fac.facilityName,
          facilityLocation: (
            fac.facilityLocation.city +
            "," +
            fac.facilityLocation.state
          ).trim(),
          facilitySport: fac.facilitySports,
          facilityInfo: fac.facilityInformation,
          availableNow: false,
          reservationPeriodStart: parseInt(fac.reservationPeriodStart),
          reservationPeriodEnd: parseInt(fac.reservationPeriodEnd),
          latitude: fac.latitude,
          longitude: fac.longitude,
        };

        result.push(facData);
      }
    });

    return result;
  } catch (e) {
    return [];
  }
};

export const fetchPromotions = async () => {
  try {
    var result = [];

    await axios.get(`${api_url}/promotion/promos`).then((res) => {
      for (let promo of res.data) {
        const promoData = {
          id: promo._id,
          promotionCode: promo.promotionCode,
          promotionEnd: promo.promotionEnd,
          promotionInfo: promo.promotionInfo,
          promotionName: promo.promotionName,
          promotionPercentage: promo.promotionPercentage,
          promotionStart: promo.promotionStart,
        };

        result.push(promoData);
      }
    });

    return result;
  } catch (e) {
    return [];
  }
};

export const fetchMyBookings = async () => {
  try {
    return await axios.post(`${api_url}/book/userbookings`, {
      data: {
        email: "this.props.userEmail",
      },
    });
  } catch (e) {
    return "";
  }
};

export const fetchInterests = async () => {
  try {
    return await axios.post(`${api_url}/interests/userinterests`, {
      data: {
        email: "this.props.userEmail",
      },
    });
  } catch (e) {
    return "";
  }
};
