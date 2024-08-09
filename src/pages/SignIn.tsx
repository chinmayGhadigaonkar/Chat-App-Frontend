import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { VITE_BACKEND_URL } from "../utils/Backend_Url";
import FetchRequest from "../utils/FetchRequest";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/reducers/auth";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";


const defaultTheme = createTheme();

export default function SignIn() {
  const { user, authtoken, loading } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const naviagate = useNavigate()

  function Copyright(props: any) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Chat App
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    if (data.get("userName") === "" || data.get("password") === "") {
      enqueueSnackbar("Please fill in all fields", { variant: "error" });
      return;
    }

    const loginData = {
      userName: data.get("userName"),
      password: data.get("password"),
    };

    try {
      const response = await FetchRequest.post(
        `${VITE_BACKEND_URL}/user/loginuser`,
        loginData
      );

      console.log("Login response:", response.data);
      const success = response.data.success;

      if (success) {
        dispatch(login(response.data));
        naviagate("/")
        enqueueSnackbar("Login successful", { variant: "success" });
      }
      // Handle success (e.g., redirect, show message)
    } catch (error) {
      console.error("Login failed:", error);
      // Handle error (e.g., show error message)
    }
  };

  return loading ? (
    <>Loading</>
  ) : (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="userName"
              label="Username"
              name="userName"
              autoComplete="userName"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item sx={{ margin: "0 auto", textAlign: "center" }}>
                <Link href="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}


