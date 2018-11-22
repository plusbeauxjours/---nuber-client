import React from "react";
import styled from "../../typed-components";
import Helmet from "react-helmet";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/index";
import Header from "../../Components/Header/index";

const Conatiner = styled.div``;

const Form = styled.form`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 20px;
`;

const VerifyPhonePresenter = () => (
  <Conatiner>
    <Helmet>
      <title>Verify Phone | Nuber</title>
    </Helmet>
    <Header />
    <Form>
      <ExtendedInput
        value={""}
        placeholder={"Enter Verification Code"}
        onChange={null}
      />
      <Button value={"Submit"} onClick={"null"} />
    </Form>
  </Conatiner>
);

export default VerifyPhonePresenter;
