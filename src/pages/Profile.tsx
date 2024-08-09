import { Avatar, Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useSelector } from "react-redux";



const Profile = () => {
  const {user} = useSelector( (state:any) => state.auth);
  console.log(user);
  
  return user&&(
    <Box sx={{ width: 300 }} role="presentation">
      <Avatar
        sx={{ width: "90px", height: "90px", mx: "auto", mt: 10 }}
        src={user.avatar[0].url}
      ></Avatar>

      <List sx={{ mt: 4 }}>
        <ListItem>
          <ListItemText
            primary="Name"
            primaryTypographyProps={{ fontWeight: 700 }}
            secondary={user.name}
          />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="UserName"
            secondary={user.userName}
            primaryTypographyProps={{ fontWeight: 700 }}
          />
        </ListItem>
        <Divider />

        <ListItem>
          <ListItemText
            primary="Bio"
            secondary={user.bio}
            primaryTypographyProps={{ fontWeight: 700 }}
            secondaryTypographyProps={{ fontWeight: 500 }}
          />
        </ListItem>
        <Divider />
      </List>
    </Box>
  );
}

export default Profile