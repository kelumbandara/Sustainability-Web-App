import {
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Divider,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
  Stack,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import queryClient from "../../state/queryClient";
import CloseIcon from "@mui/icons-material/Close";
import {
  Attrition,
  createAttritionDesignation,
  CreateAttritionResignation,
} from "../../api/Attrition/attritionApi";

export const AddNewDesignationDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, reset } = useForm<Attrition>();
  const { isMobile } = useIsMobile();

  const handleCreateDesignation = (data: { designation: string }) => {
    createDesignationMutation(data.designation);
  };
  const {
    mutate: createDesignationMutation,
    isPending: isDesignationCreating,
  } = useMutation({
    mutationFn: createAttritionDesignation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["designation-data"],
      });
      enqueueSnackbar("Designation Created Successfully!", {
        variant: "success",
      });
      reset();
      setOpen(false);
    },
    onError: () => {
      enqueueSnackbar(`Designation Create Failed`, {
        variant: "error",
      });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
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
          Add New Designation
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={() => setOpen(false)}
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
          }}
        >
          <TextField
            {...register("designation", { required: true })}
            required
            id="designation"
            label="Designation"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => setOpen(false)}
          sx={{ color: "var(--pallet-blue)" }}
        >
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          disabled={isDesignationCreating}
          endIcon={
            isDesignationCreating ? <CircularProgress size={20} /> : null
          }
          onClick={handleSubmit(handleCreateDesignation)}
        >
          Add Designation
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export const AddNewResignationTypeDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, reset } = useForm<Attrition>();
  const { isMobile } = useIsMobile();

  const handleCreateFunction = (data: { resignationType: string }) => {
    createResignationMutation(data.resignationType);
  };
  const { mutate: createResignationMutation, isPending: isFunctionCreating } =
    useMutation({
      mutationFn: CreateAttritionResignation,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["resignation-data"],
        });
        enqueueSnackbar("Resignation Type Created Successfully!", {
          variant: "success",
        });
        reset();
        setOpen(false);
      },
      onError: () => {
        enqueueSnackbar(`Resignation Type Create Failed`, {
          variant: "error",
        });
      },
    });

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isMobile}
      fullWidth
      maxWidth="md"
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
          Add New Resignation Type
        </Typography>
        <IconButton
          aria-label="open drawer"
          onClick={() => setOpen(false)}
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
          }}
        >
          <TextField
            {...register("resignationType", { required: true })}
            required
            id="resignationType"
            label="Resignation Type"
            size="small"
            fullWidth
            sx={{ marginBottom: "0.5rem" }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "1rem" }}>
        <Button
          onClick={() => setOpen(false)}
          sx={{ color: "var(--pallet-blue)" }}
        >
          Cancel
        </Button>
        <CustomButton
          variant="contained"
          sx={{
            backgroundColor: "var(--pallet-blue)",
          }}
          size="medium"
          disabled={isFunctionCreating}
          endIcon={isFunctionCreating ? <CircularProgress size={20} /> : null}
          onClick={handleSubmit(handleCreateFunction)}
        >
          Add New Resignation
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};