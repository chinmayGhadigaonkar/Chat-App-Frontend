import React from "react";
import {
  Avatar,
  Box,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import fileFormat from "../../lib/FileFormat";
import { FileOpen } from "@mui/icons-material";

type MessageProps = {
  messages: {
    content: string;
    sender: { _id: string; name: string };
    createdAt: string;
    attachment: { _id: string; url: string }[];
  }[];
  user: { _id: string; name: string };
};

export const Message = ({ messages, user }: MessageProps) => {
  // console.log(messages);
  // console.log(messages?.sender?._id);

  return (
    <>
      {messages && (
        <li>
          {messages?.sender?._id === user._id ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgb(217 245 206)",
                  borderRadius: 2,
                  minWidth: "250px",
                  maxWidth: "fit-content",
                  padding: 1,
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {messages?.attachment?.length > 0 &&
                  messages?.attachment?.map((item, index) => {
                    const url = item.url;
                    const file = fileFormat(url);

                    return (
                      <Box key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          download={url}
                        >
                          {RenderAttachment({ file, url })}
                        </a>
                      </Box>
                    );
                  })}

                <ListItemText
                  primary={messages.content}
                  primaryTypographyProps={{
                    fontSize: 16,
                    color: "black",
                    fontWeight: 700,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 10,
                    position: "absolute",
                    right: 8,
                    bottom: 6,
                    color: "gray",
                    fontWeight: 700,
                  }}
                >
                  {new Date(messages.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "rgb(255 255 255)",
                  borderRadius: 2,
                  minWidth: "250px",
                  maxWidth: "fit-content",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",

                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <Avatar sx={{ bgcolor: "red" }}>
                    {messages?.sender?.name?.slice(0, 1).toUpperCase()}
                  </Avatar>

                  <ListItemText
                    primary={messages.sender.name}
                    primaryTypographyProps={{
                      fontSize: 12,
                      color: "red",
                      py: 1,
                      ml: 1,
                      fontWeight: 700,
                    }}
                  />
                </Box>
                <ListItemText
                  secondary={messages?.content}
                  secondaryTypographyProps={{
                    fontSize: 16,
                    color: "black",
                    fontWeight: 700,
                    py: 0,
                    px: 1,
                    textAlign: "left",
                  }}
                ></ListItemText>

                {messages?.attachment?.length > 0 &&
                  messages?.attachment?.map((item, index) => {
                    const url = item.url;
                    const file = fileFormat(url);

                    return (
                      <Box key={index}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          download={url}
                        >
                          {RenderAttachment({ file, url })}
                        </a>
                      </Box>
                    );
                  })}

                <Typography
                  sx={{
                    fontSize: 10,
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    color: "gray",
                    fontWeight: 700,
                  }}
                >
                  {new Date(messages.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          )}
        </li>
      )}
    </>
  );
};

const RenderAttachment = ({
  file,
  url = "",
}: {
  file: string;
  url: string;
}) => {
  switch (file) {
    case "video":
      return <video src={url} width="250" preload="none" controls />;
    case "audio":
      return <audio src={url} preload="none" controls />;
    case "image":
      return (
        <img
          src={url}
          alt={url}
          width="250"
          height="150"
          style={{ objectFit: "contain" }}
        />
      );
    default:
      return <FileOpen />;
  }
};
