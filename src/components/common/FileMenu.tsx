import { Menu, MenuItem, CircularProgress } from "@mui/material";
import React, { useEffect, useRef } from "react";
import ImageIcon from "@mui/icons-material/Image";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import { enqueueSnackbar } from "notistack";
import { useSendAttachmentMutation } from "../../redux/api/api";
import { useSocket } from "../../utils/SocketIo";
import { NEW_ATTACHEMENT } from "../../utils/event";

interface FileMenuProps {
  anchorEl: HTMLElement | null;
  aopen: boolean;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  chatId: string;
  setMessages: React.Dispatch<React.SetStateAction<[]>>;
  members: string[];
}

const CustomMenuItem = ({ onClick, icon: Icon, text }) => (
  <MenuItem
    sx={{
      fontWeight: 700,
      color: "#333",
      "&:hover": {
        backgroundColor: "#e0e0e0",
      },
    }}
    onClick={onClick}
  >
    <Icon fontSize="small" sx={{ marginRight: 1 }} />
    {text}
  </MenuItem>
);

const FileMenu = ({
  anchorEl,
  aopen,
  setAnchorEl,
  chatId,
  setMessages,
  members,
}: FileMenuProps) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [loading, setLoading] = React.useState(false);
  const [sendAttachment] = useSendAttachmentMutation();
  const imageRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const handleOnFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      return;
    }

    if (files.length > 5) {
      return enqueueSnackbar("You can only upload 5 files at a time", {
        variant: "error",
      });
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("chatId", chatId);
      files.forEach((file) => {
        formData.append("file", file);
      });

      const res = await sendAttachment(formData);

      if (res.data) {
        socket.socket?.emit(NEW_ATTACHEMENT, {
          chatId: chatId,
          members: members,
          attachment: res.data.messages.attachment,
        });

        enqueueSnackbar("Files uploaded successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Error uploading files", { variant: "error" });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error uploading files";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
      // Reset input fields
      if (imageRef.current) imageRef.current.value = "";
      if (audioRef.current) audioRef.current.value = "";
      if (videoRef.current) videoRef.current.value = "";
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const selectImageRef = () => imageRef.current?.click();
  const selectAudioRef = () => audioRef.current?.click();
  const selectVideoRef = () => videoRef.current?.click();
  const selectFileRef = () => fileRef.current?.click();

  const handleMessage = React.useCallback(
    (data: any) => {
      console.log(data.realTimeData);

      setMessages((prev) => [...prev, data.realTimeData]);
    },
    [chatId]
  );

  useEffect(() => {
    if (socket.socket) {
      socket.socket.on(NEW_ATTACHEMENT, handleMessage);
      return () => {
        socket?.socket?.off(NEW_ATTACHEMENT, handleMessage);
      };
    }
  }, [socket.socket, handleMessage]);

  React.useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, [chatId]);

  return (
    <div>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CircularProgress size={24} />
        </div>
      )}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={aopen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "#f5f5f5",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <CustomMenuItem
          onClick={selectImageRef}
          icon={ImageIcon}
          text="Image"
        />
        <input
          multiple
          type="file"
          accept="image/png, image/jpeg, image/gif"
          style={{ display: "none" }}
          onChange={(e) => handleOnFileChange(e, "image")}
          ref={imageRef}
        />
        <CustomMenuItem
          onClick={selectAudioRef}
          icon={AudiotrackIcon}
          text="Audio"
        />
        <input
          multiple
          type="file"
          accept="audio/mpeg, audio/wav"
          style={{ display: "none" }}
          onChange={(e) => handleOnFileChange(e, "audio")}
          ref={audioRef}
        />
        <CustomMenuItem
          onClick={selectVideoRef}
          icon={PlayCircleIcon}
          text="Video"
        />
        <input
          multiple
          type="file"
          accept="video/mp4, video/ogg"
          style={{ display: "none" }}
          onChange={(e) => handleOnFileChange(e, "video")}
          ref={videoRef}
        />
        <CustomMenuItem
          onClick={selectFileRef}
          icon={DescriptionIcon}
          text="File"
        />
        <input
          multiple
          type="file"
          accept=".pdf, .docx, .txt"
          style={{ display: "none" }}
          onChange={(e) => handleOnFileChange(e, "file")}
          ref={fileRef}
        />
      </Menu>
    </div>
  );
};

export default FileMenu;
