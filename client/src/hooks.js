import { useMutation, useQuery, useSubscription } from "@apollo/react-hooks";
import {
  addMessageMutation,
  messageAddedSubscription,
  messagesQuery,
} from "./graphql/queries";

export const useChatMessages = () => {
  const { data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      client.writeData({
        // write data to the cache and rerender
        data: {
          messages: messages.concat(subscriptionData.data.messageAdded),
        },
      });
    },
  });
  const [addMessage /*, {loading, error, data, called} */] = useMutation(
    addMessageMutation
  );
  return {
    messages,
    addMessage: (text) => addMessage({ variables: { input: { text } } }),
  };
};
