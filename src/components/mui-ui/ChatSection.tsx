import * as React from "react";
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
import { NEW_MESSAGE } from "../../utils/event";
import { useChatDetailQuery, useGetMessagesQuery } from "../../redux/api/api";
import { useSelector } from "react-redux";
import { Message } from "../common/Message";
import { useError } from "../../hook/hook";
import SendIcon from "@mui/icons-material/Send";
import InfiniteScroll from "react-infinite-scroll-component";
import FileMenu from "../common/FileMenu";

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
  const [messages, setMessages] = React.useState([]);
  const [page, setPage] = React.useState<number>(1);
  const [members, setMembers] = React.useState<string[]>([]);
  const [oldMessages, setOldMessages] = React.useState([]);
  

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
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
      e.currentTarget.reset();
    }
  };

  const chatDetail = useChatDetailQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  useError([{ isError: chatDetail.isError, error: chatDetail.error }]);
  useError([
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ]);

  React.useEffect(() => {
    if (oldMessagesChunk.data) {
      setOldMessages((prev) => [...oldMessagesChunk.data.messages, ...prev]);
    }
  }, [oldMessagesChunk.data]);

  React.useEffect(() => {
    if (chatDetail.data) {
      setMembers(chatDetail.data.chat?.members);
    }
  }, [chatDetail.data]);

  const handleMessage = React.useCallback((data: any) => {
    setMessages((prev) => [...prev, data.realTimeData]);
  }, []);

  React.useEffect(() => {
    if (socket.socket) {
      socket.socket.on(NEW_MESSAGE, handleMessage);
      return () => {
        socket?.socket?.off(NEW_MESSAGE, handleMessage);
      };
    }
  }, [socket.socket]);

  const { user } = useSelector((state) => state.auth);

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

  const fetchMoreMessages = () => {
    setPage((prevPage) => prevPage + 1);
    const message = useGetMessagesQuery({ chatId, page });

    if (message) {
      setOldMessages((prev) => [...prev, ...message]);
    }
  };

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
          </Toolbar>
        </AppBar>

        <Box
          flex={1}
          sx={{
            width: "100%",
            bgcolor: "#99BA92",
            pl: 2,
            pt: 1,
            display: "flex",
            flexDirection: "column-reverse",
            overflowY: "auto",
          }}
          className="chat-box"
        >
          <List
            sx={{
              width: "100%",
              flexGrow: 1,
            }}
            subheader={<li />}
          >
            <InfiniteScroll
              dataLength={oldMessages.length}
              next={fetchMoreMessages}
              hasMore={oldMessagesChunk.data?.totalPages >= page}
              loader={<h4>Loading.......</h4>}
              inverse={true}
              endMessage={
                <p style={{ textAlign: "center" }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              style={{ display: "flex", flexDirection: "column-reverse" }}
              scrollableTarget="chat-box"
            >
              {oldMessages?.map((item, index) => (
                <Message messages={item} user={user} key={index} />
              ))}
            </InfiniteScroll>
            {messages.map((item, index) => (
              <Message messages={item} user={user} key={index} />
            ))}
          </List>
        </Box>

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
                  />
                  <OutlinedInput
                    placeholder="Please enter message"
                    name="chat"
                    fullWidth
                    sx={{ flex: 1, marginRight: 1 }}
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
