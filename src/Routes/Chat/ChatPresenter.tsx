import React from "react";
import styled from "../../typed-components";
import Header from "../../Components/Header/index";

const Container = styled.div``;

const ChatPresenter: React.SFC = () => (
  <Container>
    <Header title={"Chat"} />
  </Container>
);

export default ChatPresenter;
