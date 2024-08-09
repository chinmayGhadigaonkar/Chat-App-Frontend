import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Divider, Drawer, Menu, MenuItem } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import React from "react";
import { useNavigate } from "react-router-dom";
import Profile from "../../pages/Profile";
import FriendRequest from "../../pages/FriendRequest";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/reducers/auth";
import { enqueueSnackbar } from "notistack";
import SearchFriend from "../../pages/SearchFriend";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  border: "1px",
  borderTopRightRadius: "15px",
  borderBottomRightRadius: "15px",
  borderTopLeftRadius: "15px",
  borderBottomLeftRadius: "15px",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "26ch",
      "&:focus": {
        width: "26ch",
      },
      bgColor: "white",
    },
  },
}));

export default function SearchAppBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const aopen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch()
  const handleonlogout = () => {
    enqueueSnackbar("Logout successful", { variant: "success" });
    dispatch(logout());
    navigate("/login");
  };

  // Drawer

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  // console.log(draweropen);

  //  Model for add friens
  const [model, setModel] = React.useState(false);

  const handleClickmodel = () => {
    setModel(true);
  };

  //  search friend model
  const [searchmodel, setSearchmodel] = React.useState(false);

  const handleClicksearchmodel = () => {
    setSearchmodel(true)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "white", color: "rgb(112 117 121)" }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={aopen}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{}}
          >
            <MenuItem
              sx={{ fontWeight: 700 }}
              onClick={() => {
                handleClose(), setOpen(true);
              }}
            >
              Profile
              <span>
                {"  "}
                <AccountCircleIcon fontSize="small" sx={{ ml: 1, mt: 1 }} />
              </span>
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 700 }}
              onClick={() => {
                handleClose(), handleClicksearchmodel();
              }}
            >
              Search Friend
              <span>
                {"  "}
                <SearchIcon fontSize="small" sx={{ ml: 1, mt: 1 }} />
              </span>
            </MenuItem>
            <MenuItem
              sx={{ fontWeight: 700 }}
              onClick={() => {
                handleClose(), handleClickmodel();
              }}
            >
              Notifiacation
              <span>
                {"  "}
                <AddAlertIcon fontSize="small" sx={{ ml: 1, mt: 1 }} />
              </span>
            </MenuItem>

            <Divider />
            <MenuItem
              sx={{ fontWeight: 700 }}
              onClick={() => {
                handleClose(), handleonlogout();
              }}
            >
              Logout
              <span>
                {"  "}
                <LogoutIcon fontSize="small" sx={{ ml: 1, mt: 1 }} />
              </span>
            </MenuItem>
          </Menu>
          <Drawer open={open} onClose={toggleDrawer(false)}>
            <Profile />
          </Drawer>
          <FriendRequest model={model} setModel={setModel} />
          <SearchFriend
            searchmodel={searchmodel}
            setSearchmodel={setSearchmodel}
          />
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search User Name"
              inputProps={{ "aria-label": "search" }}
              sx={{ bgColor: "#f4f4f5" }}
            />
          </Search> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
