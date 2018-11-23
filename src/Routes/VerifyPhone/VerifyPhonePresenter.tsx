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

interface IProps {
  key: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const VerifyPhonePresenter: React.SFC<IProps> = ({ key, onChange }) => (
  <Conatiner>
    <Helmet>
      <title>Verify Phone | Nuber</title>
    </Helmet>
    <Header backTo={"/phone-logn"} title={"Verify Phone Number"} />
    <Form>
      <ExtendedInput
        value={"key"}
        placeholder={"Enter Verification Code"}
        onChange={onChange}
        name={"key"}
      />
      <Button value={"Submit"} onClick={"null"} />
    </Form>
  </Conatiner>
);

export default VerifyPhonePresenter;
