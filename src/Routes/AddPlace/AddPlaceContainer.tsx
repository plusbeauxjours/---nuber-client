import React from "react";
import { RouteComponentProps } from "react-router-dom";
import AddPlacePresenter from "./AddPlacePresenter";
import { addPlaceVariables, addPlace } from "../../types/api";
import { Mutation } from "react-apollo";
import { ADD_PLACE } from "./AddPlaceQueries";
import { toast } from "react-toastify";
import { GET_PLACES } from "../../sharedQueries";

interface IState {
  address: string;
  lat: number;
  lng: number;
  name: string;
}

interface IProps extends RouteComponentProps<any> {}

class AddPlaceQuery extends Mutation<addPlace, addPlaceVariables> {}

class AddPlaceContainer extends React.Component<IProps, IState> {
  public state = {
    address: "",
    lat: 0,
    lng: 0,
    name: ""
  };
  public render() {
    const { address, name, lat, lng } = this.state;
    const { history } = this.props;
    return (
      <AddPlaceQuery
        mutation={ADD_PLACE}
        onCompleted={data => {
          const { AddPlace } = data;
          if (AddPlace.ok) {
            toast.success("Place added!");
            setTimeout(() => {
              history.push("/places");
            }, 2000);
          } else {
            toast.error(AddPlace.error);
          }
        }}
        refetchQueries={[{ query: GET_PLACES }]}
        variables={{
          address,
          isFav: false,
          lat,
          lng,
          name
        }}
      >
        {(addPlaceFn, { loading }) => (
          <AddPlacePresenter
            onInputChange={this.onInputChange}
            address={address}
            name={name}
            loading={loading}
            onSubmit={addPlaceFn}
            pickedAddress={lat !== 0 && lng !== 0}
          />
        )}
      </AddPlaceQuery>
    );
  }

  public onInputChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async event => {
    const {
      target: { name, value }
    } = event;
    this.setState({
      [name]: value
    } as any);
  };
}

export default AddPlaceContainer;
