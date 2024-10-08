import { createApi , fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import { VITE_BACKEND_URL } from '../../utils/Backend_Url'

interface Chat {
  data:Object,
  message : string,
  success: boolean
}
interface acceptData{
  userId: string,
  accept: boolean
}

interface ChatDetailParams {
  chatId: string;
  populate?: boolean;
}

interface ChatDetailResponse {
  // Define the structure of your chat detail response here
}

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: VITE_BACKEND_URL }),
  tagTypes: ["Chat", "User", "Message"],
  endpoints: (builder) => ({
    getMyChat: builder.query<Chat, void>({
      query: () => ({
        url: "chats/GetMyChats",
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
      query: (search: string) => ({
        url: `user/searchuser?name=${search}`,
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      }),
      providesTags: ["User"],
    }),

    sendFriendRequest: builder.mutation({
      query: (id: string) => ({
        url: `user/sendRequest`,
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ userId: id }),
      }),
      invalidatesTags: ["User"],
    }),
    getNotification: builder.query({
      query: () => ({
        url: "user/getallnotification",
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
      }),
      keepUnusedDataFor: 0,
    }),

    acceptFriendRequest: builder.mutation({
      query: (data: acceptData) => ({
        url: `user/acceptRequest`,
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authtoken: localStorage.getItem("authtoken"),
        },
        body: JSON.stringify({ requestId: data.userId, accept: data.accept }),
      }),
      invalidatesTags: ["Chat"],
    }),

    chatDetail: builder.query<ChatDetailResponse, ChatDetailParams>({
      query: ({ chatId, populate = false }) => {
        let url = `chats/${chatId}`;
        if (populate) {
          url = `chats/${chatId}?populate=true`;
        }

        return {
          url,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("authtoken") || "",
          },
        };
      },
      providesTags: ["Chat"],
    }),

    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chats/getChatMessage/${chatId}?page=${page}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken") || "",
        },
        keepUnusedDataFor: 0,
      }),
    }),

    sendAttachment: builder.mutation({
      query: (data) => ({
        url: `chats/sendAttachment`,
        method: "POST",
        headers: {
          authtoken: localStorage.getItem("authtoken") || "",
        },
        body: data,
      }),
    }),

    availableFriends: builder.query({
      query: (chatId: String) => {
        let url = "user/getFriends";
        if (chatId) {
          url = url + `?chatId=${chatId}`;
        }
        return {
          url,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authtoken: localStorage.getItem("authtoken") || "",
          },
          providesTags: ["User"],
        };
      },
    }),

    createGroup: builder.mutation({
      query: (data) => ({
        url: "chats/newGroup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken") || "",
        },
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    removeMember: builder.mutation({
      query: (data) => ({
        url: "chats/removeMember",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken") || "",
        },
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    addMember: builder.mutation({
      query: (data) => ({
        url: "chats/addMember",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken") || "",
        },
        body: data,
      }),
      invalidatesTags: ["Chat", "User", "Message"],
    }),

    leaveGroup: builder.mutation({
      query: ({ data, userId }) => ({
        url: `chats/leaveGroup/${userId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken") || "",
        },
        body: data,
      }),
      invalidatesTags: ["Chat", "Message"],
    }),

    deleteChat: builder.mutation({
      query: (id) => ({
        url: `chats/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authtoken: localStorage.getItem("authtoken") || "",
        },
      }),
      invalidatesTags: ["Message", "Chat"],
    }),
  }),
});

export const {
  useLeaveGroupMutation,
  useDeleteChatMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
  useCreateGroupMutation,
  useAvailableFriendsQuery,
  useGetMessagesQuery,
  useSendAttachmentMutation,
  useChatDetailQuery,
  useAcceptFriendRequestMutation,
  useGetNotificationQuery,
  useGetMyChatQuery,
  useSearchUserQuery,
  useSendFriendRequestMutation,
} = api;
export default api;

