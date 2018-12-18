import React from "react";
import styled from "../../typed-components";
import Header from "../../Components/Header/index";
import { getChat, userProfile } from "../../types/api";
import Message from "../../Components/Message/Message";

const Container = styled.div``;

interface IProps {
  data?: getChat;
  userData?: userProfile;
  loading: boolean;
}

const ChatPresenter: React.SFC<IProps> = ({
  data: { GetChat: { chat = null } = {} } = {},
  userData: { GetMyProfile: { user = null } = {} } = {},
  loading
}) => (
  <Container>
    <Header title={"Chat"} />
    {!loading && chat && user && (
      <React.Fragment>
        {chat.messages &&
          chat.messages.map(message => {
            if (message) {
              return (
                <Message
                  key={message.id}
                  text={message.text}
                  mine={user.id === message.userId}
                />
              );
            }
            return null;
          })}
      </React.Fragment>
    )}
  </Container>
);

export default ChatPresenter;
