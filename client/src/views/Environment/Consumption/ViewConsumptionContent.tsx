import {
  AppBar,
  Box,
  Divider,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import { format } from "date-fns";
import { useState } from "react";
import theme from "../../../theme";
import useIsMobile from "../../../customHooks/useIsMobile";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import ListIcon from "@mui/icons-material/List";
import { Document } from "../../../api/documentApi";
import HistoryIcon from "@mui/icons-material/History";
import { FileItemsViewer } from "../../../components/FileItemsViewer";
import { StorageFile } from "../../../utils/StorageFiles.util";
import { Environment } from "../../../api/Environment/environmentApi";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function ViewDocumentContent({ consumption }: { consumption: Environment }) {
  const [activeTab, setActiveTab] = useState(0);
  const { isTablet } = useIsMobile();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log("event", event);
    setActiveTab(newValue);
  };
  return (
    <Stack
      sx={{
        display: "flex",
        flexDirection: isTablet ? "column" : "row",
        padding: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          flex: { lg: 3, md: 1 },
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "0.5rem",
          borderRadius: "0.3rem",
        }}
      >
        <Box
          sx={{
            p: "0.5rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <DrawerContentItem
            label="Reference"
            value={consumption?.referenceNumber}
            sx={{ flex: 1 }}
          />
          <DrawerContentItem
            label="Reported Date"
            value={
              consumption.created_at
                ? format(new Date(consumption.created_at), "yyyy-MM-dd")
                : "N/A"
            }
            sx={{ flex: 1 }}
          />
        </Box>
        <Divider />
        <DrawerContentItem
          label="Total Workforce"
          value={consumption?.totalWorkForce}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Number of Days Worked"
          value={consumption?.numberOfDaysWorked}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Area in Squre Meter (m2)"
          value={consumption?.area}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Total product produced/shipped (Pcs)"
          value={consumption?.totalProuctProducedPcs}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Total product produced/shipped (Kg)"
          value={consumption?.totalProuctProducedkg}
          sx={{ flex: 1 }}
        />
        <Table aria-label="activity stream table">
          <TableHead
            sx={{
              backgroundColor: "var(--pallet-lighter-grey)",
            }}
          >
            <TableRow>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Source</TableCell>
              <TableCell align="center">Unit</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="center">Amount</TableCell>
              <TableCell align="center">GHG in Tonnes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consumption?.impactConsumption?.length > 0 ? (
              consumption?.impactConsumption?.map((row) => (
                <TableRow
                  key={`${row.consumptionsId}`}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: "pointer",
                  }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {row.category}
                  </TableCell>
                  <TableCell align="center">{row.source}</TableCell>
                  <TableCell align="center">{row.unit}</TableCell>
                  <TableCell align="center">{row.quentity}</TableCell>
                  <TableCell align="center">{row.amount}</TableCell>
                  <TableCell align="center">{row.ghgInTonnes}</TableCell>
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: { lg: 1, md: 1 },
          flexDirection: "column",
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          padding: "1rem",
          borderRadius: "0.3rem",
          marginY: isTablet ? "0.5rem" : 0,
          marginLeft: isTablet ? 0 : "0.5rem",
          height: "fit-content",
        }}
      >
        <DrawerContentItem label="Reported By" value={consumption.createdByUserName} />
        <DrawerContentItem
          label="Division"
          value={consumption?.division}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Year"
          value={consumption?.year}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Month"
          value={consumption?.month}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Reviwer"
          value={consumption?.reviewer.name}
          sx={{ flex: 1 }}
        />
      </Box>
    </Stack>
  );
}

export default ViewDocumentContent;
