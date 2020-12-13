import React, { useState } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/react-hooks";
import {
  addMessageMutation,
  messagesQuery,
  messageAddedSubscription,
} from "./graphql/queries";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
// import client from "./graphql/client";

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([]);
  useQuery(messagesQuery, {
    onCompleted: ({ messages }) => {
      setMessages(messages);
    },
  }); // {data} = result.data
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ subscriptionData }) => {
      setMessages(messages.concat(subscriptionData.data.messageAdded));
    },
  });
  const [addMessage /*, {loading, error, data, called} */] = useMutation(
    addMessageMutation
  );

  const handleSend = async (text) => {
    await addMessage({ variables: { input: { text } } });
  };

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
};

export default Chat;
