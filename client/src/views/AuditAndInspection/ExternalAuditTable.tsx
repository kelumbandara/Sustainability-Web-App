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
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';

import theme from "../../theme";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import { useState,useEffect  } from "react";
import ViewDataDrawer, { DrawerHeader } from "../../components/ViewDataDrawer";
import AddIcon from "@mui/icons-material/Add";
import { format } from "date-fns";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import { useSnackbar } from "notistack";
import { ExternalAudit,fetchAuditAllExternalData } from "../../api/AuditAndInspection/externalAuditApi";
import AddOrEditExternalAuditDialog from "./AddOrEditExternalAudit";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[200],
      ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
      }),
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
      ...theme.applyStyles('dark', {
        backgroundColor: '#308fe8',
      }),
    },
}));

function ExternalAuditTable() {
  const { enqueueSnackbar } = useSnackbar();
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ExternalAudit | null>(null);
  const [openAddOrEditDialog, setOpenAddOrEditDialog] = useState(false);
  const [externalAuditData, setExternalAuditData] = useState<ExternalAudit[]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "External Audit Management" },
  ];

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAuditAllExternalData();
        setExternalAuditData(data);
      } catch (error) {
        console.error("Error fetching audit data:", error);
        enqueueSnackbar("Failed to fetch audit data. Please try again later.", { variant: "error" });
      }
    };

    fetchData();
  }, [enqueueSnackbar]);

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
        <PageTitle title="External Audit Management" />
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
              Add Audit Schedule
            </Button>
          </Box>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell>Reference</TableCell>
                <TableCell align="right">Audit Date</TableCell>
                <TableCell align="right">Expiry Date</TableCell>
                <TableCell align="right">Audit Type</TableCell>
                <TableCell align="right">Audit Category</TableCell>
                <TableCell align="right">Audit Standard</TableCell>
                <TableCell align="right">Customer</TableCell>
                <TableCell align="right">Audit Firm</TableCell>
                <TableCell align="right">Division</TableCell>
                <TableCell align="right">Audit Status</TableCell>
                <TableCell align="right">Lapsed Status</TableCell>
                <TableCell align="right">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {externalAuditData?.length > 0 ? (
                externalAuditData?.map((row) => (
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
                      {row.auditDate ? format(new Date(row.auditDate), "yyyy-MM-dd") : "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      {row.expiryDate ? format(new Date(row.auditDate), "yyyy-MM-dd") : "N/A"}
                    </TableCell>
                    <TableCell align="right">{row.auditType}</TableCell>
                    <TableCell align="right">{row.auditCategory}</TableCell>
                    <TableCell align="right">{row.auditStandard}</TableCell>
                    <TableCell align="right">{row.customer}</TableCell>
                    <TableCell align="right">{row.auditFirm}</TableCell>
                    <TableCell align="right">{row.division}</TableCell>
                    <TableCell align="right"><BorderLinearProgress variant="determinate" value={row.auditStatus} /></TableCell>
                    <TableCell align="right">{row.lapsedStatus}</TableCell>
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
              title="External Audit Details"
              handleClose={() => setOpenViewDrawer(false)}
              onEdit={() => {
                setSelectedRow(selectedRow);
                setOpenAddOrEditDialog(true);
              }}
              onDelete={() => setDeleteDialogOpen(true)}
            />

            {selectedRow && (
              <Stack>
                {/* <ViewAccidentContent accident={selectedRow} /> */}
              </Stack>
            )}
          </Stack>
        }
      />
      {openAddOrEditDialog && (
        <AddOrEditExternalAuditDialog
          open={openAddOrEditDialog}
          handleClose={() => {
            setSelectedRow(null);
            setOpenViewDrawer(false);
            setOpenAddOrEditDialog(false);
          }}
          onSubmit={(data) => {
            if (selectedRow) {
              console.log("Updating document", data);
              setExternalAuditData(
                externalAuditData.map((risk) => (risk.id === data.id ? data : risk))
              ); // Update the document in the list if it already exists
              enqueueSnackbar("External Audit Details Updated Successfully!", {
                variant: "success",
              });
            } else {
              console.log("Adding new External Audit", data);
              setExternalAuditData([...externalAuditData, data]); // Add new document to the list
              // enqueueSnackbar("External Audit Report Created Successfully!", {
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
          title="Remove External Audit Confirmation"
          content={
            <>
              Are you sure you want to remove this Audit Schedule?
              <Alert severity="warning" style={{ marginTop: "1rem" }}>
                This action is not reversible.
              </Alert>
            </>
          }
          handleClose={() => setDeleteDialogOpen(false)}
          deleteFunc={async () => {
            setExternalAuditData(
                externalAuditData.filter((doc) => doc.id !== selectedRow.id)
            );
          }}
          onSuccess={() => {
            setOpenViewDrawer(false);
            setSelectedRow(null);
            setDeleteDialogOpen(false);
            enqueueSnackbar("External Audit Deleted Successfully!", {
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

export default ExternalAuditTable;
