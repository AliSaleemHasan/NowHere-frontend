import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { useEffect, useState } from "react";

const useLocation = () => {
  const [error, setError] = useState<string>("");
  const [lat, setLat] = useState<number>();
  const [long, setLong] = useState<number>();

  const getLocationPermission = async () => {
    const { status } = await requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("User didn't grant location permission");
      return;
    }

    try {
      const location = await getCurrentPositionAsync();
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
    } catch (err) {
      setError("Could not get current location");
    }
  };

  useEffect(() => {
    getLocationPermission();
  }, []);

  return { error, lat, long };
};

export default useLocation;
