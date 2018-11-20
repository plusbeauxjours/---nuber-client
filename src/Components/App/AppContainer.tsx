import React from "react";
import { graphql } from "react-apollo";
import { ToastContainer } from "react-toastify";
import theme from "../../theme";
import { IS_LOGGED_IN } from "./AppQueries";
import AppPresenter from "./AppPresenter";
import { ThemeProvider } from "../../typed-components";
import "react-toastify/dist/ReactToastify.min.css";

const AppContainer = ({ data }) => (
  <React.Fragment>
    <ThemeProvider theme={theme}>
      <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
    </ThemeProvider>
    <ToastContainer draggable={true} position={"bottom-center"} />
  </React.Fragment>
);

export default graphql(IS_LOGGED_IN)(AppContainer);
