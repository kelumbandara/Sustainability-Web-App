import axios from "axios";

export async function fetchAuditStatusCount(
  dateFrom: String,
  dateTo: String,
  division: String,
  auditType: String
) {
  const res = await axios.get(
    `api/audit-status-count/${dateFrom}/${dateTo}/${division}/${auditType}/status-count`
  );
  return res.data;
}

export async function fetchAuditScoreCount(
  dateFrom: String,
  dateTo: String,
  division: String,
  auditType: String
) {
  const res = await axios.get(
    `api/audit-status-count/${dateFrom}/${dateTo}/${division}/${auditType}/score-count`
  );
  return res.data;
}

export async function fetchAuditStatusCountByMonth(
  dateFrom: String,
  dateTo: String,
  division: String,
  auditType: String
) {
  const res = await axios.get(
    `api/audit-status-count/${dateFrom}/${dateTo}/${division}/${auditType}/status-count-by-month`
  );
  return res.data;
}