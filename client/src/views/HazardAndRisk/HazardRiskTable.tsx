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
import AddOrEditDocumentDialog from "./AddOrEditHazardRiskDialog";
import { differenceInDays, format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { sampleHazardRiskData } from "../../api/sampleData/hazardRiskData";
import { 
  HazardAndRisk, 
  HazardAndRiskStatus, 
  createHazardRisk, 
  getHazardRiskList,
  updateHazardRisk,
  deleteHazardRisk  
} from "../../api/hazardRiskApi";
import ViewHazardOrRiskContent from "./ViewHazardRiskContent";
import PermissionWrapper from "../../components/PermissionWrapper";
import {
  defaultViewerPermissions,
  PermissionKeys,
} from "../Administration/SectionList";
import { useMutation, useQuery } from "@tanstack/react-query";
import queryClient from "../../state/queryClient";

function HazardRiskTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<HazardAndRisk>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  // const [riskData, setRiskData] = useState<HazardAndRisk[]>(sampleHazardRiskData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const userPermissionObject = defaultViewerPermissions;

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Hazard & Risk Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  const { data: riskData, isFetching: isRiskDataFetching } = useQuery({
    queryKey: ["hazardRisks"],
    queryFn: getHazardRiskList,
  });

  const { mutate: createHazardRiskMutation, } = useMutation({
    mutationFn: createHazardRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      enqueueSnackbar("Hazard Risk Report Created Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Hazard Risk Creation Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: updateHazardRiskMutation } = useMutation({
    mutationFn: updateHazardRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      enqueueSnackbar("Hazard Risk Report Update Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Hazard Risk Update Failed`, {
        variant: "error",
      });
    },
  });

  const { mutate: deleteHazardRiskMutation } = useMutation({
    mutationFn: deleteHazardRisk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hazardRisks"] });
      enqueueSnackbar("Hazard Risk Report Deleted Successfully!", {
        variant: "success",
      });
      setSelectedRow(null);
      setOpenViewDrawer(false);
      setOpenAddOrEditDialog(false);
    },
    onError: () => {
      enqueueSnackbar(`Hazard Risk Delete Failed`, {
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
        <PageTitle title="Hazard & Risk Management" />
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
              disabled={
               ! userPermissionObject[PermissionKeys.HAZARD_RISK_REGISTER_CREATE] //permission !
              }
            >
              Report a Hazard or Risk
            </Button>
          </Box>
          {isRiskDataFetching && <LinearProgress sx={{ width: "100%" }} />}
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell align="right">Reference</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Due Date</TableCell>
                <TableCell align="right">Delayed Days</TableCell>
                <TableCell align="right">Reporter</TableCell>
                <TableCell align="right">Responsible</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {riskData?.length > 0 ? (
                riskData?.map((row) => (
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
                      {row.createdDate ? format(new Date(row.createdDate), "yyyy-MM-dd") : "N/A"}
                    </TableCell>
                    <TableCell align="right">{row.id}</TableCell>
                    <TableCell align="right">{row.category}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right">
                      {format(new Date(row.dueDate), "yyyy-MM-dd")}
                    </TableCell>
                    <TableCell align="right">
                      {row.dueDate
                        ? differenceInDays(new Date(), row.dueDate)
                        : "--"}
                    </TableCell>
                    <TableCell align="right">{row.createdByUser}</TableCell>
                    <TableCell align="right">{row.assignee}</TableCell>
                    <TableCell align="right">
                      {row.status === HazardAndRiskStatus.OPEN ? (
                        <Typography sx={{ color: "var(--pallet-blue)" }}>
                          Open
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "var(--pallet-orange)" }}>
                          Draft
                        </Typography>
                      )}
                    </TableCell>
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
              title="Hazard or Risk Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
            />

            {selectedRow && (
              <Stack>
                <ViewHazardOrRiskContent hazardOrRisk={selectedRow} />
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditDocumentDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              console.log("Updating document", data);
              updateHazardRiskMutation(data)
              // setRiskData(
              //   riskData.map((risk) => (risk.id === data.id ? data : risk))
              // ); // Update the document in the list if it already exists
              // enqueueSnackbar("Details Updated Successfully!", {
              //   variant: "success",
              // });
            } else {
              console.log("Adding new hazard/risk", data);
              // setRiskData([...riskData, data]); // Add new document to the list
              createHazardRiskMutation(data)
              // enqueueSnackbar("Hazard/Risk Created Successfully!", {
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
          title="Remove Hazard/Risk Confirmation"
          content={
            <>
              Are you sure you want to remove this hazard or risk?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            // setRiskData(riskData.filter((doc) => doc.id !== selectedRow.id));
            deleteHazardRisk(selectedRow.id);
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("Hazard Risk Record Deleted Successfully!", {
              variant: "success",
            });
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

export default HazardRiskTable;
