import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import CloseIcon from "@mui/icons-material/Close";
import { Grievance } from "../../api/Grievance/grievanceApi";
import { useState } from "react";
import ReviewStars from "../../components/ReviewStars";
import RichTextComponent from "../../components/RichTextComponent";

const AddEmployeeReviewDialog = ({
  open,
  onClose,
  onSubmit,
  grievance,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: ({ feedback, stars }: { feedback: string; stars: number }) => void;
  grievance: Grievance;
}) => {
  const { isMobile } = useIsMobile();
  const [rating, setRating] = useState(0);
  const { register, handleSubmit, control, reset } = useForm<Grievance>();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth={"md"}
      PaperProps={{
        style: {
          backgroundColor: grey[50],
        },
        component: "form",
      }}
    >
      <DialogTitle
        sx={{
          paddingY: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" component="div">
          {`Employee Review for ${grievance.type}`}
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={onClose}
          edge="start"
          sx={{
            color: "#024271",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Alert
            severity="info"
            sx={{
              marginBottom: "1rem",
            }}
          >
            This is a one time review for the grievance. Please provide your
            feedback and rating for the employee's handling of this grievance.
          </Alert>
          <ReviewStars getRating={setRating} />
          <Box
            sx={{
              margin: "0.5rem",
              marginTop: "1rem",
              width: "100%",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", marginBottom: "0.5rem" }}
            >
              Feedback
            </Typography>
            <Controller
              control={control}
              name={"feedback"}
              {...register("feedback")}
              render={({ field }) => {
                return (
                  <RichTextComponent
                    onChange={(e) => field.onChange(e)}
                    placeholder={field.value ?? ""}
                  />
                );
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: "1rem" }}>
        <Button onClick={onClose} sx={{ color: "var(--pallet-blue)" }}>
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          onClick={handleSubmit((data) => {
            onSubmit({ feedback: data.feedback, stars: rating });
            reset();
          })}
        >
          Add Review
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddEmployeeReviewDialog;
