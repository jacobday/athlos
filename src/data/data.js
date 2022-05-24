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

export const fetchMyBookings = async (userEmail) => {
  try {
    var result = [];

    await axios
      .post(`${api_url}/book/userbookings`, {
        email: userEmail,
      })
      .then((res) => {
        for (let booking of res.data) {
          const bookingData = {
            uniqBookingId: booking._id,
            gear: booking.gear,
            upgrade: booking.upgrade,
            intime: booking.intime,
            outtime: booking.outtime,
            facilityLocation: booking.facility_info.facilityLocation,
            latitude: booking.facility_info.latitude,
            longitude: booking.facility_info.longitude,
            facilitySport: booking.facility_info.facilitySports,
            facilityName: booking.facility_info.facilityName,
            facilityInfo: booking.facility_info.facilityInformation,
            totalAmount: booking.totalAmount,
          };

          result.push(bookingData);
        }
      });

    return result;
  } catch (e) {
    return [];
  }
};

export const fetchInterests = async (userEmail) => {
  try {
    var result = [];

    await axios
      .post(`${api_url}/interests/userinterests`, {
        email: userEmail,
      })
      .then((res) => {
        result = res.data[0].interest;
      });

    return result;
  } catch (e) {
    return [];
  }
};

export const fetchPayMethods = async (userEmail) => {
  try {
    var result = [];

    await axios
      .post(`${api_url}/payment/getpaymethod`, {
        email: userEmail,
      })
      .then((res) => {
        for (let method of res.data) {
          result.push(method);
        }
      });

    return result;
  } catch (e) {
    return [];
  }
};
