import React from "react";
import { Mutation } from "react-apollo";
import { editPlace, editPlaceVariables } from "../../types/api";
import { GET_PLACES } from "../../sharedQueries";
import { EDIT_PLACE } from "./PlaceQueries";
import PlacePresenter from "./PlacePresenter";

interface IProps {
  name: string;
  fav: boolean;
  address: string;
  id: number;
}

class FavMutation extends Mutation<editPlace, editPlaceVariables> {}

class PlaceContainer extends React.Component<IProps> {
  public render() {
    const { id, fav, name, address } = this.props;
    return (
      <FavMutation
        mutation={EDIT_PLACE}
        variables={{
          isFav: !fav,
          placeId: id
        }}
        refetchQueries={[{ query: GET_PLACES }]}
      >
        {editPlaceFn => (
          <PlacePresenter
            onStarPress={editPlaceFn}
            fav={fav}
            name={name}
            address={address}
          />
        )}
      </FavMutation>
    );
  }
}

export default PlaceContainer;
