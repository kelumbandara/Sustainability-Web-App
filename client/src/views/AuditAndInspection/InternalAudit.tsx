import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from "@mui/material";

// Define the User type
interface User {
  id: number;
  name: string;
  email: string;
  isCompanyEmployee: boolean;
  employeeNumber: string | null;
  mobile: string;
  userType: string;
  department: string | null;
  jobPosition: string | null;
  responsibleSection: string | null;
  assigneeLevel: number;
  assignedFactory: string | string[];
}

// Function to fetch data
const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get("https://suswebapp.perahara.lk/suswebapp-backend/public/api/all-users");
  return response.data.user; // Adjust based on API response structure
};

const UserTable: React.FC = () => {
  const { data: users, isLoading, isError } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error fetching user data.</div>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Mobile</TableCell>
            <TableCell>User Type</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Job Position</TableCell>
            <TableCell>Assignee Level</TableCell>
            <TableCell>Assigned Factory</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.mobile}</TableCell>
              <TableCell>{user.userType}</TableCell>
              <TableCell>{user.department || "N/A"}</TableCell>
              <TableCell>{user.jobPosition || "N/A"}</TableCell>
              <TableCell>{user.assigneeLevel}</TableCell>
              <TableCell>{Array.isArray(user.assignedFactory) ? user.assignedFactory.join(", ") : user.assignedFactory || "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UserTable;
