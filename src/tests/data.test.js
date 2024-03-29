import axios from "axios";
import {
  api_url,
  fetchFacilities,
  fetchInterests,
  fetchMyBookings,
  fetchPromotions,
  fetchPayMethods,
  fetchReservedSlots,
} from "../data";
import FacilityData from "../data/FacilityData/FacilityData";
import MyBookingsData from "../data/MyBookingsData/MyBookingsData";
import PromotionData from "../data/PromotionData/PromotionData";
import ReservedSlotsData from "../data/ReservedSlotsData/ReservedSlotsData";

jest.mock("axios");

describe("Fetch data:", () => {
  // Facility Data
  describe("when fetch facilities is successful", () => {
    it("should return facilities array", async () => {
      // given
      const facilities = {
        data: [
          {
            facilityId: 1,
            facilityName: "Student Recreational Sports Center",
            facilityLocation: {
              place_id: "ChIJtxjOXrpmbIgRzbikOxbr4-0",
              city: "Bloomington",
              state: "IN",
              country: "USA",
              street:
                "Student Recreational Sports Center (SRSC), East Law Lane",
            },
            latitude: 39.1734,
            longitude: -86.5123139,
            facilitySports: "Soccer",
            facilityInformation: "Soccer Field A",
            availableNow: false,
            reservationPeriodStart: 13,
            reservationPeriodEnd: 18,
          },
          {
            facilityId: 2,
            facilityName: "UCLA REC",
            facilityLocation: {
              place_id: "ChIJOz-HLIm8woARBQSw84j-Rb8",
              city: "Los Angeles",
              state: "CA",
              country: "USA",
              street: "UCLA REC, Westwood Plaza",
            },
            latitude: 34.071564,
            longitude: -118.44534,
            facilitySports: "Volleyball",
            facilityInformation: "Volleyball Court #02",
            availableNow: false,
            reservationPeriodStart: 8,
            reservationPeriodEnd: 13,
          },
        ],
      };

      axios.get.mockResolvedValueOnce(facilities);

      // when
      const result = await fetchFacilities();

      // then
      const expectedFacilities = [
        {
          uniqFacId: 1,
          facilityName: "Student Recreational Sports Center",
          facilityLocation: "Bloomington,IN",
          latitude: 39.1734,
          longitude: -86.5123139,
          facilitySport: "Soccer",
          facilityInfo: "Soccer Field A",
          availableNow: false,
          reservationPeriodStart: 13,
          reservationPeriodEnd: 18,
        },
        {
          uniqFacId: 2,
          facilityName: "UCLA REC",
          facilityLocation: "Los Angeles,CA",
          latitude: 34.071564,
          longitude: -118.44534,
          facilitySport: "Volleyball",
          facilityInfo: "Volleyball Court #02",
          availableNow: false,
          reservationPeriodStart: 8,
          reservationPeriodEnd: 13,
        },
      ];

      expect(axios.get).toHaveBeenCalledWith(`${api_url}/facilities`);
      expect(result).toEqual(expectedFacilities);
    });
  });

  describe("when fetch facilities fails", () => {
    it("should return offline data", async () => {
      // given
      const message = "Network Error";
      axios.get.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchFacilities();

      // then
      expect(axios.get).toHaveBeenCalledWith(`${api_url}/facilities`);

      let expectedResult = [];

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

        expectedResult.push(facData);
      }

      expect(result).toEqual(expectedResult);
    });
  });

  // Promotion Data
  describe("when fetch promotions is successful", () => {
    it("should return promotions array", async () => {
      // given
      const promotions = {
        data: [
          {
            _id: 1,
            promotionName: "Athlos Test",
            promotionCode: "TEST",
            promotionStart: "2022-01-01",
            promotionEnd: "2024-04-30",
            promotionPercentage: 0,
            promotionInfo: "Receive 0% off.",
          },
          {
            _id: 2,
            promotionName: "5% Off",
            promotionCode: "TEST05",
            promotionStart: "2022-01-31",
            promotionEnd: "2022-12-31",
            promotionPercentage: 0.05,
            promotionInfo: "Enjoy 5% off your next reservation.",
          },
        ],
      };

      axios.get.mockResolvedValueOnce(promotions);

      // when
      const result = await fetchPromotions();

      // then
      const expectedPromotions = [
        {
          id: 1,
          promotionName: "Athlos Test",
          promotionCode: "TEST",
          promotionStart: "2022-01-01",
          promotionEnd: "2024-04-30",
          promotionPercentage: 0,
          promotionInfo: "Receive 0% off.",
        },
        {
          id: 2,
          promotionName: "5% Off",
          promotionCode: "TEST05",
          promotionStart: "2022-01-31",
          promotionEnd: "2022-12-31",
          promotionPercentage: 0.05,
          promotionInfo: "Enjoy 5% off your next reservation.",
        },
      ];

      expect(axios.get).toHaveBeenCalledWith(`${api_url}/promotion/promos`);
      expect(result).toEqual(expectedPromotions);
    });
  });

  describe("when fetch promotions fails", () => {
    it("should return empty array", async () => {
      // given
      const message = "Network Error";
      axios.get.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchPromotions();

      // then
      expect(axios.get).toHaveBeenCalledWith(`${api_url}/promotion/promos`);
      expect(result).toEqual(PromotionData);
    });
  });

  // My Bookings Data
  describe("when fetch my bookings is successful", () => {
    it("should return my bookings array", async () => {
      // given
      const bookings = {
        data: [
          {
            _id: 1,
            facility_info: {
              facilityName: "Student Recreational Sports Center",
              facilityLocation: {
                place_id: "ChIJtxjOXrpmbIgRzbikOxbr4-0",
                city: "Bloomington",
                state: "IN",
                country: "USA",
                street:
                  "Student Recreational Sports Center (SRSC), East Law Lane",
              },
              facilitySports: "Soccer",
              facilityInformation: "Soccer Field A",
              latitude: 39.1734,
              longitude: -86.5123139,
            },
            intime: 11,
            outtime: 12,
            totalAmount: 40.56,
            gear: [
              {
                id: 1,
                itemName: "Soccer Ball",
                itemPrice: 1.75,
                maxItems: 5,
                sportType: "Soccer",
                value: 1,
              },
            ],
            upgrade: [
              {
                id: 2,
                itemName: "Trainer",
                itemPrice: 40,
                maxItems: 1,
                value: 1,
              },
            ],
          },
          {
            _id: 2,
            facility_info: {
              facilityName: "UCLA REC",
              facilityLocation: {
                place_id: "ChIJOz-HLIm8woARBQSw84j-Rb8",
                city: "Los Angeles",
                state: "CA",
                country: "USA",
                street: "UCLA REC, Westwood Plaza",
              },
              latitude: 34.071564,
              longitude: -118.44534,
              facilitySports: "Volleyball",
              facilityInformation: "Volleyball Court 02B",
            },
            intime: 14,
            outtime: 15,
            totalAmount: 0,
            gear: [],
            upgrade: [],
          },
        ],
      };

      axios.post.mockResolvedValueOnce(bookings);

      // when
      const result = await fetchMyBookings("test@athlos.com");

      // then
      const expectedBookings = [
        {
          uniqBookingId: 1,
          facilityName: "Student Recreational Sports Center",

          facilityLocation: {
            place_id: "ChIJtxjOXrpmbIgRzbikOxbr4-0",
            city: "Bloomington",
            state: "IN",
            country: "USA",
            street: "Student Recreational Sports Center (SRSC), East Law Lane",
          },
          facilitySport: "Soccer",
          facilityInfo: "Soccer Field A",
          latitude: 39.1734,
          longitude: -86.5123139,

          intime: 11,
          outtime: 12,
          totalAmount: 40.56,
          gear: [
            {
              id: 1,
              itemName: "Soccer Ball",
              itemPrice: 1.75,
              maxItems: 5,
              sportType: "Soccer",
              value: 1,
            },
          ],
          upgrade: [
            {
              id: 2,
              itemName: "Trainer",
              itemPrice: 40,
              maxItems: 1,
              value: 1,
            },
          ],
        },
        {
          uniqBookingId: 2,
          facilityName: "UCLA REC",
          facilityLocation: {
            place_id: "ChIJOz-HLIm8woARBQSw84j-Rb8",
            city: "Los Angeles",
            state: "CA",
            country: "USA",
            street: "UCLA REC, Westwood Plaza",
          },
          latitude: 34.071564,
          longitude: -118.44534,
          facilitySport: "Volleyball",
          facilityInfo: "Volleyball Court 02B",
          intime: 14,
          outtime: 15,
          totalAmount: 0,
          gear: [],
          upgrade: [],
        },
      ];

      expect(axios.post).toHaveBeenCalledWith(`${api_url}/book/userbookings`, {
        email: "test@athlos.com",
      });
      expect(result).toEqual(expectedBookings);
    });
  });

  describe("when fetch my bookings fails", () => {
    it("should return offline data", async () => {
      // given
      const message = "Network Error";
      axios.post.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchMyBookings("test@athlos.com");

      // then
      expect(axios.post).toHaveBeenCalledWith(`${api_url}/book/userbookings`, {
        email: "test@athlos.com",
      });

      let expectedResult = [];

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

        expectedResult.push(bookingData);
      }

      expect(result).toEqual(expectedResult);
    });
  });

  // Interest Data
  describe("when fetch interests is successful", () => {
    it("should return interests array", async () => {
      // given
      const interests = {
        data: [{ interest: ["Soccer", "Football", "Baseball"] }],
      };
      axios.post.mockResolvedValueOnce(interests);

      // when
      const result = await fetchInterests("test@athlos.com");

      // then
      expect(axios.post).toHaveBeenCalledWith(
        `${api_url}/interests/userinterests`,
        {
          email: "test@athlos.com",
        }
      );
      expect(result).toEqual(interests.data[0].interest);
    });
  });

  describe("when fetch interests fails", () => {
    it("should return empty array", async () => {
      // given
      const message = "Network Error";
      axios.post.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchInterests("test@athlos.com");

      // then
      expect(axios.post).toHaveBeenCalledWith(
        `${api_url}/interests/userinterests`,
        {
          email: "test@athlos.com",
        }
      );
      expect(result).toEqual([]);
    });
  });

  // Pay Methods Data
  describe("when fetch pay methods is successful", () => {
    it("should return pay methods array", async () => {
      // given
      const methods = {
        data: [
          {
            _id: 1,
            userEmail: "test@athlos.com",
            cardHolderName: "Athlos Test",
            cardNumber: "0000 0000 0000 0000",
            cvv: "111",
            cardExpiry: "11/24",
            billingLocation: {
              city: "Bloomington",
              state: "IN",
              country: "United States",
              streetAddress: "111 N. Rose Ave",
              streetAddress2: "Willkie North 714B",
              zipcode: 47406,
            },
          },
          {
            _id: 2,
            userEmail: "test2@athlos.com",
            cardHolderName: "Athlos Test2",
            cardNumber: "1111 1111 1111 1111",
            cvv: "222",
            cardExpiry: "10/28",
            billingLocation: {
              city: "Bloomington",
              state: "IN",
              country: "United States",
              streetAddress: "222 N. Rose Ave",
              streetAddress2: "Willkie North 512A",
              zipcode: 47405,
            },
          },
        ],
      };
      axios.post.mockResolvedValueOnce(methods);

      // when
      const result = await fetchPayMethods("test@athlos.com");

      // then
      expect(axios.post).toHaveBeenCalledWith(
        `${api_url}/payment/getpaymethod`,
        {
          email: "test@athlos.com",
        }
      );
      expect(result).toEqual(methods.data);
    });
  });

  describe("when fetch pay methods fails", () => {
    it("should return empty array", async () => {
      // given
      const message = "Network Error";
      axios.post.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchPayMethods("test@athlos.com");

      // then
      expect(axios.post).toHaveBeenCalledWith(
        `${api_url}/payment/getpaymethod`,
        {
          email: "test@athlos.com",
        }
      );
      expect(result).toEqual([]);
    });
  });

  // Reserved Slots Data
  describe("when fetch reserved slots is successful", () => {
    it("should return reserved slots object", async () => {
      // given
      const reservedSlots = {
        data: [
          { _id: 1, facilityID: "f1", intime: 13, outtime: 14 },
          { _id: 2, facilityID: "f2", intime: 14, outtime: 15 },
        ],
      };

      axios.get.mockResolvedValueOnce(reservedSlots);

      // when
      const result = await fetchReservedSlots();

      // then
      const expectedSlots = { f1: [13], f2: [14] };

      expect(axios.get).toHaveBeenCalledWith(`${api_url}/book/booked_slots`);
      expect(result).toEqual(expectedSlots);
    });
  });

  describe("when fetch reserved slots fails", () => {
    it("should return offline data", async () => {
      // given
      const message = "Network Error";
      axios.get.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchReservedSlots();

      // then
      expect(axios.get).toHaveBeenCalledWith(`${api_url}/book/booked_slots`);

      let expectedResult = {};

      for (let slot of ReservedSlotsData) {
        if (expectedResult[slot.facilityID] === undefined) {
          expectedResult[slot.facilityID] = [slot.intime];
        } else {
          expectedResult[slot.facilityID].push(slot.intime);
        }
      }

      expect(result).toEqual(expectedResult);
    });
  });
});
