import { Box, Container } from "@mui/material"
import BottomAppBar from "../components/mui-ui/ChatSection"
import React from "react";

type ChatProps = {
  rightSide: boolean,
  setRightSide: React.Dispatch<React.SetStateAction<boolean>>
  chatId: string
  

}
const Chat = ({ rightSide, setRightSide , chatId  }: ChatProps) => {
  return (
    <Box>
      <BottomAppBar chatId={chatId}  rightSide={rightSide} setRightSide={setRightSide} />
    </Box>
  );
};

export default Chat