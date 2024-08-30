import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { enqueueSnackbar } from "notistack";
import {
  useAvailableFriendsQuery,
  useCreateGroupMutation,
} from "../redux/api/api";

type Props = {
  createGroupmodel: boolean;
  setcreateGroupmodel: React.Dispatch<React.SetStateAction<boolean>>;
};

type User = {
  _id: string;
  name: string;
  avatar: string;
};

// Moved outside to prevent recreation on every render
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(5),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(5),
  },
  width: "100%",
}));

const CreateGroup = ({ createGroupmodel, setcreateGroupmodel }: Props) => {
  const [groupName, setGroupName] = React.useState<string>("");
  const [members, setMembers] = React.useState<string[]>([]);

  const handleClose = () => {
    setcreateGroupmodel(false);
  };

  const { data } = useAvailableFriendsQuery();
  const [handleGroup] = useCreateGroupMutation();

  const handleOnCreateGroup = async () => {
    if (!groupName) {
      enqueueSnackbar("Group name is required", { variant: "error" });
      return;
    }
    if (members.length === 0) {
      enqueueSnackbar("Please select at least one member", {
        variant: "error",
      });
      return;
    }

    const groupData = {
      name: groupName,
      members: members,
    };

    try {
      const res = await handleGroup(groupData);
      if (res.data) {
        enqueueSnackbar(res.data.message, { variant: "success" });
        setGroupName("");
        setMembers([]);
        handleClose();
      }
    } catch (err) {
      enqueueSnackbar(err.error || "Some Error occur", { variant: "error" });
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={createGroupmodel}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create Group
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
          <Input
            type="text"
            id="group-name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Name"
          />
        </Stack>

        <List sx={{ width: "fullWidth" }}>
          {data?.friends?.map((user: User) => (
            <ListItem key={user._id}>
              <ListItemAvatar>
                <Avatar alt={user.name} src={user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                primaryTypographyProps={{ mx: 0 }}
              />

              {members.includes(user._id) ? (
                <IconButton
                  onClick={() =>
                    setMembers((prev) =>
                      prev.filter((member) => member !== user._id)
                    )
                  }
                >
                  <RemoveCircleIcon sx={{ color: "red" }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => setMembers((prev) => [...prev, user._id])}
                >
                  <AddCircleIcon sx={{ color: "lightblue" }} />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Button
        variant="contained"
        sx={{ width: "200px", my: 2, mx: "auto" }}
        onClick={handleOnCreateGroup}
      >
        Create Group
      </Button>
    </BootstrapDialog>
  );
};

export default CreateGroup;
