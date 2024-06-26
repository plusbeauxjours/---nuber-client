import FindAddressContainer from "./FindAddressContainer";
import { GoogleApiWrapper } from "google-maps-react";
import { MAPS_KEY } from "../../keys";

export default GoogleApiWrapper({
  apiKey: MAPS_KEY
})(FindAddressContainer);
