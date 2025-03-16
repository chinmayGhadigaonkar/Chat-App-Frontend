import Navabar from "../components/common/Navabar";
import ListDividers from "../components/mui-ui/ListUserUi";
import { Box } from "@mui/material";
import Chat from "./Chat";
import { useState } from "react";

const Home = () => {
  const [rightSide, setRightSide] = useState<boolean>(false);

  const [chatId, setChatId] = useState<string>("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" }, // stack vertically on small screens, horizontally on medium and up
        maxHeight: "100vh", // ensure full height on small screens
      }}
    >
      <Box
        sx={{
          flex: { xs: "0 1 auto", md: "0 1 25%" }, // adjust flex properties for responsiveness
          display: { xs: rightSide ? "none" : "block", md: "block" },
          // hide on extra small screens
          maxHeight: "100vh", // ensure full height on small screens
          height: "100vh", // ensure full height on small screens
        }}
      >
        <Navabar />
        <ListDividers
          setRightSide={setRightSide}
          chatId={chatId}
          setChatId={setChatId}
        />
      </Box>
      <Box
        sx={{
          flex: { xs: "1 1 auto", md: "0 1 75%" }, // adjust flex properties for responsiveness
          width: "100%", // ensure full width on small screens
          maxHeight: "100vh", // ensure full height on small screens
          display: { xs: !rightSide ? "none" : "block", md: "block" },
        }}
      >
        <Chat
          rightSide={rightSide}
          setRightSide={setRightSide}
          chatId={chatId}
        />
      </Box>
    </Box>
  );
};

export default Home;
