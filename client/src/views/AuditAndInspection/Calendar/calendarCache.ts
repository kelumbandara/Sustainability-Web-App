import {
  startOfWeek,
  endOfMonth,
  endOfWeek,
  startOfDay,
  endOfDay,
  sub,
  add,
} from "date-fns";
import queryClient from "../../../state/queryClient";
import { getCalendarAudits } from "../../../api/calendarApi";

/** Note: Does not prefetch current month */
export function prefetchAndCacheMonthEvents(
  year: number,
  month: number,
  numberOfMonthsToPrefetch: number
) {
  for (let i = 1; i < numberOfMonthsToPrefetch; i++) {
    const prevMonth = new Date(year, month - i, 1);
    const prevMonthStart = startOfWeek(prevMonth);
    const prevMonthEnd = endOfWeek(endOfMonth(prevMonth));
    queryClient.prefetchQuery({
      queryKey: ["calendar-audits", prevMonthStart, prevMonthEnd],
      queryFn: () =>
        getCalendarAudits({
          start: prevMonthStart.toISOString(),
          end: prevMonthEnd.toISOString(),
        }),
    });

    const nextMonth = new Date(year, month + i, 1);
    const nextMonthStart = startOfWeek(nextMonth);
    const nextMonthEnd = endOfWeek(endOfMonth(nextMonth));
    queryClient.prefetchQuery({
      queryKey: ["calendar-audits", nextMonthStart, nextMonthEnd],
      queryFn: () =>
        getCalendarAudits({
          start: nextMonthStart.toISOString(),
          end: nextMonthEnd.toISOString(),
        }),
    });
  }
}

/** Note: Does not prefetch current days events */
export function prefetchAndCacheDayEvents(
  date: Date,
  numberOfDaysToPrefetch: number
) {
  for (let i = 1; i <= numberOfDaysToPrefetch; i++) {
    const prevDay = sub(date, { days: i });
    const prevDayStart = startOfDay(prevDay);
    const prevDayEnd = endOfDay(prevDay);
    queryClient.prefetchQuery({
      queryKey: ["calendar-audits", prevDayStart, prevDayEnd],
      queryFn: () =>
        getCalendarAudits({
          start: prevDayStart.toISOString(),
          end: prevDayEnd.toISOString(),
        }),
    });

    const nextDay = add(date, { days: i });
    const nextDayStart = startOfDay(nextDay);
    const nextDayEnd = endOfDay(nextDay);
    queryClient.prefetchQuery({
      queryKey: ["calendar-audits", nextDayStart, nextDayEnd],
      queryFn: () =>
        getCalendarAudits({
          start: nextDayStart.toISOString(),
          end: nextDayEnd.toISOString(),
        }),
    });
  }
}

/** Note: Does not prefetch current week's events */
export function prefetchAndCacheWeekEvents(
  date: Date,
  numberOfDaysToPrefetch: number
) {
  for (let i = 1; i <= numberOfDaysToPrefetch; i++) {
    const prevWeek = sub(date, { weeks: i });
    const prevWeekStart = startOfWeek(prevWeek);
    const prevWeekEnd = endOfDay(endOfWeek(prevWeek));
    queryClient.prefetchQuery({
      queryKey: ["calendar-audits", prevWeekStart, prevWeekEnd],
      queryFn: () =>
        getCalendarAudits({
          start: prevWeekStart.toISOString(),
          end: prevWeekEnd.toISOString(),
        }),
    });

    const nextWeek = add(date, { weeks: i });
    const nextWeekStart = startOfWeek(nextWeek);
    const nextWeekEnd = endOfDay(endOfWeek(nextWeek));
    queryClient.prefetchQuery({
      queryKey: ["calendar-audits", nextWeekStart, nextWeekEnd],
      queryFn: () =>
        getCalendarAudits({
          start: nextWeekStart.toISOString(),
          end: nextWeekEnd.toISOString(),
        }),
    });
  }
}
