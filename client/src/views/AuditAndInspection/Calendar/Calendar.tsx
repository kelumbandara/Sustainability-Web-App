import { format, getDay, parse, startOfWeek } from "date-fns";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import * as dateFns from "date-fns";
import { myevents } from "../../../api/sampleData/CalendarData";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, Stack } from "@mui/material";
import Breadcrumb from "../../../components/BreadCrumb";
import PageTitle from "../../../components/PageTitle";
import theme from "../../../theme";
import ViewDataDrawer from "../../../components/ViewDataDrawer";
import { useState } from "react";
import ViewAuditContent from "./ViewAuditContent";

const locales = {
  "en-US": dateFns,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const AuditCalendar = (props) => {
  const [openViewDrawer, setOpenViewDrawer] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
        <PageTitle title="Audit Calendar" />
        <Box sx={{ marginX: 1, marginY: 3 }}>
          <Calendar
            localizer={localizer}
            events={myevents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={["month", "week", "day"]}
            defaultView="month"
            popup
            components={{
              event: (event) => (
                <span>
                  <span style={{ fontSize: "0.8rem" }}>{event.title}</span>
                  <br />
                  <span>{event.desc}</span>
                </span>
              ),
            }}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setOpenViewDrawer(true);
            }}
          />
        </Box>
      </Box>
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        drawerContent={
          <Stack spacing={1} sx={{ paddingX: theme.spacing(1) }}>
            {selectedEvent && (
              <Stack>
                <ViewAuditContent />
              </Stack>
            )}
          </Stack>
        }
      />
    </Stack>
  );
};
