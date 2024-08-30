import {
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useEffect, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { enqueueSnackbar } from "notistack";
import {
  useAddMemberMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";

type Props = {
  addMembermodel: boolean;
  setaddMembermodel: React.Dispatch<React.SetStateAction<boolean>>;
  chatId: string;
  chatIdMembersData: any;
};

type User = {
  _id: string;
  name: string;
  avatar: string;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(5),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(5),
  },
  width: "100%",
}));

const AddMemberList = ({
  addMembermodel,
  setaddMembermodel,
  chatId,
  chatIdMembersData,
}: Props) => {
  const [members, setMembers] = useState<string[]>([]);
  const [nonMemberFriends, setNonMemberFriends] = useState<User[]>([]);

  const handleClose = () => {
    setaddMembermodel(false);
  };

  const { data: allFriendsData, refetch: refetchData1 } =
    useAvailableFriendsQuery();
  // const { data: chatIdMembersData, refetch: refetchData2 } =
  //   useAvailableFriendsQuery(chatId);

  useEffect(() => {
    if (
      addMembermodel &&
      allFriendsData?.friends &&
      chatIdMembersData?.data.friends
    ) {
      // Reset the members state and re-filter the friends
      setMembers([]);

      const filteredFriends = allFriendsData.friends.filter(
        (user) =>
          !chatIdMembersData.data.friends.some(
            (member) => member._id === user._id
          )
      );
      setNonMemberFriends(filteredFriends);
    }
  }, [addMembermodel, allFriendsData, chatIdMembersData]);

  const [addMember] = useAddMemberMutation();

  const handleOnAddMember = async () => {
    if (members.length === 0) {
      enqueueSnackbar("Please select at least one member", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await addMember({
        chatId,
        members,
      });

      if (response.data) {
        enqueueSnackbar(response.data.message || "Member added successfully", {
          variant: "success",
        });
        setMembers([]);
        refetchData1();
        chatIdMembersData.refetch();
        setaddMembermodel(false);
      }
    } catch (err) {
      enqueueSnackbar("Failed to add members", { variant: "error" });
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={addMembermodel}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Add Member To Group
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
        <List sx={{ width: "fullWidth" }}>
          {nonMemberFriends.map((user: User) => (
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
        onClick={handleOnAddMember}
      >
        Add Member
      </Button>
    </BootstrapDialog>
  );
};

export default AddMemberList;
