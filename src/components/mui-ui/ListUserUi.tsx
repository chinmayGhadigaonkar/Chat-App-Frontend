import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Avatar, AvatarGroup, Skeleton, Typography } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import React, { useCallback, useEffect } from "react";
import { useGetMyChatQuery } from "../../redux/api/api";
import { useError } from "../../hook/hook";
import { useDispatch, useSelector } from "react-redux";
import { setAlertMessage } from "../../redux/reducers/chat";
import { useSocket } from "../../utils/SocketIo";
import { ALERT } from "../../utils/event";
const style = {
  p: 0,
  width: "100%",
  minHeight: "full ",
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
};
interface Chat {
  groupChat: boolean;
  members: { name: string; avatar: string }[];
  avatar: string;
  name: string;
  _id: string;

  // Add other properties as needed
}
interface members {
  _id: string;
  name: string;
  avatar: string;
}

type ListDividersProps = {
  setRightSide: React.Dispatch<React.SetStateAction<boolean>>;
  setChatId: React.Dispatch<React.SetStateAction<string>>;
  chatId: string;
};

export default function ListDividers({
  setRightSide,
  setChatId,
  chatId,
}: ListDividersProps) {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const socket = useSocket();

  const { data, isLoading, isError, error } = useGetMyChatQuery();
  // console.log(data);

  const { AlertMessage } = useSelector((state) => state.chat);

  console.log("newMessageAlert", AlertMessage);

  useError([{ isError, error }]);

  useEffect(() => {
    setChats(data?.data);
  }, [data]);

  const dispatch = useDispatch();

  const newMessageAlert = useCallback((data) => {
    dispatch(setAlertMessage({chatId :data.chatId, count: 1}));
  }, []);

  useEffect(() => {
    socket.socket?.on(ALERT, newMessageAlert);
  }, [chats]);

  // console.log(chats);

  return (
    <List
      sx={{
        style,
        overflowY: "scroll",
        scrollbarWidth: "thin",
        scrollbarColor: "#fffff #f5f5f5",
        scrollbarGutter: "hovers",
        height: "93vh",
      }}
    >
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={118} />
      ) : (
        //Chat
        chats?.map((chat, index) => {
          return chat.groupChat ? (
            <ListItem
              key={index}
              sx={{
                cursor: "pointer",
                bgcolor: chatId === chat._id ? "primary.light" : "",
              }}
              onClick={() => {
                setRightSide(true), setChatId(chat._id);
              }}
            >
              <AvatarGroup total={chat.members.length}>
                <Avatar alt="Remy Sharp" src={chat.avatar[0]} />
                <Avatar alt="Travis Howard" src={chat.avatar[1]} />
                <Avatar alt="Agnes Walker" src={chat.avatar[2]} />
              </AvatarGroup>

              <div>
                <Typography variant="subtitle1" sx={{ pl: 2, fontWeight: 700 }}>
                  {chat.name}
                </Typography>
              </div>
            </ListItem>
          ) : (
            <ListItem
              key={index}
              sx={{
                cursor: "pointer",
                bgcolor: chatId === chat._id ? "primary.light" : "",
              }}
              onClick={() => {
                setRightSide(true), setChatId(chat._id);
              }}
            >
              <Avatar
                sx={{ bgcolor: deepOrange[500] }}
                src={chat.avatar}
              ></Avatar>
              <div>
                <Typography variant="subtitle1" sx={{ pl: 2, fontWeight: 700 }}>
                  {chat.name}
                </Typography>
                {/* <Typography variant="body2" sx={{ pl: 2 }}>
                  Nikola Tesla joined the chat */}
                {/* </Typography> */}
              </div>
            </ListItem>
          );
        })
      )}
    </List>
  );
}
