import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  styled,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useEffect, useCallback } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  useSearchUserQuery,
  useSendFriendRequestMutation,
} from "../redux/api/api";
import { enqueueSnackbar } from "notistack";

type Props = {
  searchmodel: boolean;
  setSearchmodel: React.Dispatch<React.SetStateAction<boolean>>;
};

type User = {
  _id: string;
  name: string;
  avatar: string;
};

const SearchFriend = ({ searchmodel, setSearchmodel }: Props) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(5),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(5),
    },
    width: "100%",
  }));

  const handleClose = () => {
    setSearchmodel(false);
  };

  const [search, setSearch] = useState<string>("");

  const { data } = useSearchUserQuery(search);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 1000), // Adjust the debounce delay as needed
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const [sendFriendRequest] = useSendFriendRequestMutation();

  const handleOnFriendReq = async (id: string) => {
    try {
      const res = await sendFriendRequest(id);
      // console.log(res);

      if (res.data) {
        enqueueSnackbar("Friend request sent", { variant: "success" });
      } else {
        // console.log(res.error.data.message);
        enqueueSnackbar(res.error.data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={searchmodel}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Search Friends
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
        <Stack spacing={2}>
          <TextField
            id="search"
            label="Search Friends"
            variant="filled"
            fullWidth
            onChange={handleSearchChange}
          />
        </Stack>

        <List>
          {data?.users?.map((user: User) => {
            return (
              <ListItem key={user._id}>
                <ListItemAvatar>
                  <Avatar alt={user.name} src={user.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.name}
                  primaryTypographyProps={{ mx: 0 }}
                />
                <IconButton onClick={() => handleOnFriendReq(user._id)}>
                  <AddCircleIcon sx={{ color: "lightblue" }} />
                </IconButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </BootstrapDialog>
  );
};

export default SearchFriend;
