import axios from "axios";
import { MAPS_KEY } from "./keys";

export const geoCode = () => null;

export const resverseGeoCode = async (lat: number, lng: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${MAPS_KEY}`;
  const { status, data } = await axios(URL);
  console.log(status, data.results.geomerty);
};
