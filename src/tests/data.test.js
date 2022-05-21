import axios from "axios";
import {
  api_url,
  fetchFacilities,
  fetchInterests,
  fetchMyBookings,
  fetchPromotions,
} from "../data";

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
      expect(result).toEqual([]);
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
    it("should return empty string", async () => {
      // given
      const message = "Network Error";
      axios.post.mockRejectedValueOnce(new Error(message));

      // when
      const result = await fetchMyBookings("test@athlos.com");

      // then
      expect(axios.post).toHaveBeenCalledWith(`${api_url}/book/userbookings`, {
        email: "test@athlos.com",
      });
      expect(result).toEqual([]);
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
    it("should return empty string", async () => {
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
});
