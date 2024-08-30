import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
  useAddMemberMutation,
  useAvailableFriendsQuery,
  useChatDetailQuery,
  useLeaveGroupMutation,
  useRemoveMemberMutation,
} from "../../redux/api/api";
import LogoutIcon from "@mui/icons-material/Logout";
import { enqueueSnackbar } from "notistack";
import AddMemberList from "./Member";
import { useState } from "react";

type Props = {
  chatId: string;
};

const ChatDetails = ({ chatId }: Props) => {
  const { user } = useSelector((state: any) => state.auth);

  const chatDetail = useChatDetailQuery({
    chatId,
    populate: true,
    skip: !chatId,
  });

  const [removeMember] = useRemoveMemberMutation();

  const [leaveGroup] = useLeaveGroupMutation();

  const chatIdMembersData = useAvailableFriendsQuery(chatId);
  const handleOnRemoveMember = async (memberId: string) => {
    const data = {
      chatId,
      memberId,
    };

    try {
      const res = await removeMember(data);

      if (res.data.success) {
        enqueueSnackbar("Member Removed", { variant: "success" });
        chatIdMembersData.refetch();
      } else {
        enqueueSnackbar(res.data.message, {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Can't remove member from group", {
        variant: "error",
      });
      // console.log(error);
    }
  };

  const handleOnLeaveGroup = async () => {
    const data = {
      chatId: chatId,
    };
    window.alert("Are you sure you want to leave the group?");

    try {
      const res = await leaveGroup({ data, userId: user._id });

      if (res.data.success) {
        enqueueSnackbar("Left Group", { variant: "success" });
        window.location.reload();
        // chatIdMembersData.refetch();
      } else {
        enqueueSnackbar(res.data.message, {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Can't leave group", {
        variant: "error",
      });
      // console.log(error);
    }
  };

  const [addMembermodel, setaddMembermodel] = useState(false);
  const handleClickaddMembermodel = () => {
    setaddMembermodel(true);
  };

  return chatDetail.isLoading || chatDetail.isError ? (
    <Box>Loading...</Box>
  ) : chatDetail.isError ? (
    <Box>Error</Box>
  ) : (
    <Box sx={{ width: 300 }} role="presentation">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 2,
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "primary.main",
            fontSize: "30px",
          }}
        >
          {chatDetail.data?.chat.name.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ mt: 2 }}>
          <h3>{chatDetail.data.chat.name}</h3>
        </Box>

        <Box sx={{ mt: 2 }}>
          <h4>Members</h4>
          {
            <List>
              {chatDetail.data?.chat.members.map((member: any) => (
                <ListItem key={member._id}>
                  <ListItemButton>
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "primary.main",
                          fontSize: "20px",
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={member.name} />
                    {member._id === chatDetail.data?.chat.creator && (
                      <ListItemText
                        primary="Admin"
                        sx={{
                          color: "green",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      />
                    )}

                    {member._id !== chatDetail.data?.chat.creator &&
                      chatDetail.data?.chat.creator === user._id &&
                      chatDetail.data.chat.groupChat && (
                        <ListItemText
                          primary="Remove"
                          sx={{
                            color: "red",
                            textAlign: "center",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                          onClick={() => handleOnRemoveMember(member._id)}
                        />
                      )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          }

          <ListItem>
            {chatDetail.data?.chat.creator === user._id &&
              chatDetail.data.chat.groupChat && (
                <ListItemButton
                  sx={{
                    cursor: "pointer",
                    fontWeight: 700,
                    color: "green",
                    textAlign: "center",
                  }}
                  onClick={handleClickaddMembermodel}
                >
                  <ListItemText primary="Add Member" />
                </ListItemButton>
              )}

            {chatDetail.data?.chat.groupChat && (
              <ListItemButton onClick={handleOnLeaveGroup}>
                <ListItemText
                  sx={{
                    cursor: "pointer",
                    fontWeight: 700,
                    color: "red",
                    textAlign: "center",
                  }}
                  primary={`Leave Group 
                
                `}
                />
              </ListItemButton>
            )}
          </ListItem>
        </Box>
      </Box>
      <AddMemberList
        addMembermodel={addMembermodel}
        setaddMembermodel={setaddMembermodel}
        chatIdMembersData={chatIdMembersData}
        chatId={chatId}
      />
    </Box>
  );
};

export default ChatDetails;
