import React from "react";
import styled from "src/typed-components";
import { Link } from "react-router-dom";
import Header from "src/Components/Header";
import Helmet from "react-helmet";
import Form from "src/Components/Form";
import Input from "../../Components/Input/Input";
import { MutationFn } from "react-apollo";
import Button from "src/Components/Button";

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
  loading;
  onSubmit: MutationFn;
  pickedAddress: boolean;
}

const AddPlacePresenter: React.SFC<IProps> = ({
  address,
  name,
  onInputChange,
  loading,
  onSubmit,
  pickedAddress
}) => (
  <React.Fragment>
    <Helmet>
      <title>Add Place | Nuber</title>
    </Helmet>
    <Header title={"Add Place"} backTo={"/"} />
    <Container>
      <Form submitFn={onSubmit}>
        <ExtendedInput
          placeholder={"Name"}
          type={"text"}
          onChange={onInputChange}
          value={name}
          name={"name"}
        />
        <ExtendedInput
          placeholder={"Address"}
          type={"text"}
          onChange={onInputChange}
          value={address}
          name={"address"}
        />
        <ExtendedLink to={"/find-address"}>Pick place from map</ExtendedLink>
        {pickedAddress && (
          <Button
            onClick={null}
            value={loading ? "Adding place" : "Add Place"}
          />
        )}
      </Form>
    </Container>
  </React.Fragment>
);

export default AddPlacePresenter;
