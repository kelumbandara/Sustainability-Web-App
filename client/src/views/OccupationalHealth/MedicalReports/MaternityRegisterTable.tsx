import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import { useSnackbar } from "notistack";
import {
  createBenefit,
  deleteBenefit,
  getMaternityRegisterList,
  MaternityRegister,
  updateBenefit,
} from "../../../api/OccupationalHealth/maternityRegisterApi";
import { sampleMaternityRegisterData } from "../../../api/sampleData/maternityRegisterData";
import theme from "../../../theme";
import PageTitle from "../../../components/PageTitle";
import Breadcrumb from "../../../components/BreadCrumb";
import ViewDataDrawer, {
  DrawerHeader,
} from "../../../components/ViewDataDrawer";
import ViewMaternityRegisterContent from "./ViewMaternityRegisterContent";
import DeleteConfirmationModal from "../../../components/DeleteConfirmationModal";
import AddOrEditMaternityRegisterDialog from "./AddOrEditMaternityRegisterDialog";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../../state/queryClient";

function MaternityRegisterTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<MaternityRegister>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [maternityRegisterList, setMaternityRegisterList] = useState<
    MaternityRegister[]
  >(sampleMaternityRegisterData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: maternityRegisterData,
    isFetching: isFetchingMaternityDataList,
  } = useQuery({
    queryKey: ["maternity-register"],
    queryFn: getMaternityRegisterList,
  });

  const { mutate: createPatientMutation, isPending: isCreating } = useMutation({
    mutationFn: createBenefit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternity-register"] });
      enqueueSnackbar("Benefit Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Benefit Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateBenefitMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateBenefit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternity-register"] });
      enqueueSnackbar("Benefit Update Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Benefit Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteBenefitMutation, isPending: isDeleting } = useMutation({
    mutationFn: deleteBenefit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maternity-register"] });
      enqueueSnackbar("Benefit Delete Successfully!", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar(`Benefit Delete Failed`, {
        variant: "error",
      });
    },
  });

  console.log("maternityRegisterData", maternityRegisterData);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Maternity Register" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return (
    <Stack>
      <Box
        sx={{
          padding: theme.spacing(2),
          boxShadow: 2,
          marginY: 2,
          borderRadius: 1,
          overflowX: "hidden",
        }}
      >
        <PageTitle title="Maternity Register" />
        <Breadcrumb breadcrumbs={breadcrumbItems} />
      </Box>
      <Stack sx={{ alignItems: "center" }}>
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            overflowX: "auto",
            maxWidth: isMobile ? "88vw" : "100%",
          }}
        >
          <Box
            sx={{
              padding: theme.spacing(2),
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              sx={{ backgroundColor: "var(--pallet-blue)" }}
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedRow(null);
                setOpenAddOrEditDialog(true);
              }}
            >
              Add New Benefit
            </Button>
          </Box>{" "}
          {(isFetchingMaternityDataList ||
            isCreating ||
            isUpdating ||
            isDeleting) && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Employee ID</TableCell>
                <TableCell align="right">Employee Name</TableCell>
                <TableCell align="right">Application ID</TableCell>
                <TableCell align="right">Application Date</TableCell>
                <TableCell align="right">Leave Status</TableCell>
                <TableCell align="right">Rejoining Date</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {maternityRegisterData?.length > 0 ? (
                maternityRegisterData.map((row) => (
                  <TableRow
                    key={`${row.id}`}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedRow(row);
                      setOpenViewDrawer(true);
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.employeeId}
                    </TableCell>
                    <TableCell align="right">{row.employeeName}</TableCell>
                    <TableCell align="right">{row.applicationId}</TableCell>
                    <TableCell align="right">
                      {row?.applicationDate
                        ? format(new Date(row.applicationDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.leaveStatus}</TableCell>
                    <TableCell align="right">
                      {row?.reJoinDate
                        ? format(new Date(row.reJoinDate), "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row?.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Records Found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openViewDrawer}
        fullScreen={true}
        handleClose={() => setOpenViewDrawer(false)}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Benefit Request"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
            />

            {selectedRow && (
              <Stack>
                <ViewMaternityRegisterContent maternityRegister={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditMaternityRegisterDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              updateBenefitMutation(data);
            } else {
              createPatientMutation(data);
            }
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Benefit Request Confirmation"
          content={
            <>
              Are you sure you want to remove this benefit request?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            if (selectedRow) {
              deleteBenefitMutation(selectedRow.id);
            }
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: ["maternity-register"],
            });
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
          }}
          handleReject={() => {
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default MaternityRegisterTable;
