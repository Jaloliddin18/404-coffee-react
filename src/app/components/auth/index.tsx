import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import {
  Stack,
  TextField,
  Button,
  FormControl,
  Checkbox,
  FormControlLabel,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Link,
  Alert,
  IconButton,
  Box,
} from "@mui/material";
import styled from "styled-components";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { T } from "../../../lib/types/common";
import { Messages } from "../../../lib/config";
import { LoginInput, MemberInput } from "../../../lib/types/member";
import MemberService from "../../services/MemberService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 2),
  },
  loginPaper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "12px",
    boxShadow: theme.shadows[10],
    padding: theme.spacing(4),
    minWidth: "380px",
    maxWidth: "420px",
  },
}));

interface AuthenticationModalProps {
  signupOpen: boolean;
  loginOpen: boolean;
  handleSignupClose: () => void;
  handleLoginClose: () => void;
  handleSignupOpen?: () => void;
  handleLoginOpen?: () => void;
}

export default function AuthenticationModal(props: AuthenticationModalProps) {
  const {
    signupOpen,
    loginOpen,
    handleSignupClose,
    handleLoginClose,
    handleSignupOpen,
    handleLoginOpen,
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [memberNick, setMemberNick] = useState<string>("");
  const [memberPhone, setMemberPhone] = useState<string>("");
  const [memberPassword, setMemberPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { setAuthMember } = useGlobals();
  const history = useHistory();

  /** HANDLERS **/

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  function handleUserName(e: T) {
    console.log(e.target.value);
    setMemberNick(e.target.value);
  }
  const handlePhone = (e: T) => {
    console.log(e.target.value);
    setMemberPhone(e.target.value);
  };
  const handlePassword = (e: T) => {
    console.log(e.target.value);
    setMemberPassword(e.target.value);
  };
  const handlePasswordKeyDown = (e: T) => {
    if (e.key === "Enter" && signupOpen) {
      handleSignupRequest().then();
    } else if (e.key === "Enter" && loginOpen) {
      handleLoginRequest().then();
    }
  };

  const handleSignupRequest = async () => {
    console.log("SIGNUP CLICKED");
    try {
      const isFulfill =
        memberNick !== "" && memberPhone !== "" && memberPassword !== "";
      if (!isFulfill) throw new Error(Messages.error3);

      const signupInput: MemberInput = {
        memberNick: memberNick,
        memberPhone: memberPhone,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.signup(signupInput);

      // Saving  Authenticated User
      setAuthMember(result);
      handleSignupClose();
    } catch (err) {
      console.log(err);
      handleSignupClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleLoginRequest = async () => {
    try {
      const isFulfill = memberNick !== "" && memberPassword !== "";
      if (!isFulfill) throw new Error(Messages.error3);

      const loginInput: LoginInput = {
        memberNick: memberNick,
        memberPassword: memberPassword,
      };

      const member = new MemberService();
      const result = await member.login(loginInput);

      // Saving  Authenticated User
      setAuthMember(result);
      handleLoginClose();
    } catch (err) {
      console.log(err);
      handleLoginClose();
      sweetErrorHandling(err).then();
    }
  };

  const handleSwitchToSignup = () => {
    handleLoginClose();
    if (handleSignupOpen) {
      handleSignupOpen();
    }
  };

  const handleSwitchToLogin = () => {
    handleSignupClose();
    if (handleLoginOpen) {
      handleLoginOpen();
    }
  };

  return (
    <div>
      {/* NEW LOGIN MODAL */}
      <Modal
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
        className={classes.modal}
        open={loginOpen}
        onClose={handleLoginClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={loginOpen}>
          <Box className={classes.loginPaper}>
            {/* Title */}
            <h2 style={{ marginBottom: 8, textAlign: "center" }}>Login</h2>

            {/* Alert/Subtitle */}
            <Alert
              sx={{ mb: 2, px: 1, py: 0.25, width: "100%" }}
              severity="info"
            >
              Welcome back! Please login to continue.
            </Alert>

            {/* Username Field with Icon */}
            <TextField
              id="input-with-icon-textfield"
              label="Username"
              name="memberNick"
              type="text"
              size="small"
              required
              fullWidth
              value={memberNick}
              onChange={handleUserName}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle fontSize="inherit" />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            {/* Password Field with Visibility Toggle */}
            <FormControl sx={{ mb: 2 }} fullWidth variant="outlined">
              <InputLabel size="small" htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                name="password"
                size="small"
                value={memberPassword}
                onChange={handlePassword}
                onKeyDown={handlePasswordKeyDown}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? (
                        <VisibilityOff fontSize="inherit" />
                      ) : (
                        <Visibility fontSize="inherit" />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            {/* Remember Me Checkbox */}
            <FormControlLabel
              label="Remember me"
              control={
                <Checkbox
                  name="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                  sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
                />
              }
              slotProps={{
                typography: {
                  color: "textSecondary",
                  fontSize: theme.typography.pxToRem(14),
                },
              }}
              sx={{ mb: 1 }}
            />

            {/* Login Button */}
            <Button
              type="button"
              variant="outlined"
              color="info"
              size="small"
              disableElevation
              fullWidth
              sx={{ my: 2 }}
              onClick={handleLoginRequest}
            >
              Log In
            </Button>

            {/* Links Row */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={handleSwitchToSignup}
                sx={{ cursor: "pointer" }}
              >
                Sign up
              </Link>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Stack>
          </Box>
        </Fade>
      </Modal>

      {/* EXISTING SIGNUP MODAL */}
      <Modal
        aria-labelledby="signup-modal-title"
        aria-describedby="signup-modal-description"
        className={classes.modal}
        open={signupOpen}
        onClose={handleSignupClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={signupOpen}>
          <Box className={classes.loginPaper}>
            <h2 style={{ marginBottom: 8, textAlign: "center" }}>Sign Up</h2>
            <Alert
              sx={{ mb: 2, px: 1, py: 0.25, width: "100%" }}
              severity="info"
            >
              Create an account to get started!
            </Alert>
            <TextField
              id="signup-username"
              label="Username"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              onChange={handleUserName}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle fontSize="inherit" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              id="signup-phone"
              label="Phone Number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mb: 2 }}
              onChange={handlePhone}
            />
            <TextField
              id="signup-password"
              label="Password"
              variant="outlined"
              size="small"
              fullWidth
              type={showPassword ? "text" : "password"}
              onChange={handlePassword}
              onKeyDown={handlePasswordKeyDown}
              sx={{ mb: 2 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="inherit" />
                        ) : (
                          <Visibility fontSize="inherit" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  color="primary"
                  sx={{ padding: 0.5, "& .MuiSvgIcon-root": { fontSize: 20 } }}
                />
              }
              label="I agree with the T&C"
              slotProps={{
                typography: {
                  color: "textSecondary",
                  fontSize: theme.typography.pxToRem(14),
                },
              }}
              sx={{ mb: 1 }}
            />
            <Button
              variant="outlined"
              color="info"
              size="small"
              disableElevation
              fullWidth
              sx={{ my: 2 }}
              onClick={handleSignupRequest}
              disabled={!termsAccepted}
            >
              Sign Up
            </Button>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 1 }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={handleSwitchToLogin}
                sx={{ cursor: "pointer" }}
              >
                Already have an account? Log in
              </Link>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
