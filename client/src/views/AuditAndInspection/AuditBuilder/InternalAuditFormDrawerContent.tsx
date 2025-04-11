import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DrawerContentItem } from "../../../components/ViewDataDrawer";
import useIsMobile from "../../../customHooks/useIsMobile";
import theme from "../../../theme";
import {
  InternalAudit,
  InternalAuditQuestionGroup,
} from "../../../api/AuditAndInspection/internalAudit";
import { format } from "date-fns";
import BookmarkIcon from "@mui/icons-material/Bookmark";

function InternalAuditFormDrawerContent({
  internalAuditForm,
}: {
  internalAuditForm: InternalAudit;
}) {
  return (
    <Stack spacing={1} sx={{ padding: theme.spacing(1) }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <DrawerContentItem
          label="Name"
          value={internalAuditForm.name}
          sx={{ flex: 1 }}
        />
        <DrawerContentItem
          label="Created At"
          value={format(
            new Date(internalAuditForm.created_at),
            "yyyy-MM-dd hh:mm aa"
          )}
          sx={{ flex: 1 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <DrawerContentItem
          label="Description"
          value={internalAuditForm.description}
          sx={{ flex: 1 }}
        />
      </Box>
      <Box sx={{ paddingY: "1rem" }}>
        <Typography
          variant="body2"
          sx={{ paddingBottom: 0, color: "var(--pallet-grey)" }}
        >
          Question Groups
        </Typography>
      </Box>
      <Stack>
        {internalAuditForm.questionGroups.map((group) => (
          <SectionAccordion questionGroup={group} key={group.queGroupId} />
        ))}
      </Stack>
    </Stack>
  );
}

const SectionAccordion = ({
  questionGroup,
}: {
  questionGroup: InternalAuditQuestionGroup;
}) => {
  const { isMobile } = useIsMobile();
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span">{questionGroup.groupName}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TableContainer
          sx={{
            overflowX: "auto",
            maxWidth: isMobile ? "88vw" : "100%",
          }}
        >
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: "var(--pallet-lighter-blue)" }}>
              <TableRow>
                <TableCell align="center">Color Code</TableCell>
                <TableCell align="left">Question</TableCell>
                <TableCell align="center">Allocated Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionGroup?.questions.map((row) => {
                return (
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {RenderAuditQuestionColorTag(row.colorCode)}
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        marginTop: "0.5rem",
                      }}
                    >
                      <Typography variant="body2">{row.question}</Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        marginTop: "0.5rem",
                      }}
                    >
                      <Typography variant="body2">
                        {row.allocatedScore}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default InternalAuditFormDrawerContent;

export function RenderAuditQuestionColorTag(
  color: string,
  fontSize?: "small" | "inherit" | "large" | "medium"
) {
  return (
    <BookmarkIcon
      fontSize={fontSize ?? "small"}
      sx={{
        color: color,
      }}
    />
  );
}
