import { getUserLocation } from "@/lib/location";
import { mmkvInstance } from "@/lib/storage";
import { hasLocationConsent } from "../../lib/location-consent";
import { useLocation } from "../location-store";

jest.mock("@/lib/location", () => ({
  getUserLocation: jest.fn(),
}));

const mockGetUserLocation = getUserLocation as jest.MockedFunction<
  typeof getUserLocation
>;

const point = {
  type: "Point" as const,
  coordinates: [8.68, 50.11] as [number, number],
};

describe("location consent", () => {
  beforeEach(() => {
    mockGetUserLocation.mockReset();
    mmkvInstance.remove("location");
    useLocation.setState({
      locationConsentAt: null,
      boarding: false,
      loading: false,
      error: undefined,
      location: { type: "Point", coordinates: [0, 0] },
    });
  });

  it("does not call getUserLocation until consent is recorded", async () => {
    mockGetUserLocation.mockResolvedValue({
      success: true,
      data: point,
    });

    await useLocation.getState().fetchLocation();

    expect(mockGetUserLocation).not.toHaveBeenCalled();
    expect(useLocation.getState().boarding).toBe(false);
    expect(useLocation.getState().loading).toBe(false);

    useLocation.getState().setLocationConsent(true);
    expect(hasLocationConsent(useLocation.getState().locationConsentAt)).toBe(
      true,
    );

    await useLocation.getState().fetchLocation();

    expect(mockGetUserLocation).toHaveBeenCalledTimes(1);
    expect(useLocation.getState().boarding).toBe(true);
    expect(useLocation.getState().location).toEqual(point);
  });

  it("treats a missing consent timestamp as not consented", () => {
    expect(hasLocationConsent(null)).toBe(false);
    expect(hasLocationConsent(undefined)).toBe(false);
    expect(hasLocationConsent("")).toBe(false);
    expect(hasLocationConsent("2026-09-04T12:00:00.000Z")).toBe(true);
  });
});
