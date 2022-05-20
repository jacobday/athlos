import axios from "axios";

import { api_url, fetchFacilities, fetchPromotions } from "./utils";

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
          facilityLocation: "Bloomington, IN",
          facilitySport: "Soccer",
          facilityInfo: "Soccer Field A",
          availableNow: false,
          reservationPeriodStart: 13,
          reservationPeriodEnd: 18,
          latitude: 39.17338764921328,
          longitude: -86.5123094830478,
        },
        {
          uniqFacId: 2,
          facilityName: "UCLA REC",
          facilityLocation: "Los Angeles, CA",
          facilitySport: "Volleyball",
          facilityInfo: "Volleyball Court #02",
          availableNow: false,
          reservationPeriodStart: 8,
          reservationPeriodEnd: 13,
          latitude: 34.07155188330886,
          longitude: -118.4453459922648,
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
});
