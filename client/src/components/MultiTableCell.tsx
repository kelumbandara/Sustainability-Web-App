import React from "react";
import { TableCell } from "@mui/material";

interface MultiTableCellProps {
  row: any; // Adjust the type as per your actual data structure
  columnKey: string;
}

const MultiTableCell: React.FC<MultiTableCellProps> = ({ row, columnKey }) => {
  return (
    <TableCell align="left">
      {(() => {
        const value = row[columnKey]; // Get the value of the specific column
        try {
          // Check if value is a string that looks like JSON
          const parsedValue =
            typeof value === "string" ? JSON.parse(value) : value;
          
          // If it's an array, join the elements with a comma
          return Array.isArray(parsedValue) ? parsedValue.join(", ") : value;
        } catch (error) {
          console.error("Invalid JSON in value:", value);
          return value; // Fallback to original value if JSON parsing fails
        }
      })()}
    </TableCell>
  );
};

export default MultiTableCell;
