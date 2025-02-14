import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useForm } from "react-hook-form";
import { AccidentWitness } from "../../api/accidentAndIncidentApi";
import {
  sampleDivisions,
  sampleDepartments,
} from "../../api/sampleData/documentData";
import CustomButton from "../../components/CustomButton";
import useIsMobile from "../../customHooks/useIsMobile";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery } from "@tanstack/react-query";
import { fetchDivision } from "../../api/divisionApi";
import { fetchDepartmentData } from "../../api/departmentApi";

const AddOrEditWitnessDialog = ({
  open,
  onClose,
  onSubmit,
  defaultValues: defaultWitness,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AccidentWitness) => void;
  defaultValues?: AccidentWitness;
}) => {
  const { isMobile } = useIsMobile();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<AccidentWitness>({
    defaultValues: defaultWitness,
  });
  console.log("defaultValues", defaultWitness);
  const { data: divisionData, isFetching: isCategoryDataFetching } = useQuery({
    queryKey: ["divisions"],
    queryFn: fetchDivision,
  });

  const { data: departmentData, isFetching: isDepartmentDataFetching } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentData,
  });

  // useEffect(() => {
  //   if (defaultValues) {
  //     reset(defaultValues);
  //   } else {
  //     reset();
  //   }
  // }, [reset, defaultValues]);
  // console.log("def", defaultValues);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      fullWidth
      maxWidth={"sm"}
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
          {defaultWitness ? "Edit Witness" : "Add Witness"}
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
            padding: "1rem",
            flex: { lg: 3, md: 1 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              required
              id="employeeId"
              label="Employee ID"
              error={!!errors.employeeId}
              size="small"
              sx={{ margin: "0.5rem" }}
              {...register("employeeId", { required: true })}
              defaultValue={defaultWitness?.employeeId || ""}
            />
            <TextField
              {...register("name", { required: true })}
              required
              id="name"
              label="Name"
              error={!!errors.name}
              size="small"
              sx={{ margin: "0.5rem" }}
              defaultValue={defaultWitness?.name || ""}
            />
            <Autocomplete
              {...register("division", { required: true })}
              size="small"
              options={divisionData?.length ? divisionData.map((division) => division.divisionName) : []}
              defaultValue={defaultWitness?.division || ""}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.division}
                  label="Division"
                  name="division"
                />
              )}
            />
            <Autocomplete
              {...register("department", { required: true })}
              size="small"
              options={departmentData?.length ? departmentData.map((department) => department.department) : []}
              defaultValue={defaultWitness?.department || ""}
              sx={{ flex: 1, margin: "0.5rem" }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={!!errors.department}
                  label="Department"
                  name="department"
                />
              )}
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
            onSubmit(data);
            reset();
          })}
        >
          Add Witness
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrEditWitnessDialog;
