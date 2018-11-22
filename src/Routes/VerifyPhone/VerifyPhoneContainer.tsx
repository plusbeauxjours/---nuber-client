import React from "react";
import VerifyPhonePresenter from "./VerifyPhonePresenter";
import { RouteComponentProps } from "react-router";

interface IProps extends RouteComponentProps<any> {}

class VerifyPhoneContainer extends React.Component<IProps> {
  constructor(props) {
    super(props);
    // tslint:disable-next-line
    console.log(props);
    if (!props.location.state) {
      props.history.push("/");
    }
  }
  public render() {
    return <VerifyPhonePresenter />;
  }
}

export default VerifyPhoneContainer;
