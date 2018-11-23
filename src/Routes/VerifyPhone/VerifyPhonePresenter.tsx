import React from "react";
import styled from "../../typed-components";
import Helmet from "react-helmet";
import Input from "../../Components/Input/Input";
import Button from "../../Components/Button/index";
import Header from "../../Components/Header/index";
import { MutationFn } from "react-apollo";
import Form from "../../Components/Form/Form";

const Conatiner = styled.div``;

const ExtendedForm = styled(Form)`
  padding: 0px 40px;
`;

const ExtendedInput = styled(Input)`
  margin-bottom: 20px;
`;

interface IProps {
  verificationKey: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: MutationFn;
  loading: boolean;
}

const VerifyPhonePresenter: React.SFC<IProps> = ({
  verificationKey,
  onChange,
  onSubmit,
  loading
}) => (
  <Conatiner>
    <Helmet>
      <title>Verify Phone | Nuber</title>
    </Helmet>
    <Header backTo={"/phone-logn"} title={"Verify Phone Number"} />
    <ExtendedForm submitFn={onSubmit}>
      <ExtendedInput
        value={verificationKey}
        placeholder={"Enter Verification Code"}
        onChange={onChange}
        name={"verificationKey"}
      />
      <Button
        disabled={loading}
        value={loading ? "Verifying" : "Submit"}
        onClick={"null"}
      />
    </ExtendedForm>
  </Conatiner>
);

export default VerifyPhonePresenter;
