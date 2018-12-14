import React from "react";
import HomePresenter from "./HomePresenter";
import { RouteComponentProps } from "react-router";
import { graphql, Query, MutationFn, Mutation } from "react-apollo";
import {
  userProfile,
  reportMovement,
  reportMovementVariables,
  getDrivers,
  getRides
} from "../../types/api";
import { USER_PROFILE } from "../../sharedQueries";
import ReactDOM from "react-dom";
import { geoCode, reverseGeoCode } from "../../mapHelpers";
import { toast } from "react-toastify";
import { ACCEPT_RIDE, SUBSCRIBE_NEARBY_RIDES } from "./HomeQueries";
import {
  REPORT_LOCATION,
  GET_NEARBY_DRIVERS,
  REQUEST_RIDE,
  GET_NEARBY_RIDE
} from "./HomeQueries";
import {
  requestRide,
  requestRideVariables,
  acceptRideVariables
} from "../../types/api";
import { SubscribeToMoreOptions } from "apollo-client";

interface IState {
  isMenuOpen: boolean;
  lat: number;
  lng: number;
  toAddress: string;
  toLat: number;
  toLng: number;
  distance: string;
  duration?: string;
  price?: string;
  fromAddress: string;
  isDriving: boolean;
}

interface IProps extends RouteComponentProps<any> {
  google: any;
  reportLocation: MutationFn;
}

class ProfileQuery extends Query<userProfile> {}
class NearbyQueries extends Query<getDrivers> {}
class RequestRideMutation extends Mutation<requestRide, requestRideVariables> {}
class GetNearbyRides extends Query<getRides> {}
class AcceptRide extends Mutation<AcceptRide, acceptRideVariables> {}

