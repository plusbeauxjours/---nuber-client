import React from "react";
import styled from "src/typed-components";
import { Link } from "react-router-dom";
import Header from "src/Components/Header";
import Helmet from "react-helmet";
import Form from "src/Components/Form";
import Input from "../../Components/Input/Input";
// import Button from "src/Components/Button";

const Container = styled.div`
  padding: 0 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 40px;
`;

const ExtendedLink = styled(Link)`
  text-decoration: underline;
  margin-bottom: 20px;
  display: block;
`;

interface IProps {
  address: string;
  name: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddPlacePresenter: React.SFC<IProps> = ({
  address,
  name,
  onInputChange
}) => (
  <React.Fragment>
    <Helmet>
      <title>Add Place | Nuber</title>
    </Helmet>
    <Header title={"Add Place"} backTo={"/"} />
    <Container>
      <Form submitFn={null}>
        <ExtendedInput
          placeholder={"Name"}
          type={"text"}
          onChange={onInputChange}
          value={name}
        />
        <ExtendedInput
          placeholder={"Address"}
          type={"text"}
          onChange={onInputChange}
          value={address}
        />
        <ExtendedLink to={"/find-address"}>Pick place from map</ExtendedLink>
        {/* <Button onClick={null} value={loading ? "Adding place" : "Add Place"} /> */}
      </Form>
    </Container>
  </React.Fragment>
);

export default AddPlacePresenter;
