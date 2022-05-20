import axios from "axios";

import {
  api_url,
  fetchFacilities,
  fetchMyBookings,
  fetchPromotions,
} from "./utils";

jest.mock("axios");

describe("Fetch data:", () => {
  // Facility Data
  describe("when fetch facilities is successful", () => {
    it("should return facilities array", async () => {
      // given
      const facilities = [
        {
          uniqFacId: 1,
          facilityName: "Student Recreational Sports Center",
          facilityLocation: {
            place_id: "ChIJtxjOXrpmbIgRzbikOxbr4-0",
            city: "Bloomington",
            state: "IN",
            country: "USA",
            street: "Student Recreational Sports Center (SRSC), East Law Lane",
          },
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
          facilityInfo: "Volleyball Court #02",
          availableNow: false,
          reservationPeriodStart: 8,
          reservationPeriodEnd: 13,
        },
      ];

      axios.get.mockResolvedValueOnce(facilities);

      // when
      const result = await fetchFacilities();

      // then
      expect(axios.get).toHaveBeenCalledWith(`${api_url}/facilities`);
      expect(result).toEqual(facilities);
    });
  });

  describe("when fetch facilities fails", () => {
    it("should return empty array", async () => {
      // given
      const message = "Network Error";
      axios.get.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchFacilities();

      // then
      expect(axios.get).toHaveBeenCalledWith(`${api_url}/facilities`);
      expect(result).toEqual([]);
    });
  });

  // Promotion Data
  describe("when fetch promotions is successful", () => {
    it("should return promotions array", async () => {
      // given
      const promotions = [
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

      axios.get.mockResolvedValueOnce(promotions);

      // when
      const result = await fetchPromotions();

      // then
      expect(axios.get).toHaveBeenCalledWith(`${api_url}/promotion/promos`);
      expect(result).toEqual(promotions);
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
      expect(result).toEqual([]);
    });
  });

  // My Bookings Data
  describe("when fetch my bookings is successful", () => {
    it("should return my bookings array", async () => {
      // given
      const bookings = [
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
          latitude: 39.1734,
          longitude: -86.5123139,
          facilitySport: "Soccer",
          facilityInfo: "Soccer Field A",
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

      axios.post.mockResolvedValueOnce(bookings);

      // when
      const result = await fetchMyBookings();

      // then
      expect(axios.post).toHaveBeenCalledWith(`${api_url}/book/userbookings`, {
        data: {
          email: "this.props.userEmail",
        },
      });
      expect(result).toEqual(bookings);
    });
  });

  describe("when fetch my bookings fails", () => {
    it("should return empty string", async () => {
      // given
      const message = "Network Error";
      axios.post.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchMyBookings();

      // then
      expect(axios.post).toHaveBeenCalledWith(`${api_url}/book/userbookings`, {
        data: {
          email: "this.props.userEmail",
        },
      });
      expect(result).toEqual("");
    });
  });
});
