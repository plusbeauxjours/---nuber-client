import React from "react";
import Helmet from "react-helmet";
import styled from "../../typed-components";
import AddressBar from "../../Components/AddressBar";
import Button from "../../Components/Button";

const Map = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
`;

const Center = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 2;
  font-size: 30px;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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

interface IProps {
  mapRef: any;
  address: string;
  onInputBlur: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPickPlace: () => void;
}

class FindAddressPresenter extends React.Component<IProps> {
  public render() {
    const {
      mapRef,
      address,
      onInputBlur,
      onInputChange,
      onPickPlace
    } = this.props;
    return (
      <div>
        <Helmet>
          <title>Find Address | Nuber</title>
        </Helmet>
        <AddressBar
          value={address}
          onBlur={onInputBlur}
          name={"address"}
          onChange={onInputChange}
        />
        <ExtendedButton value={"Pick this place"} onClick={onPickPlace} />
        <Center>📍</Center>
        <Map ref={mapRef} />
      </div>
    );
  }
}

export default FindAddressPresenter;
