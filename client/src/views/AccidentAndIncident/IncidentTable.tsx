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
import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useState } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { 
  Incident,
  getIncidentsList,
  createIncidents,
  updateIncident,
  deleteIncident
 } from "../../api/accidentAndIncidentApi";
import AddOrEditIncidentDialog from "./AddOrEditIncidentDialog";
import { sampleIncidentData } from "../../api/sampleData/incidentData";
import ViewIncidentContent from "./ViewIncidentContent";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";

function IncidentTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Incident>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [incidentData, setIncidentData] = useState<Incident[]>(sampleIncidentData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Incident Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: incidentData, isFetching: isIncidentDataFetching } = useQuery({
    queryKey: ["incidents"],
    queryFn: getIncidentsList,
  });

  const { mutate: createIncidentMutation } = useMutation({
    mutationFn: createIncidents,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      enqueueSnackbar("Incident Report Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Incident Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateIncidentMutation } = useMutation({
    mutationFn: updateIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      enqueueSnackbar("Incident Report Update Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Incident Updation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteIncidentMutation } = useMutation({
    mutationFn: deleteIncident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      enqueueSnackbar("Incident Report Delete Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Incident Deletion Failed`, {
        variant: "error",
      });
    },
  });

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
        <PageTitle title="Incident Management" />
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
              Report an incident
            </Button>
          </Box>
          {isIncidentDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Incident Date</TableCell>
                <TableCell align="right">Incident Time</TableCell>
                <TableCell align="right">Severity</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Location</TableCell>
                <TableCell align="right">Circumstances</TableCell>
                <TableCell align="right">Assignee</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incidentData?.length > 0 ? (
                incidentData?.map((row) => (
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
                      {row.referenceNumber}
                    </TableCell>
                    <TableCell align="right">
                      {row?.incidentDate
                        ? format(row?.incidentDate, "yyyy-MM-dd")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">
                      {row?.incidentTime
                        ? format(row?.incidentTime, "HH:mm")
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.severity}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">{row.location}</TableCell>
                    <TableCell align="right">{row.circumstances}</TableCell>
                    <TableCell align="right">{row.assignee}</TableCell>
                    <TableCell align="right">{row.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    <Typography variant="body2">No Records found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        fullScreen={true}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            <DrawerHeader
              title="Incident Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
            />

            {selectedRow && (
              <Stack>
                <ViewIncidentContent incident={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditIncidentDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              console.log("Updating document", data);
              updateIncidentMutation(data)
              // setIncidentData(
              //   incidentData.map((risk) => (risk.id === data.id ? data : risk))
              // ); // Update the document in the list if it already exists
              // enqueueSnackbar("Incident Details Updated Successfully!", {
              //   variant: "success",
              // });
            } else {
              console.log("Adding new incident", data);
              createIncidentMutation(data)
              // setIncidentData([...incidentData, data]); // Add new document to the list
              // enqueueSnackbar("Incident Created Successfully!", {
              //   variant: "success",
              // });
            }
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          defaultValues={selectedRow}
        />
      )}
      {deleteDialogOpen && (
        <DeleteConfirmationModal
          open={deleteDialogOpen}
          title="Remove Incident Confirmation"
          content={
            <>
              Are you sure you want to remove this incident?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            deleteIncidentMutation(selectedRow.id)
            // setIncidentData(
            //   incidentData.filter((doc) => doc.id !== selectedRow.id)
            // );
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            // enqueueSnackbar("Incident Deleted Successfully!", {
            //   variant: "success",
            // });
          }}
          handleReject={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
          }}
        />
      )}
    </Stack>
  );
}

export default IncidentTable;
