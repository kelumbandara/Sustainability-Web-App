import React, { useState } from "react";
import {
    Box,
    Stack,
    Tabs,
    Tab,
    Typography,
    useTheme,
} from "@mui/material";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import PageTitle from "../../components/PageTitle";
import Breadcrumb from "../../components/BreadCrumb";
import useIsMobile from "../../customHooks/useIsMobile";
import AddGeneralDetails from "../AccidentAndIncidents/GenaralDetailsDialog";
import BothDetails from "../AccidentAndIncidents/BothDetails";
import AccidentDetails from "../AccidentAndIncidents/AccidentDetailForm";
import { useForm } from "react-hook-form";

const breadcrumbItems = [
    { title: "Home", href: "/home" },
    { title: "Accident & Incident Management" },
];

const defaultValues = {
    documentType: "Accident Report",
};

const animationStyles = {
    enter: {
        opacity: 0,
        transform: "translateX(-20px)",
    },
    enterActive: {
        opacity: 1,
        transform: "translateX(0)",
        transition: "opacity 300ms, transform 300ms",
    },
    exit: {
        opacity: 1,
        transform: "translateX(0)",
    },
    exitActive: {
        opacity: 0,
        transform: "translateX(20px)",
        transition: "opacity 300ms, transform 300ms",
    },
};

export default function AddAccident() {
    const { isMobile } = useIsMobile();
    const theme = useTheme();
    const [selectedPanel, setSelectedPanel] = useState<number>(0); // Start with 0 (General Details)
    const { control, handleSubmit, formState: { errors }, setValue } = useForm();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedPanel(newValue);
    };

    return (
        <Stack spacing={2}>
            {/* Header Section */}
            <Box
                sx={{
                    p: 2,
                    boxShadow: 2,
                    borderRadius: 1,
                    overflowX: "hidden",
                }}
            >
                <PageTitle title="Accident & Incident Management" />
                <Breadcrumb breadcrumbs={breadcrumbItems} />
            </Box>

            {/* Main Content Section */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: 2,
                    background: "white",
                }}
            >
                {/* Left-side Box */}
                <Box
                    sx={{
                        flex: { xs: "none", lg: 4 },
                        width: { xs: "100%", lg: "70%" },
                        boxShadow: 3,
                    }}
                >
                    {/* Tabs Section */}
                    <Box sx={{ borderBottom: 1, borderColor: theme.palette.divider }}>
                        <Tabs value={selectedPanel} onChange={handleTabChange} aria-label="Accident & Incident Tabs">
                            <Tab label="General Details" />
                            <Tab label="Accident Details" />
                        </Tabs>
                    </Box>

                    {/* Tab Panel Content with Animation */}
                    <TransitionGroup>
                        <CSSTransition
                            key={selectedPanel}
                            timeout={300}
                            classNames=""
                        >
                            {(state) => (
                                <Box
                                    sx={{
                                        p: 3,
                                        ...animationStyles[state === "entering" ? "enter" : "exit"],
                                        ...(state === "entered" && animationStyles.enterActive),
                                        ...(state === "exiting" && animationStyles.exitActive),
                                    }}
                                >
                                    {selectedPanel === 0 && (
                                        <Box>
                                            <Typography variant="h6">General Details</Typography>
                                            <AddGeneralDetails defaultValues={defaultValues} errors={errors} />
                                        </Box>
                                    )}
                                    {selectedPanel === 1 && (
                                        <Box>
                                            <AccidentDetails defaultValues={defaultValues} errors={errors} />
                                        </Box>
                                    )}
                                </Box>
                            )}
                        </CSSTransition>
                    </TransitionGroup>
                </Box>

                {/* Right-side Box */}
                <Stack
                    sx={{
                        flex: { xs: "none", lg: 2 },
                        width: { xs: "100%", lg: "30%" },
                        p: 3,
                        border: 1,
                        borderColor: theme.palette.divider,
                        borderRadius: 1,
                        display: "flex",
                        height: "590px",
                        flexShrink: 0,
                        boxShadow: 3,
                    }}
                >
                    <Box>
                        <BothDetails defaultValues={{ dueDate: null }} />
                    </Box>
                </Stack>
            </Box>
        </Stack>
    );
}
