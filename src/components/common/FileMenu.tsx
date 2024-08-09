import { Menu, MenuItem } from "@mui/material";
import React, { useRef } from "react";
import ImageIcon from "@mui/icons-material/Image";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import { enqueueSnackbar } from "notistack";
import { useSendAttachmentMutation } from "../../redux/api/api";

interface FileMenuProps {
  anchorEl: HTMLElement | null;
  aopen: boolean;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  chatId: string;
  setMessages: React.Dispatch<React.SetStateAction<[]>>;
}

const FileMenu = ({
  anchorEl,
  aopen,
  setAnchorEl,
  chatId,
  setMessages,
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

      // console.log(res.data);

      if (res.data) {
        setMessages((prev) => [...prev, res.data.messages]);
        enqueueSnackbar("Files uploaded successfully", { variant: "success" });
      } else {
        enqueueSnackbar("Error uploading files", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error uploading files", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const selectImageRef = () => imageRef.current?.click();
  const selectAudioRef = () => audioRef.current?.click();
  const selectVideoRef = () => videoRef.current?.click();
  const selectFileRef = () => fileRef.current?.click();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
        <MenuItem
          sx={{
            fontWeight: 700,
            color: "#333",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
          onClick={() => {
            selectImageRef();
            // handleClose();
          }}
        >
          <ImageIcon fontSize="small" sx={{ marginRight: 1 }} />
          Image
          <input
            multiple
            type="file"
            accept="image/png, image/jpeg, image/gif"
            style={{ display: "none" }}
            onChange={(e) => handleOnFileChange(e, "image")}
            ref={imageRef}
          />
        </MenuItem>
        <MenuItem
          sx={{
            fontWeight: 700,
            color: "#333",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
          onClick={() => {
            selectAudioRef();
            // handleClose();
          }}
        >
          <AudiotrackIcon fontSize="small" sx={{ marginRight: 1 }} />
          Audio
          <input
            multiple
            type="file"
            accept="audio/mpeg, audio/wav"
            style={{ display: "none" }}
            onChange={(e) => handleOnFileChange(e, "audio")}
            ref={audioRef}
          />
        </MenuItem>
        <MenuItem
          sx={{
            fontWeight: 700,
            color: "#333",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
          onClick={() => {
            selectVideoRef();
            // handleClose();
          }}
        >
          <PlayCircleIcon fontSize="small" sx={{ marginRight: 1 }} />
          Video
          <input
            multiple
            type="file"
            accept="video/mp4, video/ogg"
            style={{ display: "none" }}
            onChange={(e) => handleOnFileChange(e, "video")}
            ref={videoRef}
          />
        </MenuItem>
        <MenuItem
          sx={{
            fontWeight: 700,
            color: "#333",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
          onClick={() => {
            selectFileRef();
            // handleClose();
          }}
        >
          <DescriptionIcon fontSize="small" sx={{ marginRight: 1 }} />
          File
          <input
            multiple
            type="file"
            accept=".pdf, .docx, .txt"
            style={{ display: "none" }}
            onChange={(e) => handleOnFileChange(e, "file")}
            ref={fileRef}
          />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default FileMenu;
