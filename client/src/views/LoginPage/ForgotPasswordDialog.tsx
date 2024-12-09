import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Typography, useMediaQuery } from "@mui/material";
import theme from "../../theme";

function ForgotPasswordDialog({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          console.log(email);
          handleClose();
        },
      }}
      fullScreen={isMobile}
    >
      <DialogTitle>Don't Worry</DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          sx={{
            color: "#525252",
          }}
        >
          We are here to help you to recover your password. Enter the email
          associated with your account and we'll send an email with instructions
          to reset your password.
        </Typography>
        <TextField
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          size="small"
          sx={{
            marginTop: "1rem",
          }}
        />
      </DialogContent>
      <DialogActions sx={{ marginBottom: "0.5rem", marginRight: "0.5rem" }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPasswordDialog;