class HomeContainer extends React.Component<IProps, IState> {
  public mapRef: any;
  public map: google.maps.Map;
  public userMarker: google.maps.Marker;
  public toMarker: google.maps.Marker;
  public directions: google.maps.DirectionsRenderer;
  public drivers: google.maps.Marker[];
  public state = {
    distance: "",
    duration: undefined,
    fromAddress: "",
    isDriving: true,
    isMenuOpen: false,
    lat: 0,
    lng: 0,
    price: undefined,
    toAddress: "nimmanhaemin",
    toLat: 0,
    toLng: 0
  };
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.drivers = [];
  }
  public componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleGeoSuccess,
      this.handleGeoError
    );
  }
  public render() {
    const {
      distance,
      duration,
      fromAddress,
      isMenuOpen,
      isDriving,
      lat,
      lng,
      price,
      toAddress,
      toLat,
      toLng
    } = this.state;
    return (
      <ProfileQuery query={USER_PROFILE} onCompleted={this.handleProfileQuery}>
        {({ loading, data }) => (
          <NearbyQueries
            query={GET_NEARBY_DRIVERS}
            pollInterval={5000}
            skip={isDriving}
            onCompleted={this.handleNearbyDrivers}
          >
            {() => (
              <RequestRideMutation
                mutation={REQUEST_RIDE}
                onCompleted={this.handleRideRequest}
                variables={{
                  distance,
                  dropOffAddress: toAddress,
                  dropOffLat: toLat,
                  dropOffLng: toLng,
                  duration: duration || "",
                  pickUpAddress: fromAddress,
                  pickUpLat: lat,
                  pickUpLng: lng,
                  price: price || 0
                }}
              >
                {requestRideFn => (
                  <GetNearbyRides query={GET_NEARBY_RIDE} skip={!isDriving}>
                    {({ subscribeToMore, data: nearbyRide }) => {
                      const rideSubscriptionOptions: SubscribeToMoreOptions = {
                        document: SUBSCRIBE_NEARBY_RIDES,
                        updateQuery: this.handleSubscriptionUpdate
                      };
                      subscribeToMore(rideSubscriptionOptions);
                      return (
                        <AcceptRide mutation={ACCEPT_RIDE}>
                          {acceptRideFn => (
                            <HomePresenter
                              loading={loading}
                              isMenuOpen={isMenuOpen}
                              toggleMenu={this.toggleMenu}
                              mapRef={this.mapRef}
                              toAddress={toAddress}
                              onInputChange={this.onInputChange}
                              onAddressSubmit={this.onAddressSubmit}
                              price={price}
                              data={data}
                              requestRideFn={requestRideFn}
                              nearbyRide={nearbyRide}
                              acceptRideFn={acceptRideFn}
                            />
                          )}
                        </AcceptRide>
                      );
                    }}
                  </GetNearbyRides>
                )}
              </RequestRideMutation>
            )}
          </NearbyQueries>
        )}
      </ProfileQuery>
    );
  }
  public toggleMenu = () => {
    this.setState(state => {
      return {
        isMenuOpen: !state.isMenuOpen
      };
    });
  };
  public handleGeoSuccess: PositionCallback = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    this.setState({
      lat: latitude,
      lng: longitude
    });
    this.getFromAddress(latitude, longitude);
    this.loadMap(latitude, longitude);
  };
  public handleGeoError: PositionErrorCallback = () => {
    console.log("No location");
  };
  public getFromAddress = async (lat: number, lng: number) => {
    const address = await reverseGeoCode(lat, lng);
    if (address) {
      this.setState({
        fromAddress: address
      });
    }
  };
  public loadMap = (lat, lng) => {
    console.log(lat, lng);
    const { google } = this.props;
    const maps = google.maps;
    const mapNode = ReactDOM.findDOMNode(this.mapRef.current);
    if (!mapNode) {
      this.loadMap(lat, lng);
      return;
    }
    const mapConfig: google.maps.MapOptions = {
      center: {
        lat,
        lng
      },
      disableDefaultUI: true,
      zoom: 13
    };
    this.map = new maps.Map(mapNode, mapConfig);
    const userMarkerOptions: google.maps.MarkerOptions = {
      icon: {
        path: maps.SymbolPath.CIRCLE,
        scale: 7
      },
      position: {
        lat,
        lng
      }
    };
    this.userMarker = new maps.Marker(userMarkerOptions);
    this.userMarker.setMap(this.map);
    const watchOptions: PositionOptions = {
      enableHighAccuracy: true
    };
    navigator.geolocation.watchPosition(
      this.handleGeoWatchSuccess,
      this.handleGeoWatchError,
      watchOptions
    );
  };
  public handleGeoWatchSuccess: PositionCallback = (position: Position) => {
    const { reportLocation } = this.props;
    const {
      coords: { latitude, longitude }
    } = position;
    this.userMarker.setPosition({ lat: latitude, lng: longitude });
    this.map.panTo({ lat: latitude, lng: longitude });
    reportLocation({
      variables: {
        lat: parseFloat(latitude.toFixed(10)),
        lng: parseFloat(longitude.toFixed(10))
      }
    });
  };
  public handleGeoWatchError: PositionErrorCallback = () => {
    console.log("No location");
  };
  public onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
  public onAddressSubmit = async () => {
    const { toAddress } = this.state;
    const { google } = this.props;
    const maps = google.maps;
    const result = await geoCode(toAddress);
    if (result !== false) {
      const { lat, lng, formatted_address: formatedAddress } = result;
      if (this.toMarker) {
        this.toMarker.setMap(null);
      }
      const toMarkerOptions: google.maps.MarkerOptions = {
        position: {
          lat,
          lng
        }
      };
      this.toMarker = new maps.Marker(toMarkerOptions);
      this.toMarker.setMap(this.map);
      const bounds = new maps.LatLngBounds();
      bounds.extend({ lat, lng });
      bounds.extend({ lat: this.state.lat, lng: this.state.lng });
      this.map.fitBounds(bounds);
      this.setState(
        {
          toAddress: formatedAddress,
          toLat: lat,
          toLng: lng
        },
        this.createPath
      );
    }
  };
  public createPath = () => {
    const { toLat, toLng, lat, lng } = this.state;
    if (this.directions) {
      this.directions.setMap(null);
    }
    const renderOptions: google.maps.DirectionsRendererOptions = {
      polylineOptions: {
        strokeColor: "#000",
        strokeOpacity: 0.5
      },
      suppressMarkers: true
    };
    this.directions = new google.maps.DirectionsRenderer(renderOptions);
    const directionsService: google.maps.DirectionsService = new google.maps.DirectionsService();
    const to = new google.maps.LatLng(toLat, toLng);
    const from = new google.maps.LatLng(lat, lng);
    const directionsOptions: google.maps.DirectionsRequest = {
      destination: to,
      origin: from,
      travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(directionsOptions, this.handleRouteRequest);
  };
  public handleRouteRequest = (
    result: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === google.maps.DirectionsStatus.OK) {
      const { routes } = result;
      const {
        distance: { text: distance },
        duration: { text: duration }
      } = routes[0].legs[0];
      this.directions.setDirections(result);
      this.directions.setMap(this.map);
      console.log(this.directions);
      this.setState(
        {
          distance,
          duration
        },
        this.setPrice
      );
    } else {
      toast.error("There is no route there, you have to swim dude");
    }
  };
  public setPrice = () => {
    const { distance } = this.state;
    if (distance) {
      this.setState({
        price: Number(parseFloat(distance.replace(",", "")) * 3).toFixed(2)
      });
    }
  };
  public handleNearbyDrivers = (data: {} | getDrivers) => {
    if ("GetNearbyDrivers" in data) {
      const {
        GetNearbyDrivers: { drivers, ok }
      } = data;
      if (ok && drivers) {
        for (const driver of drivers) {
          if (driver && driver.lastLat && driver.lastLng) {
            const existingDriver:
              | google.maps.Marker
              | undefined = this.drivers.find(
              (driverMarker: google.maps.Marker) => {
                const markerID = driverMarker.get("ID");
                return markerID === driver.id;
              }
            );
            if (existingDriver) {
              existingDriver.setPosition({
                lat: driver.lastLat,
                lng: driver.lastLng
              });
              existingDriver.setMap(this.map);
            } else {
              const markerOptions: google.maps.MarkerOptions = {
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 5
                },
                position: {
                  lat: driver.lastLat,
                  lng: driver.lastLng
                }
              };
              const newMarker: google.maps.Marker = new google.maps.Marker(
                markerOptions
              );
              this.drivers.push(newMarker);
              newMarker.set("ID", driver.id);
              newMarker.setMap(this.map);
            }
          }
        }
      }
    }
  };
  public handleRideRequest = (data: requestRide) => {
    const { RequestRide } = data;
    if (RequestRide.ok) {
      toast.success("Drivce requested, finding a driver");
    } else {
      toast.error(RequestRide.error);
    }
  };
  public handleProfileQuery = (data: userProfile) => {
    const { GetMyProfile } = data;
    if (GetMyProfile.user) {
      const {
        user: { isDriving }
      } = GetMyProfile;
      this.setState({
        isDriving
      });
    }
  };
  public handleSubscriptionUpdate = data => {
    console.log(data);
  };
}

export default graphql<any, reportMovement, reportMovementVariables>(
  REPORT_LOCATION,
  {
    name: "reportLocation"
  }
)(HomeContainer);
