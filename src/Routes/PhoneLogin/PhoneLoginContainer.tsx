import React from "react";
import { RouteComponentProps } from "react-router-dom";
import PhoneLoginPresenter from "./PhoneLoginPresenter";
import { toast } from "react-toastify";
import { Mutation, MutationFn } from "react-apollo";
import { PHONE_SIGN_IN } from "./PhoneQueries";
import {
  startPhoneVerification,
  startPhoneVerificationVariables
} from "../../types/api";

interface IState {
  countryCode: string;
  phoneNumber: string;
}

interface IProps extends RouteComponentProps<any> {}

class PhoneSignInMutation extends Mutation<
  startPhoneVerification,
  startPhoneVerificationVariables
> {}

class PhoneLoginContainer extends React.Component<IProps, IState> {
  public phoneMutation: MutationFn;
  public state = {
    countryCode: "+36",
    phoneNumber: ""
  };

  public render() {
    const { countryCode, phoneNumber } = this.state;
    const { history } = this.props;
    return (
      <PhoneSignInMutation
        mutation={PHONE_SIGN_IN}
        variables={{
          phoneNumber: `${countryCode}${phoneNumber}`
        }}
        onCompleted={data => {
          const { StartPhoneVerification } = data;
          const phone = `${countryCode}${phoneNumber}`;
          if (StartPhoneVerification.ok) {
            toast.success("SMS Sent! Redirection you...");
            setTimeout(() => {
              history.push({
                pathname: "/verify-phone",
                state: {
                  phone
                }
              });
            }, 1500);
          } else {
            toast.error(StartPhoneVerification.error);
          }
        }}
      >
        {(phoneMutation, { loading }) => {
          this.phoneMutation = phoneMutation;
          return (
            <PhoneLoginPresenter
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
              loading={loading}
            />
          );
        }}
      </PhoneSignInMutation>
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };

  public onSubmit: React.FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    const { countryCode, phoneNumber } = this.state;
    const phone = `${countryCode}${phoneNumber}`;
    const isValid = /^\+[1-9]{1}[0-9]{7,11}$/.test(phone);
    if (isValid) {
      this.phoneMutation();
    } else {
      toast.error("Please write a valid phone number");
    }
  };
}

export default PhoneLoginContainer;
