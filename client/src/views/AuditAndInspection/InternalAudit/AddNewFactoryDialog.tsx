import {
  Typography,
  Dialog,
  DialogTitle,
  IconButton,
  Divider,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Autocomplete,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  getContactPersonList,
  createContactPerson,
  createFactory,
  Factory,
} from "../../../api/AuditAndInspection/internalAudit";
import CustomButton from "../../../components/CustomButton";
import useIsMobile from "../../../customHooks/useIsMobile";
import queryClient from "../../../state/queryClient";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

export const AddNewFactoryDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Factory>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [openAddNewContactPersonDialog, setOpenAddNewContactPersonDialog] =
    useState(false);

  const { data: contactPeopleData } = useQuery({
    queryKey: ["contact-people"],
    queryFn: getContactPersonList,
  });

  const { isMobile } = useIsMobile();

  const { mutate: createFactoryMutation, isPending } = useMutation({
    mutationFn: createFactory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["factories"] });
      enqueueSnackbar("Factory Created Successfully!", {
        variant: "success",
      });
      setOpen(false);
    },
    onError: () => {
      enqueueSnackbar(`Factory Create Failed`, {
        variant: "error",
      });
    },
  });

  const AddNewContactPersonButton = (props) => (
    <li
      {...props}
      variant="contained"
      style={{
        backgroundColor: "var(--pallet-lighter-blue)",
        color: "var(--pallet-blue)",
        textTransform: "none",
        margin: "0.5rem",
        borderRadius: "0.3rem",
        display: "flex",
        flexDirection: "row",
      }}
      size="small"
      // onClick closes the menu
      onMouseDown={() => {
        setOpenAddNewContactPersonDialog(true);
      }}
    >
      <AddIcon />
      <Typography variant="body2" component="div">
        Add a new contact person
      </Typography>
    </li>
  );

  const AddNewContactPersonDialog = () => {
    const { register, handleSubmit } = useForm();
    const { enqueueSnackbar } = useSnackbar();

    const { mutate: createContactPersonMutation, isPending } = useMutation({
      mutationFn: createContactPerson,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contact-people"] });
        enqueueSnackbar("Contact Person Created Successfully!", {
          variant: "success",
        });
        setOpenAddNewContactPersonDialog(false);
      },
      onError: () => {
        enqueueSnackbar(`Contact Person Create Failed`, {
          variant: "error",
        });
      },
    });

    return (
      <Dialog
        open={openAddNewContactPersonDialog}
        onClose={() => setOpenAddNewContactPersonDialog(false)}
        fullScreen={isMobile}
        fullWidth
        maxWidth="xs"
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
            Add New Contact Person
          </Typography>
          <IconButton
            aria-label="open drawer"
            onClick={() => setOpenAddNewContactPersonDialog(false)}
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
              {...register("name", { required: true })}
              required
              id="name"
              label="name"
              size="small"
              fullWidth
              sx={{ marginBottom: "0.5rem" }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setOpenAddNewContactPersonDialog(false)}
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
            disabled={isPending}
            endIcon={isPending ? <CircularProgress size={20} /> : null}
            onClick={handleSubmit((data) => createContactPersonMutation(data))}
          >
            Add Contact Person
          </CustomButton>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
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
          Add a new factory
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
          <Box
            sx={{
              margin: "0.5rem",
            }}
          >
            <TextField
              {...register("factoryName", { required: true })}
              required
              id="factoryName"
              label="Factory Name"
              size="small"
              fullWidth
              error={!!errors.factoryName}
              helperText={errors.factoryName ? "Required" : ""}
            />
          </Box>
          <Box
            sx={{
              margin: "0.5rem",
            }}
          >
            <TextField
              {...register("factoryEmail", { required: true })}
              required
              id="factoryEmail"
              label="Factory Email"
              size="small"
              fullWidth
              error={!!errors.factoryEmail}
              helperText={errors.factoryEmail ? "Required" : ""}
              type="email"
            />
          </Box>
          <Box
            sx={{
              margin: "0.5rem",
            }}
          >
            <TextField
              {...register("factoryAddress", { required: true })}
              required
              id="factoryAddress"
              label="Factory Address"
              size="small"
              fullWidth
              error={!!errors.factoryAddress}
              helperText={errors.factoryAddress ? "Required" : ""}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <TextField
              {...register("factoryContactNumber", {
                required: {
                  value: true,
                  message: "Required",
                },
                min: {
                  value: 0,
                  message: "Contact number must be a positive number",
                },
              })}
              required
              id="factoryContactNumber"
              label="Contact Number"
              type="tel"
              size="small"
              fullWidth
              sx={{
                margin: "0.5rem",
              }}
              error={!!errors.factoryContactNumber}
              helperText={
                errors.factoryContactNumber
                  ? errors.factoryContactNumber.message ?? "Required"
                  : ""
              }
            />
            <TextField
              {...register("designation", { required: true })}
              required
              id="designation"
              label="Designation"
              size="small"
              fullWidth
              sx={{ margin: "0.5rem" }}
              error={!!errors.designation}
              helperText={errors.designation ? "Required" : ""}
            />
          </Box>
          <Box sx={{ flex: 1, margin: "0.5rem" }}>
            <Autocomplete
              {...register("factoryContactPerson", { required: true })}
              size="small"
              noOptionsText={
                <>
                  <Typography variant="body2" color="inherit" gutterBottom>
                    No matching Items
                  </Typography>
                </>
              }
              options={[
                ...(contactPeopleData?.length ? contactPeopleData : []),
                "$ADD_NEW_CONTACT_PERSON",
              ]}
              getOptionLabel={(option) => option.name || ""}
              onChange={(_, data) => {
                setValue("factoryContactPersonId", data.id);
                setValue("factoryContactPerson", data);
                setValue("factoryContactPersonName", data.name);
              }}
              renderOption={(props, option) => (
                <>
                  {option === "$ADD_NEW_CONTACT_PERSON" ? (
                    <AddNewContactPersonButton {...props} />
                  ) : (
                    <li {...props} key={option}>
                      {option.name}
                    </li>
                  )}
                </>
              )}
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={!!errors.factoryContactPerson}
                  label="Factory Contact Person"
                  name="factoryContactPerson"
                />
              )}
            />
          </Box>
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
          onClick={handleSubmit((data) => createFactoryMutation(data))}
          disabled={isPending}
          endIcon={isPending ? <CircularProgress size={20} /> : null}
        >
          Add Factory
        </CustomButton>
      </DialogActions>
      <AddNewContactPersonDialog />
    </Dialog>
  );
};

export const AddNewFactoryButton = (props) => (
  <li
    {...props}
    variant="contained"
    style={{
      backgroundColor: "var(--pallet-lighter-blue)",
      color: "var(--pallet-blue)",
      textTransform: "none",
      margin: "0.5rem",
      borderRadius: "0.3rem",
      display: "flex",
      flexDirection: "row",
    }}
    size="small"
    // onClick closes the menu
    onMouseDown={() => {
      props.onMouseDown();
    }}
  >
    <AddIcon />
    <Typography variant="body2" component="div">
      Add a new factory
    </Typography>
  </li>
);
