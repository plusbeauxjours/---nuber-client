import React from "react";
import styled from "../../typed-components";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import Menu from "../../Components/Menu";
import Button from "../../Components/Button";
import AddressBar from "../../Components/AddressBar";
import { userProfile, getRides } from "../../types/api";
import { MutationFn } from "react-apollo";
import RidePopUp from "../../Components/RidePopUp";

const Container = styled.div``;

const MenuButton = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 600;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 100px;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

interface IProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  loading: boolean;
  mapRef: any;
  toAddress: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressSubmit: () => void;
  price?: string;
  data?: userProfile;
  requestRideFn?: MutationFn;
  nearbyRide?: getRides;
  acceptRideFn?: MutationFn;
}

const HomePresenter: React.SFC<IProps> = ({
  isMenuOpen,
  toggleMenu,
  loading,
  mapRef,
  toAddress,
  onInputChange,
  onAddressSubmit,
  price,
  data: { GetMyProfile: { user = null } = {} } = {},
  nearbyRide: { GetNearbyRide: { ride = null } = {} } = {},
  requestRideFn,
  acceptRideFn
}) => (
  <Container>
    <Helmet>
      <title>Home | Nuber</title>
    </Helmet>
    <Sidebar
      sidebar={<Menu />}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          backgroundColor: "white",
          width: "80%",
          zIndex: "10"
        }
      }}
    >
      {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}
      {user && !user.isDriving && (
        <React.Fragment>
          <AddressBar
            name={"toAddress"}
            onChange={onInputChange}
            value={toAddress}
            onBlur={null}
          />
          <ExtendedButton
            onClick={onAddressSubmit}
            disabled={toAddress === ""}
            value={price ? "Change address" : "Pick Address"}
          />
        </React.Fragment>
      )}
      {price && (
        <RequestButton
          onClick={requestRideFn}
          disabled={toAddress === ""}
          value={`Request Ride ($${price})`}
        />
      )}
      {ride && (
        <RidePopUp
          id={ride.id}
          pickUpAddress={ride.pickUpAddress}
          dropOffAddress={ride.dropOffAddress}
          price={ride.price}
          distance={ride.distance}
          passengerName={ride.passenger.fullName!}
          passengerPhoto={ride.passenger.profilePhoto!}
          acceptRideFn={acceptRideFn}
        />
      )}
      <Map ref={mapRef} />
    </Sidebar>
  </Container>
);

export default HomePresenter;
