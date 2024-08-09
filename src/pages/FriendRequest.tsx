import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from "../redux/api/api";
import { useError } from "../hook/hook";
import { enqueueSnackbar } from "notistack";

type props = {
  model: boolean;
  setModel: React.Dispatch<React.SetStateAction<boolean>>;
};



const FriendRequest = ({ model, setModel }: props) => {

  const { data, isLoading, error, isError } = useGetNotificationQuery();


  // console.log(data.allRequest);

  // useError({error , isError});

  // data && console.log(data.allRequest);
  

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));
  const handleClose = () => {
    setModel(false);
  };

  
  const [AcceptReq] =useAcceptFriendRequestMutation();
 
  const handleAccept = async(id: string, accept: boolean) => {
    try {
      const data = { userId: id, accept: accept };
      console.log(data);
      
      const res = await AcceptReq(data);
      console.log(res.data);
      
      if (res.data.success) {
        enqueueSnackbar("Request accepted", { variant: "success" });
      }
    }
    catch (error) {
    }
  }
  return (
    isLoading ? <div> Loading.... </div> :

    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={model}
    >
      <DialogTitle  sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Friends Request
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
          <List>
            {
              data.allRequest.map((item: any, index) => {
                return (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar
                        alt={item.sender.name.slice(0)}
                        src={item.sender.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.sender.name}
                      primaryTypographyProps={{ mx: 0 }}
                    />
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 2, color: "green", cursor: "pointer" }}
                      onClick={() => handleAccept(item._id, true)}
                    >
                      {" "}
                      Accept{" "}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{ mx: 1, color: "red", cursor: "pointer" }}
                      onClick={() => handleAccept(item._id, false)}
                    >
                      {" "}
                      Reject{" "}
                    </Typography>
                  </ListItem>
                );
              })
            }
         
        </List>
      </DialogContent>
      {/* <DialogActions>  */}
    </BootstrapDialog>
  );
};

export default FriendRequest;
