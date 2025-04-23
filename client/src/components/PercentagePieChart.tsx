import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Typography, Box, Stack } from "@mui/material";

interface PercentagePieChartProps {
  data: { name: string; value: number }[];
  title?: string;
  width?: number;
  height?: number;
}

export default function PercentagePieChart({
  data,
  title = "Recycled Water Breakdown",
  width = 300,
  height = 300,
}: PercentagePieChartProps) {
  const total = data.find((d) => d.name === "Total")?.value || 0;
  const recycled = data.find((d) => d.name === "Recycled")?.value || 0;
  const reused = data.find((d) => d.name === "Reused")?.value || 0;
  const others = data.find((d) => d.name === "Others")?.value || 0;

  const chartData = [
    {
      name: "Recycled",
      value: total > 0 ? (recycled / total) * 100 : 0,
    },
    {
      name: "Reused (from Recycled)",
      value: recycled > 0 ? (reused / recycled) * 100 : 0,
    },
    {
      name: "Others",
      value: total > 0 ? (others / total) * 100 : 0,
    },
  ];

  const COLORS = ["#10b981", "#4f46e5", "#f59e0b"];

  const originalLegend = [
    { label: "Total", value: total, color: "#ccc" },
    { label: "Recycled", value: recycled, color: "#10b981" },
    { label: "Reused", value: reused, color: "#4f46e5" },
    { label: "Others", value: others, color: "#f59e0b" },
  ];

  // Custom label function to show percentage
  const renderLabel = ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <Box>
      {title && (
        <Typography variant="h6" mb={2} display="flex" justifyContent="center">
          {title}
        </Typography>
      )}

      <Box display="flex" justifyContent="center">
        <ResponsiveContainer width={width} height={height}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius="80%"
              label={renderLabel}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={3}>
        <Stack gap={2} flexDirection={"row"}>
          {originalLegend.map((item, i) => (
            <Box key={i} display="flex" alignItems="center" gap={1}>
              <Box
                width={14}
                height={14}
                borderRadius="50%"
                bgcolor={item.color}
              />
              <Typography fontSize={14}>
                {item.label}: {item.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
