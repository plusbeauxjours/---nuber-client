import React from "react";
import MenuPresenter from "./MenuPresenter";
import { userProfile, toggleDriving } from "../../types/api";
import { Query, Mutation } from "react-apollo";
import { USER_PROFILE } from "../../sharedQueries";
import { TOGGLE_DRIVING } from "./MenuQueries";

class ProfileQuery extends Query<userProfile> {}
class ToggleDrivingMutation extends Mutation<toggleDriving> {}

class MenuContainer extends React.Component {
  public render() {
    return (
      <ToggleDrivingMutation
        mutation={TOGGLE_DRIVING}
        refetchQueries={[{ query: USER_PROFILE }]}
      >
        {toggleDrivingFn => (
          <ProfileQuery query={USER_PROFILE}>
            {({ data, loading }) => (
              <MenuPresenter
                toggleDrivingFn={toggleDrivingFn}
                data={data}
                loading={loading}
              />
            )}
          </ProfileQuery>
        )}
      </ToggleDrivingMutation>
    );
  }
}

export default MenuContainer;
