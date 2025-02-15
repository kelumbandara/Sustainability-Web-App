import React, { Suspense } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import MainLayout from "./components/Layout/MainLayout";
import PageLoader from "./components/PageLoader";
import useCurrentUser from "./hooks/useCurrentUser";

const LoginPage = React.lazy(() => import("./views/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(
  () => import("./views/RegistrationPage/RegistrationPage")
);
const InsightsPage = React.lazy(() => import("./views/Insights/Insight"));

//Administration
const UserTable = React.lazy(() => import("./views/Administration/UserTable"));
const AccessManagementTable = React.lazy(
  () => import("./views/Administration/AccessManagementTable")
);

const UnderDevelopment = React.lazy(
  () => import("./components/UnderDevelopment")
);
const DocumentRegister = React.lazy(
  () => import("./views/DocumentsPage/DocumentsTable")
);

//hazard and risk
const HazardRiskDashboard = React.lazy(
  () => import("./views/HazardAndRisk/Dashboard")
);
const HazardRiskTable = React.lazy(
  () => import("./views/HazardAndRisk/HazardRiskTable")
);

//accident and incident
const AccidentTable = React.lazy(
  () => import("./views/AccidentAndIncident/AccidentTable")
);

const IncidentTable = React.lazy(
  () => import("./views/AccidentAndIncident/IncidentTable")
);

const AccidentAndIncidentDashboard = React.lazy(
  () => import("./views/AccidentAndIncident/AccidentAndIncidentDashBoard")
);

//Occupational Health

//Dashboard
const OccupationalHealthDashboard = React.lazy(
  () => import("./views/OccupationalHealth/OccupationalHealthDashboard")
);

//Patient Register
const PatientTable = React.lazy(
  () => import("./views/OccupationalHealth/ClinicalSuite/PatientTable")
);

//Medicine Request
const MedicineRequestTable = React.lazy(
  () =>
    import(
      "./views/OccupationalHealth/MedicineInventory/MedicineRequest/MedicineRequestTable"
    )
);

//Medicine Inventory
const PurchaseAndInventoryTable = React.lazy(
  () =>
    import(
      "./views/OccupationalHealth/MedicineInventory/PurchaseAndInventory/PurchaseAndInventoryTable"
    )
);

//Maternity Register
const MaternityRegisterTable = React.lazy(
  () =>
    import("./views/OccupationalHealth/MedicalReports/MaternityRegisterTable")
);

function withLayout(Layout: any, Component: any) {
  return (
    <Layout>
      <Suspense
        fallback={
          <>
            <PageLoader />
          </>
        }
      >
        <Component />
      </Suspense>
    </Layout>
  );
}

function withoutLayout(Component: React.LazyExoticComponent<any>) {
  return (
    <Suspense
      fallback={
        <>
          <PageLoader />
        </>
      }
    >
      <Component />
    </Suspense>
  );
}

const ProtectedRoute = () => {
  const { user, status } = useCurrentUser();
  console.log(user, status);

  if (status === "loading" || status === "idle" || status === "pending") {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={withoutLayout(LoginPage)} />
      <Route path="/register" element={withoutLayout(RegistrationPage)} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={withLayout(MainLayout, InsightsPage)} />

        {/* Administration */}
        <Route
          path="/admin/users"
          element={withLayout(MainLayout, UserTable)}
        />
        <Route
          path="/admin/access-management"
          element={withLayout(MainLayout, AccessManagementTable)}
        />

        {/* Audit & Inspection */}
        <Route
          path="/audit-inspection/dashboard"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Audit & Inspection > Dashboard" />
          ))}
        />
        <Route
          path="/audit-inspection/calendar"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Audit & Inspection > Calendar" />
          ))}
        />
        <Route
          path="/audit-inspection/internal-audit"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Audit & Inspection > Internal Audit" />
          ))}
        />
        <Route
          path="/audit-inspection/external-audit"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Audit & Inspection > External Audit" />
          ))}
        />
        {/* document */}
        <Route
          path="/document"
          element={withLayout(MainLayout, DocumentRegister)}
        />
        {/* hazard and risk */}
        <Route
          path="/hazard-risk/dashboard"
          element={withLayout(MainLayout, HazardRiskDashboard)}
        />
        <Route
          path="/hazard-risk/history"
          element={withLayout(MainLayout, () => (
            <HazardRiskTable />
          ))}
        />
        <Route
          path="/hazard-risk/assigned-tasks"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Document > Assigned Task" />
          ))}
        />
        {/* Accident & Incident */}
        <Route
          path="/accident-incident/dashboard"
          element={withLayout(MainLayout, AccidentAndIncidentDashboard)}
        />
        <Route
          path="/accident-incident/register/accident-register"
          element={withLayout(MainLayout, AccidentTable)}
        />
        <Route
          path="/accident-incident/register/incident-register"
          element={withLayout(MainLayout, IncidentTable)}
        />
        <Route
          path="/accident-incident/register/corrective-action"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Accident & Incident > Corrective Action" />
          ))}
        />
        {/* Assigned Tasks */}
        <Route
          path="/accident-incident/assigned-tasks/accident-assigned"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Assigned Tasks > Accident Assigned" />
          ))}
        />
        <Route
          path="/accident-incident/assigned-tasks/incident-assigned"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Assigned Tasks > Incident Assigned" />
          ))}
        />
        <Route
          path="/accident-incident/assigned-tasks/corrective-action"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Assigned Tasks > Corrective Action" />
          ))}
        />

        {/* Occupational health */}
        {/* Dashboard */}
        <Route
          path="/occupational-health/dashboard"
          element={withLayout(MainLayout, OccupationalHealthDashboard)}
        />
        {/* Clinical Suite */}
        <Route
          path="/occupational-health/clinical-suite/patient-register"
          element={withLayout(MainLayout, PatientTable)}
        />
        <Route
          path="/occupational-health/clinical-suite/consultation"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Clinical Suite > Consultation" />
          ))}
        />
        <Route
          path="/occupational-health/clinical-suite/medicine-stock"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Clinical Suite > Medicine Stock" />
          ))}
        />
        <Route
          path="/occupational-health/clinical-suite/pharmacy-queue"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Clinical Suite > Pharmacy Queue" />
          ))}
        />
        {/* Medicine Inventory */}
        <Route
          path="/occupational-health/medicines-inventory/medicine-request"
          element={withLayout(MainLayout, MedicineRequestTable)}
        />
        <Route
          path="/occupational-health/medicines-inventory/purchase-inventory"
          element={withLayout(MainLayout, PurchaseAndInventoryTable)}
        />
        <Route
          path="/occupational-health/medicines-inventory/transaction"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Medicine Inventory > Transaction" />
          ))}
        />
        <Route
          path="/occupational-health/medicines-inventory/assigned-tasks"
          element={withLayout(MainLayout, () => (
            <UnderDevelopment pageName="Medicine Inventory > Assigned Tasks" />
          ))}
        />
        {/* Medical Records */}
        <Route
          path="/occupational-health/medical-records/maternity-register"
          element={withLayout(MainLayout, MaternityRegisterTable)}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
