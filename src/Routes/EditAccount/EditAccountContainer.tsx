import React from "react";
import EditAccountPresenter from "./EditAccountPresenter";
import { RouteComponentProps } from "react-router";
import { Mutation } from "react-apollo";
import { updateProfile, updateProfileVariables } from "src/types/api";
import { UPDATE_USERPROFILE } from "./EditAccountQueries";

interface IState {
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

interface IProps extends RouteComponentProps<any> {}

class UpdateProfileMutation extends Mutation<
  updateProfile,
  updateProfileVariables
> {}

class EditAccountContainer extends React.Component<IProps, IState> {
  public state = {
    email: "",
    firstName: "",
    lastName: "",
    profilePhoto: ""
  };
  public render() {
    const { email, firstName, lastName, profilePhoto } = this.state;
    return (
      <UpdateProfileMutation
        mutation={UPDATE_USERPROFILE}
        variables={{
          email,
          firstName,
          lastName,
          profilePhoto
        }}
      >
        {(updateProfileFn, { loading }) => (
          <EditAccountPresenter
            email={email}
            firstName={firstName}
            lastName={lastName}
            profilePhoto={profilePhoto}
            loading={loading}
            onSubmit={updateProfileFn}
            onInputChange={this.onInputChange}
          />
        )}
      </UpdateProfileMutation>
    );
  }
  public onInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const {
      target: { name, value }
    } = event;

    this.setState({
      [name]: value
    } as any);
  };
}

export default EditAccountContainer;
