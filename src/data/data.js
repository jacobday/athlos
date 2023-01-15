import axios from "axios";
import FacilityData from "./FacilityData/FacilityData";
import MyBookingsData from "./MyBookingsData/MyBookingsData";
import PromotionData from "./PromotionData/PromotionData";
import ReservedSlotsData from "./ReservedSlotsData/ReservedSlotsData";

const { REACT_APP_LOCAL_URL, REACT_APP_PRODUCTION_URL } = process.env;

export var api_url;
if (process.env.NODE_ENV === "production") {
  api_url = REACT_APP_PRODUCTION_URL;
} else {
  api_url = REACT_APP_LOCAL_URL;
}

export const fetchFacilities = async () => {
  try {
    let result = [];

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
    let result = [];

    for (let fac of FacilityData) {
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

    // Return offline data
    return result;
  }
};

export const fetchPromotions = async () => {
  try {
    let result = [];

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
    // Return offline data
    return PromotionData;
  }
};

export const fetchMyBookings = async (userEmail) => {
  try {
    let result = [];

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
    let result = [];

    for (let booking of MyBookingsData) {
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

    // Return offline data
    return result;
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

export const fetchReservedSlots = async () => {
  try {
    let result = {};

    await axios.get(`${api_url}/book/booked_slots`).then((res) => {
      for (let slot of res.data) {
        if (result[slot.facilityID] === undefined) {
          result[slot.facilityID] = [slot.intime];
        } else {
          result[slot.facilityID].push(slot.intime);
        }
      }
    });

    return result;
  } catch (e) {
    let result = {};

    for (let slot of ReservedSlotsData) {
      if (result[slot.facilityID] === undefined) {
        result[slot.facilityID] = [slot.intime];
      } else {
        result[slot.facilityID].push(slot.intime);
      }
    }

    return result;
  }
};
