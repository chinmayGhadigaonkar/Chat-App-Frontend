import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import React from "react";
import {
  useAvailableFriendsQuery,
  useDeleteChatMutation,
} from "../../redux/api/api";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ChatDetails from "./ChatDetail";
import { enqueueSnackbar } from "notistack";
type Props = {
  chatId: string;
};

const ChatSetting = ({ chatId }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const aopen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  // console.log(chatId);

  const [deleteChat] = useDeleteChatMutation();
  const navigator = window.location;

  const handleOnDeleteChat = async () => {
    alert("Are you sure you want to delete this chat?");

    try {
      const res = await deleteChat(chatId);

      if (res.data?.success) {
        enqueueSnackbar("Chat deleted successfully", { variant: "success" });
        navigator.reload();
      } else {
        const errorMessage = res.data?.message || "Failed to delete chat";
        enqueueSnackbar(errorMessage, { variant: "error" });
      }
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to delete chat";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <div>
      <IconButton sx={{ cursor: "pointer" }} onClick={handleClick}>
        <Tooltip title="Chat Option">
          <MoreVertIcon />
        </Tooltip>
      </IconButton>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={aopen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{}}
      >
        <MenuItem
          sx={{ fontWeight: 700 }}
          onClick={() => {
            handleClose();
            toggleDrawer(true); // Correctly calling toggleDrawer to open the drawer
          }}
        >
          Group Info
        </MenuItem>

        <MenuItem sx={{ fontWeight: 700 }} onClick={handleOnDeleteChat}>
          Clear Chat
        </MenuItem>
      </Menu>
      <Drawer anchor="right" open={open} onClose={() => toggleDrawer(false)}>
        <ChatDetails chatId={chatId} />
      </Drawer>
    </div>
  );
};

export default ChatSetting;
