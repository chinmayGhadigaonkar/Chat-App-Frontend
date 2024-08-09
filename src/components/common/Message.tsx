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
  Typography,
} from "@mui/material";

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
  console.log(messages);

  return (
    <>
      
      {
        messages ? (
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
              {messages.attachment?.length > 0 &&
                messages.attachment?.map((item, index) => (
                  <ImageListItem
                    key={index}
                    cols={item.cols || 1}
                    rows={item.rows || 1}
                    sx={{ width: "100%", height: "100%" }}
                  >
                    <img src={item.url} alt={item._id} loading="lazy" />
                  </ImageListItem>
                ))}

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
                padding: 1,
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "red" }}>
                  {messages?.sender?.name}
                </Avatar>
              </ListItemAvatar>

              {messages?.attachment?.length > 0 &&
                messages?.attachment?.map((item, index) => (
                  <ImageListItem
                    key={index}
                    cols={item.cols || 1}
                    rows={item.rows || 1}
                  >
                    <img src={item.url} alt={item._id} loading="lazy" />
                  </ImageListItem>
                ))}
              <ListItemText
                primary={messages.sender.name}
                primaryTypographyProps={{
                  fontSize: 12,
                  color: "red",
                  fontWeight: 700,
                }}
                secondary={messages?.content}
                secondaryTypographyProps={{
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
        ):(<>
          <Typography variant="h6" color="red">
            Loading Messages...
            </Typography>
        </>)
      }
      
    </>
  );
};
