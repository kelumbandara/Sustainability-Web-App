import React, { useRef } from "react";
import { Send as SendIcon } from "@mui/icons-material";
import {
    Autocomplete,
    TextField,
    Stack,
    Box,
    useMediaQuery,
    useTheme,
    Popper as MuiPopper,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CustomButton from "../../components/CustomButton";
import { styled } from "@mui/system";
import { Controller, useForm } from "react-hook-form";

import RichTextComponent from "../../components/RichTextComponent";
import {
    sampleCategory,
    sampleAccidentTypes,
} from "../../api/sampleData/documentData";

const Popper = styled(MuiPopper)(({ theme }) => ({
    zIndex: 1300,
}));

export default function AccidentDetails({ defaultValues, errors }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const dropdownRef = useRef(null);
    
    const {
        control,
      } = useForm({
        defaultValues: defaultValues || {
          dueDate: null,
          dueTime: null,
        },
      });
    return (
        
        <Stack sx={{ gap: 2, padding: isMobile ? 2 : 4 }}>
            {/* Person Details Section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: isMobile ? 1 : 2,
                }}
            >
                <Typography variant={isMobile ? "h6" : "h5"}>
                    Person Details
                </Typography>
                <CustomButton
                    sx={{
                        border: "0.5px solid blue",
                        marginTop: "0.5rem",
                        padding: isMobile ? "0.25rem 0.5rem" : "0.5rem 1rem",
                    }}
                >
                    <AddIcon /> Add People
                </CustomButton>
            </Box>

            {/* Accident Details Section */}
            <Stack direction="column" sx={{ gap: isMobile ? 2 : 3 }}>
                <Typography variant={isMobile ? "h6" : "h5"}>
                    Accident Details
                </Typography>

                {/* Dropdowns Section */}
                <Stack
                    direction={isMobile ? "column" : "row"}
                    sx={{ gap: isMobile ? 1.5 : 2 }}
                >
                    <Autocomplete
                        sx={{ flex: 1 }}
                        options={sampleCategory?.map((division) => division.name)}
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
                                label="Category"
                            />
                        )}
                    />

                    <Autocomplete
                        sx={{ flex: 1 }}
                        options={sampleCategory?.map((division) => division.name)}
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
                                label="Sub Category"
                            />
                        )}
                    />

                    <Autocomplete
                        sx={{ flex: 2 }}
                        options={sampleAccidentTypes?.map((division) => division.name)}
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
                                label="Accident Type"
                            />
                        )}
                    />
                </Stack>

                {/* Text Fields Section */}
                <TextField
                    required
                    id="prmaryBody"
                    label="Body Primary Region"
                    size="small"
                    fullWidth
                />

                <TextField
                    required
                    id="secondaryBody"
                    label="Body Secondary Region"
                    size="small"
                    fullWidth
                />

                <TextField
                    required
                    id="tertiaryBody"
                    label="Body Tertiary Region"
                    size="small"
                    fullWidth
                />

                <Stack
                    direction={isMobile ? "column" : "row"}
                    sx={{ gap: isMobile ? 2 : 3 }}
                >
                    <Autocomplete
                        sx={{ flex: 1 }}
                        options={sampleAccidentTypes?.map((division) => division.name)}
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
                                label="Type"
                            />
                        )}
                    />

                    <TextField
                        sx={{ flex: 2 }}
                        required
                        id="tertiaryBody"
                        label="Body Tertiary Region"
                        size="small"
                        fullWidth
                    />
                </Stack>

                <Stack
                    direction={isMobile ? "column" : "row"}
                    sx={{ gap: isMobile ? 2 : 3 }}
                >
                    <TextField
                        sx={{ flex: 1 }}
                        required
                        id="tertiaryBody"
                        label="Body Tertiary Region"
                        size="small"
                        fullWidth
                    />

                    <TextField
                        sx={{ flex: 1 }}
                        required
                        id="tertiaryBody"
                        label="Body Tertiary Region"
                        size="small"
                        fullWidth
                    />
                    {!isMobile && <Box sx={{ flex: 1 }} />}
                </Stack>

                <Controller
                    control={control}
                    name={"description"}
                    render={({ field }) => {
                    return (
                        <RichTextComponent
                        onChange={(e) => field.onChange(e)}
                        placeholder={field.value ?? "Type of Work Performed"}
                        />
                    );
                    }}
                />

                <CustomButton
                    sx={{
                        border:"0.5px solid blue",
                    }}
                >
                    Genarate Description
                </CustomButton>

                <Controller
                    control={control}
                    name={"description"}
                    render={({ field }) => {
                    return (
                        <RichTextComponent
                        onChange={(e) => field.onChange(e)}
                        placeholder={field.value ?? "Action Taken"}
                        />
                    );
                    }}
                />
            </Stack>
        </Stack>
    );
}
