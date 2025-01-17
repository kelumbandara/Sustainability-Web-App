import React, { useRef, useEffect, useState } from "react";
import { Send as SendIcon } from "@mui/icons-material";
import {
    Autocomplete,
    TextField,
    Stack,
    Box,
    useMediaQuery,
    useTheme,
    Popper as MuiPopper,
} from "@mui/material";
import { sampleDivisions, sampleDepartments } from "../../api/sampleData/documentData";
import CustomButton from "../../components/CustomButton";
import { styled } from "@mui/system";

const Popper = styled(MuiPopper)(({ theme }) => ({
    zIndex: 1300,
}));

export default function AddWitness({ defaultValues, errors }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dropdownRef = useRef(null);

    return (
        <Stack
            ref={dropdownRef}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "1.1rem",
                margin: "2rem",
                marginTop:"2.5rem"
            }}
        >
            <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                <TextField required id="employeeId" label="Employee ID" size="small" fullWidth />
                <TextField required id="Name" label="Name" size="small" fullWidth />
            </Stack>
            <Stack direction={isMobile ? "column" : "row"} spacing={2}>
                <Autocomplete
                    options={sampleDivisions?.map((division) => division.name)}
                    defaultValue={defaultValues?.division}
                    fullWidth
                    size="small"
                    PopperComponent={Popper}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            required
                            error={!!errors?.division}
                            helperText={errors?.division?.message}
                            label="Division"
                        />
                    )}
                />
                <Autocomplete
                    options={sampleDepartments?.map((department) => department.name)}
                    defaultValue={defaultValues?.department}
                    fullWidth
                    size="small"
                    PopperComponent={Popper}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            required
                            error={!!errors?.department}
                            helperText={errors?.department?.message}
                            label="Department"
                        />
                    )}
                />
            </Stack>
            <Box
                sx={{
                    display: "flex",    // Ensure it's using flexbox
                    justifyContent: "flex-end",  // Align content horizontally to the right
                    width: "auto",
                    marginTop:"1rem",
                }}
            >
                <CustomButton>
                    <SendIcon sx={{ marginRight: 1 }} />
                    Submit
                </CustomButton>
            </Box>
        </Stack>
    );
}
