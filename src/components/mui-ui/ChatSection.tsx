import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  FormControl,
  Grid,
  OutlinedInput,
  List,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSocket } from "../../utils/SocketIo";
import {
  ALERT,
  NEW_MESSAGE,
  REFETCH_CHAT,
  START_TYPING,
  STOP_TYPING,
} from "../../utils/event"; // Add STOP_TYPING event
import { useChatDetailQuery, useGetMessagesQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { Message } from "../chat/Message";
import SendIcon from "@mui/icons-material/Send";
import InfiniteScroll from "react-infinite-scroll-component";
import FileMenu from "../chat/FileMenu";
import { resetAlertMessage } from "../../redux/reducers/chat";
import ChatSetting from "../chat/ChatSetting";

type BottomAppBarProps = {
  rightSide: boolean;
  setRightSide: React.Dispatch<React.SetStateAction<boolean>>;
  chatId: string;
};

export default function BottomAppBar({
  rightSide,
  setRightSide,
  chatId,
}: BottomAppBarProps) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState<number>(1);
  const [members, setMembers] = useState<string[]>([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [alert, setAlert] = useState<string | null>(null);

  const typingTimeoutRef = useRef<null>(null); // Ref to store timeout for typing

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const aopen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOnChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get("chat");
    if (message) {
      socket.socket?.emit(NEW_MESSAGE, { chatId, members, message });
      setTypingUser(null);
      e.currentTarget.reset();
    }
  };

  const handleOnChange = () => {
    if (!typing) {
      setTyping(true);
      socket.socket?.emit(START_TYPING, { chatId, members });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
      socket.socket?.emit(STOP_TYPING, { chatId, members });
    }, 2000); // 2 seconds timeout after last keystroke
  };

  const chatDetail = useChatDetailQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  // useError([{ isError: chatDetail.isError, error: chatDetail.error }]);
  // useError([
  //   {
  //     isError: oldMessagesChunk.isError,
  //     error: oldMessagesChunk.error,
  //   },
  // ]);

  useEffect(() => {
    if (oldMessagesChunk.data) {
      setOldMessages((prev) => [...oldMessagesChunk.data.messages, ...prev]);
    }
  }, [oldMessagesChunk.data]);

  useEffect(() => {
    if (chatDetail.data) {
      setMembers(chatDetail.data.chat?.members);
    }
  }, [chatDetail.data]);

  const handleMessage = useCallback(
    (data: any) => {
      // console.log("Message", data);

      if (data.chatId === chatId) {
        setMessages((prev) => [...prev, data.realTimeData]);
      }
    },
    [chatId]
  );

  const handleOnAlert = useCallback(
    (data: any) => {
      console.log("Alert", data);
      if (data.chatId === chatId) {
        setAlert(data.message);
      }

      // setMessages((prev) => [...prev, data]);
    },
    [chatId]
  );

  const handleOnTyping = useCallback(
    (data: any) => {
      if (data.chatId === chatId) {
        setTypingUser(data.user.userName);
        // Handle typing indicator display logic here
      }
    },
    [chatId]
  );

  const handleOnStopTyping = useCallback(
    (data: any) => {
      if (data.chatId === chatId) {
        setTypingUser(null);
        // Handle typing indicator display logic here
      }
    },
    [chatId]
  );

  // const handleOnRefetch = (data: any) => {
  //   console.log(data);

  //   if (data.chatId === chatId) {
  //     oldMessagesChunk.refetch();
  //   }
  // };

  useEffect(() => {
    if (socket.socket) {
      socket.socket.on(NEW_MESSAGE, handleMessage);
      socket.socket.on(START_TYPING, handleOnTyping);
      socket.socket.on(STOP_TYPING, handleOnStopTyping);
      socket.socket.on(ALERT, handleOnAlert);
      // socket.socket.on(REFETCH_CHAT, handleOnRefetch);

      return () => {
        socket?.socket?.off(NEW_MESSAGE, handleMessage);
        socket?.socket?.off(START_TYPING, handleOnTyping);
        socket?.socket?.off(STOP_TYPING, handleOnStopTyping);
        socket?.socket?.off(ALERT, handleOnAlert);
        // socket?.socket?.off(REFETCH_CHAT, handleOnRefetch);
      };
    }
  }, [
    socket.socket,
    handleMessage,
    handleOnTyping,
    handleOnStopTyping,
    handleOnAlert,
    // handleOnRefetch,
  ]);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(
    () => () => {
      dispatch(resetAlertMessage(chatId));
    },
    [chatId, dispatch]
  );

  useEffect(() => {
    return () => {
      setOldMessages([]);
      setMessages([]);
      setPage(1);
      setMembers([]);
      setAlert(null);
      setTypingUser(null);
    };
  }, [chatId, dispatch]);

  if (!chatId) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#99BA92",
          width: "100%",
        }}
      >
        <Typography variant="h4">Please select a chat</Typography>
      </Box>
    );
  }

  const fetchMoreMessages = async () => {
    try {
      setPage((prev) => prev + 1);

      const { data } = await oldMessagesChunk.refetch({ chatId, page });

      if (data && data.messages.length > 0) {
        setOldMessages(oldMessages.concat(data.messages));
      }
    } catch (error) {
      console.error("Error fetching more messages:", error);
    }
  };

  // console.log("Typing User", typingUser);
  // console.log("Alert", alert);

  return (
    <React.Fragment>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100vh",
          width: "100%",
        }}
      >
        {/* AppBar and chat UI components */}
        <AppBar
          position="static"
          sx={{
            width: "100%",
            backgroundColor: "white",
            color: "rgb(112 117 121)",
            borderBottom: "3px solid #f0f0f0",
            py: 1,
            height: "67px",
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ArrowBackIcon
                sx={{ display: { md: "none", xs: "block" }, mr: 1 }}
                onClick={() => setRightSide(false)}
              />
              <Avatar sx={{ bgcolor: blue[500] }}>
                {chatDetail.data?.chat.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ pl: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontSize: 25, color: "black", fontWeight: 900 }}
                >
                  {chatDetail.data?.chat.name
                    .charAt(0)
                    .toUpperCase()
                    .slice(0, 1) + chatDetail.data?.chat.name.slice(1)}
                </Typography>
              </Box>
            </Box>
            <ChatSetting chatId={chatId} />
          </Toolbar>
        </AppBar>

        {/* Chat Messages */}
        <Box
          id="chat-box"
          flex={1}
          sx={{
            width: "100%",
            bgcolor: "#99BA92",
            pl: 2,
            pt: 1,
            display: "flex",
            overflowY: "auto",
            flexDirection: "column-reverse",
            scrollbarWidth: "thin",
            scrollbarColor: "#095da2 #f5f5f5",
          }}
        >
          <List
            sx={{
              width: "100%",
              flexGrow: 1,
            }}
            subheader={<li />}
          >
            {alert && (
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  color: "black",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {alert.message}
              </Typography>
            )}
            <InfiniteScroll
              dataLength={oldMessages.length + messages.length} // Total messages count
              next={fetchMoreMessages}
              hasMore={page < oldMessagesChunk.data?.totalPages} // Check if more pages are available
              loader={<h4 style={{ textAlign: "center" }}>Loading.......</h4>}
              // Keeps the scrolling direction as reverse
              inverse={true}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              scrollableTarget="chat-box"
              style={{
                display: "flex",
                flexDirection: "column-reverse",
              }}
            >
              {oldMessages.map((item, index) => (
                <Message messages={item} user={user} key={item._id} />
              ))}
            </InfiniteScroll>
            {messages.map((item, index) => (
              <Message messages={item} user={user} key={item._id} />
            ))}

            {
              // Typing Indicator
              typingUser && typingUser != user.userName && (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    color: "black",
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {typingUser} is typing...
                </Typography>
              )
            }
          </List>

          {/* Typing Indicator */}
        </Box>

        {/* Message Input */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            height: "90px",
            width: { xs: "100%", sm: "100%", md: "100%" },
            margin: "0 auto",
            marginTop: "2px",
            backgroundColor: "white",
            flexWrap: "wrap",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <form
                onSubmit={handleOnChat}
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                autoComplete="on"
              >
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 1,
                    backgroundColor: "#fff",
                    borderRadius: 1,
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <IconButton
                    color="inherit"
                    onClick={handleClick}
                    sx={{ marginRight: 1 }}
                  >
                    <AttachFileIcon />
                  </IconButton>
                  <FileMenu
                    anchorEl={anchorEl}
                    aopen={aopen}
                    setAnchorEl={setAnchorEl}
                    chatId={chatId}
                    setMessages={setMessages}
                    members={members}
                  />
                  <OutlinedInput
                    placeholder="Please enter message"
                    name="chat"
                    fullWidth
                    sx={{ flex: 1, marginRight: 1 }}
                    onChange={handleOnChange}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ minWidth: "50px", padding: "10px", marginLeft: 1 }}
                  >
                    <SendIcon />
                  </Button>
                </FormControl>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </React.Fragment>
  );
}
