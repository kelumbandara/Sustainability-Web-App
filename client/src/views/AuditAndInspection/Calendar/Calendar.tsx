import {
  format,
  getDay,
  parse,
  startOfDay,
  startOfWeek,
  endOfDay,
} from "date-fns";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import * as dateFns from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box, LinearProgress, Stack } from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import theme from "../../../theme";
import ViewDataDrawer from "../../../components/ViewDataDrawer";
import { useMemo, useState } from "react";
import ViewAuditContent from "./ViewAuditContent";
import { DateRange, getCalendarAudits } from "../../../api/calendarApi";
import { useQuery } from "@tanstack/react-query";
import {
  prefetchAndCacheDayEvents,
  prefetchAndCacheMonthEvents,
  prefetchAndCacheWeekEvents,
} from "./calendarCache";

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
  const [view, setView] = useState("month");
  const [range, setRange] = useState<DateRange>(() => {
    let start: string, end: string;
    const date = new Date();
    switch (view) {
      case "day":
        start = startOfDay(date).toISOString();
        end = dateFns.endOfDay(date).toISOString();
        break;
      case "week":
        start = startOfWeek(date).toISOString();
        end = dateFns.endOfWeek(date).toISOString();
        break;
      case "month":
        start = startOfWeek(dateFns.startOfMonth(date)).toISOString();
        end = dateFns.endOfWeek(dateFns.endOfMonth(date)).toISOString();
        break;
      default:
        start = date.toISOString();
        end = date.toISOString();
        break;
    }
    return { start, end };
  });

  function onRangeChange(newRange: Date[] | DateRange, newView: View) {
    console.log("onRangeChange", newRange, newView);
    if (newView) {
      setView(newView);
    }
    switch (newView ?? view) {
      case "day":
        setRange({
          start: startOfDay((newRange as Date[])[0]).toISOString(),
          end: dateFns.endOfDay((newRange as Date[])[0]).toISOString(),
        });
        prefetchAndCacheDayEvents((newRange as Date[])[0], 2);
        break;

      case "week":
        setRange({
          start: startOfDay((newRange as Date[])[0]).toISOString(),
          end: dateFns
            .endOfDay((newRange as Date[])[(newRange as Date[]).length - 1])
            .toISOString(),
        });
        prefetchAndCacheWeekEvents((newRange as Date[])[0], 1);
        break;

      case "month": {
        const { start, end } = newRange as any;
        setRange({
          start,
          end,
        });
        const month = dateFns.getMonth(dateFns.add(start, { weeks: 1 }));
        prefetchAndCacheMonthEvents(dateFns.getYear(start), month, 2);
        break;
      }
      case "agenda":
        setRange({
          start: (newRange as any).start,
          end: (newRange as any).end,
        });
        break;
      default:
        // initial load - use current month
        break;
    }
  }

  const { data: calendarAuditsData, isFetching: isFetchingCalendarAudits } =
    useQuery({
      queryKey: ["calendar-audits", range.start, range.end],
      queryFn: () =>
        getCalendarAudits({
          start: range.start,
          end: range.end,
        }),
    });

  console.log("calendarAuditsDat", calendarAuditsData);

  const auditEvents = useMemo(() => {
    if (calendarAuditsData) {
      return calendarAuditsData.map((event) => {
        if (event.type === "internal") {
          return {
            id: event.id,
            title: event.referenceNumber,
            start: startOfDay(new Date(event.auditDate)),
            end: endOfDay(new Date(event.auditDate)),
            audit: event,
          };
        } else if (event.type === "external") {
          return {
            id: event.id,
            title: event.referenceNumber,
            start: startOfDay(new Date(event.auditDate)),
            end: endOfDay(new Date(event.auditDate)),
            audit: event,
          };
        }
      });
    }
    return [];
  }, [calendarAuditsData]);

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
        {isFetchingCalendarAudits && (
          <LinearProgress sx={{ width: "100%", marginBottom: "1rem" }} />
        )}
        <Box sx={{ marginX: 1, marginY: 3 }}>
          <Calendar
            localizer={localizer}
            events={auditEvents}
            startAccessor="start"
            endAccessor="end"
            eventPropGetter={(event) => {
              const backgroundColor =
                event.audit.type === "internal"
                  ? "var(--pallet-orange)"
                  : "var(--pallet-blue)";
              return {
                style: {
                  backgroundColor,
                  color: "white",
                  borderRadius: "6px",
                  display: "block",
                  padding: "4px",
                },
              };
            }}
            style={{ height: 500 }}
            views={["month", "week"]}
            defaultView="month"
            popup
            components={{
              event: (event) => (
                <Box>
                  <span style={{ fontSize: "0.8rem" }}>{event.title}</span>
                  {event.audit?.audit?.name && (
                    <span style={{ fontSize: "0.8rem" }}>
                      {event.audit?.audit?.name}
                    </span>
                  )}
                </Box>
              ),
            }}
            onSelectEvent={(event) => {
              setSelectedEvent(event);
              setOpenViewDrawer(true);
            }}
            onRangeChange={onRangeChange}
            onView={(view) => setView(view)}
          />
        </Box>
      </Box>
      <ViewDataDrawer
        open={openViewDrawer}
        handleClose={() => setOpenViewDrawer(false)}
        drawerContent={
          <Stack
            spacing={1}
            sx={{ paddingX: theme.spacing(1), paddingTop: theme.spacing(4) }}
          >
            {selectedEvent && (
              <Stack>
                <ViewAuditContent selectedAudit={selectedEvent} />
              </Stack>
            )}
          </Stack>
        }
      />
    </Stack>
  );
};
