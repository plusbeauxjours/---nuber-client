import React from "react";
import { Query, Mutation } from "react-apollo";
import { RouteComponentProps } from "react-router-dom";
import {
  getRide,
  getRideVariables,
  userProfile,
  updateRide,
  updateRideVariables
} from "../../types/api";
import RidePresenter from "./RidePresenter";
import { GET_RIDE, RIDE_SUBSCRIPTION, UPDATE_RIDE_STATUS } from "./RideQueries";
import { SubscribeToMoreOptions } from "apollo-client";
import { USER_PROFILE } from "../../sharedQueries";

class RideQuery extends Query<getRide, getRideVariables> {}
class ProfileQuery extends Query<userProfile> {}
class RideUpdate extends Mutation<updateRide, updateRideVariables> {}

interface IProps extends RouteComponentProps<any> {}

class RideContainer extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    if (!props.match.params.rideId) {
      props.history.push("/");
    }
  }
  public render() {
    const {
      match: {
        params: { rideId }
      }
    } = this.props;
    return (
      <ProfileQuery query={USER_PROFILE}>
        {({ data: userData }) => (
          <RideQuery query={GET_RIDE} variables={{ rideId }}>
            {({ data, loading, subscribeToMore }) => {
              const subscribeOptions: SubscribeToMoreOptions = {
                document: RIDE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) {
                    return prev;
                  }
                  console.log(prev, subscriptionData);
                }
              };
              subscribeToMore(subscribeOptions);
              return (
                <RideUpdate
                  mutation={UPDATE_RIDE_STATUS}
                  refetchQueries={GET_RIDE}
                >
                  {updateRideFn => (
                    <RidePresenter
                      data={data}
                      userData={userData}
                      loading={loading}
                      updateRideFn={updateRideFn}
                    />
                  )}
                </RideUpdate>
              );
            }}
          </RideQuery>
        )}
      </ProfileQuery>
    );
  }
}

export default RideContainer;
