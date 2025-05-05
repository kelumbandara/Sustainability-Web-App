import React, { Suspense, useMemo } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router";
import MainLayout from "./components/Layout/MainLayout";
import PageLoader from "./components/PageLoader";
import useCurrentUser from "./hooks/useCurrentUser";
import { PermissionKeys } from "./views/Administration/SectionList";
import PermissionDenied from "./components/PermissionDenied";
import { useQuery } from "@tanstack/react-query";
import { User, validateUser } from "./api/userApi";

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

//audit and inspection
const InternalAuditTable = React.lazy(
  () => import("./views/AuditAndInspection/InternalAudit/InternalAuditTable")
);

const AuditBuilderTable = React.lazy(
  () => import("./views/AuditAndInspection/AuditBuilder/AuditBuilderTable")
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

//Medicine Stock
const MedicineStockTable = React.lazy(
  () => import("./views/OccupationalHealth/ClinicalSuite/MedicineStockTable")
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

const PurchaseAndInventoryTransactionTable = React.lazy(
  () => import("./views/OccupationalHealth/MedicineInventory/TransactionTable")
);

//Maternity Register
const MaternityRegisterTable = React.lazy(
  () =>
    import("./views/OccupationalHealth/MedicalReports/MaternityRegisterTable")
);

//External Audit And Inspection
const ExternalAuditTable = React.lazy(
  () => import("./views/AuditAndInspection/ExternalAudit/AuditTable")
);

//Sustainability
const SustainabilityTable = React.lazy(
  () => import("./views/Sustainability/SustainabilityTable")
);

const AuditAndInspectionDashboard = React.lazy(
  () => import("./views/AuditAndInspection/Dashboard")
);
function withLayout(Layout: any, Component: any, restrictAccess = false) {
  return (
    <Layout>
      <Suspense
        fallback={
          <>
            <PageLoader />
          </>
        }
      >
        {restrictAccess ? <PermissionDenied /> : <Component />}
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

  if (status === "loading" || status === "idle" || status === "pending") {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  const { data: user, status } = useQuery<User>({
    queryKey: ["current-user"],
    queryFn: validateUser,
  });

  const userPermissionObject = useMemo(() => {
    if (user && user?.permissionObject) {
      return user?.permissionObject;
    }
  }, [user]);
  console.log("user", user);
  return (
    <Routes>
      <Route path="/" element={withoutLayout(LoginPage)} />
      <Route path="/register" element={withoutLayout(RegistrationPage)} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/home"
          element={withLayout(
            MainLayout,
            InsightsPage,
            !userPermissionObject?.[PermissionKeys.INSIGHT_VIEW]
          )}
        />

        {/* Administration */}
        <Route
          path="/admin/users"
          element={withLayout(
            MainLayout,
            UserTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_USERS_VIEW]
          )}
        />
        <Route
          path="/admin/access-management"
          element={withLayout(
            MainLayout,
            AccessManagementTable,
            !userPermissionObject?.[PermissionKeys.ADMIN_ACCESS_MNG_VIEW]
          )}
        />

        <Route
          path="/audit-inspection/dashboard"
          element={withLayout(
            MainLayout,
            AuditAndInspectionDashboard,
            !userPermissionObject?.[
              PermissionKeys.AUDIT_INSPECTION_DASHBOARD_VIEW
            ]
          )}
        />

        <Route
          path="/audit-inspection/calendar"
          element={withLayout(
            MainLayout,
            () => (
              <UnderDevelopment pageName="Audit & Inspection > Calendar" />
            )
            // !userPermissionObject?.[
            //   PermissionKeys.AUDIT_INSPECTION_CALENDAR_VIEW
            // ]
          )}
        />
        <Route
          path="/audit-inspection/internal-audit/form-builder"
          element={withLayout(
            MainLayout,
            AuditBuilderTable,
            !userPermissionObject?.[
              PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_FORM_BUILDER_VIEW
            ]
          )}
        />
        <Route
          path="/audit-inspection/internal-audit/scheduled-audits"
          element={withLayout(
            MainLayout,
            InternalAuditTable,
            !userPermissionObject?.[
              PermissionKeys.AUDIT_INSPECTION_INTERNAL_AUDIT_REGISTER_VIEW
            ]
          )}
        />
        <Route
          path="/audit-inspection/external-audit"
          element={withLayout(
            MainLayout,
            () => (
              <UnderDevelopment pageName="Audit & Inspection > External Audit" />
            )
            // !userPermissionObject?.[
            //   PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_VIEW
            // ]
          )}
        />
        {/* document */}
        <Route
          path="/document"
          element={withLayout(
            MainLayout,
            DocumentRegister,
            !userPermissionObject?.[PermissionKeys.DOCUMENT_REGISTER_VIEW]
          )}
        />
        {/* hazard and risk */}
        <Route
          path="/hazard-risk/dashboard"
          element={withLayout(
            MainLayout,
            HazardRiskDashboard,
            !userPermissionObject?.[PermissionKeys.HAZARD_RISK_DASHBOARD_VIEW]
          )}
        />
        <Route
          path="/hazard-risk/history"
          element={withLayout(
            MainLayout,
            () => (
              <HazardRiskTable isAssignedTasks={false} />
            ),
            !userPermissionObject?.[PermissionKeys.HAZARD_RISK_REGISTER_VIEW]
          )}
        />
        <Route
          path="/hazard-risk/assigned-tasks"
          element={withLayout(
            MainLayout,
            () => (
              <HazardRiskTable isAssignedTasks={true} />
            ),
            !userPermissionObject?.[
              PermissionKeys.HAZARD_RISK_ASSIGNED_TASKS_VIEW
            ]
          )}
        />
        {/* Accident & Incident */}
        <Route
          path="/accident-incident/dashboard"
          element={withLayout(
            MainLayout,
            AccidentAndIncidentDashboard,
            !userPermissionObject?.[
              PermissionKeys.INCIDENT_ACCIDENT_DASHBOARD_VIEW
            ]
          )}
        />
        <Route
          path="/accident-incident/register/accident-register"
          element={withLayout(
            MainLayout,
            () => {
              return <AccidentTable isAssignedTasks={false} />;
            },
            !userPermissionObject?.[
              PermissionKeys.INCIDENT_ACCIDENT_REGISTER_ACCIDENT_VIEW
            ]
          )}
        />
        <Route
          path="/accident-incident/register/incident-register"
          element={withLayout(
            MainLayout,
            () => {
              return <IncidentTable isAssignedTasks={false} />;
            },
            !userPermissionObject?.[
              PermissionKeys.INCIDENT_ACCIDENT_REGISTER_INCIDENT_VIEW
            ]
          )}
        />
        <Route
          path="/accident-incident/register/corrective-action"
          element={withLayout(
            MainLayout,
            () => (
              <UnderDevelopment pageName="Accident & Incident > Corrective Action" />
            )
            // !userPermissionObject?.[
            //   PermissionKeys.INCIDENT_ACCIDENT_CORRECTIVE_ACTION_VIEW
            // ]
          )}
        />
        {/* Assigned Tasks */}
        <Route
          path="/accident-incident/assigned-tasks/accident-assigned"
          element={withLayout(
            MainLayout,
            () => {
              return <AccidentTable isAssignedTasks={true} />;
            },
            !userPermissionObject?.[
              PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_ACCIDENT_VIEW
            ]
          )}
        />
        <Route
          path="/accident-incident/assigned-tasks/incident-assigned"
          element={withLayout(
            MainLayout,
            () => {
              return <IncidentTable isAssignedTasks={true} />;
            },
            !userPermissionObject?.[
              PermissionKeys.INCIDENT_ACCIDENT_ASSIGNED_TASKS_INCIDENT_VIEW
            ]
          )}
        />
        <Route
          path="/accident-incident/assigned-tasks/corrective-action"
          element={withLayout(
            MainLayout,
            () => (
              <UnderDevelopment pageName="Assigned Tasks > Corrective Action" />
            )
            // !userPermissionObject?.[
            //   PermissionKeys
            //     .INCIDENT_ACCIDENT_ASSIGNED_TASKS_CORRECTIVE_ACTION_VIEW
            // ]
          )}
        />

        {/* Occupational health */}
        {/* Dashboard */}
        <Route
          path="/occupational-health/dashboard"
          element={withLayout(
            MainLayout,
            OccupationalHealthDashboard,
            !userPermissionObject?.[
              PermissionKeys.OCCUPATIONAL_HEALTH_DASHBOARD_VIEW
            ]
          )}
        />
        {/* Clinical Suite */}
        <Route
          path="/occupational-health/clinical-suite/patient-register"
          element={withLayout(
            MainLayout,
            PatientTable,
            !userPermissionObject?.[
              PermissionKeys
                .OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PATIENT_REGISTER_VIEW
            ]
          )}
        />
        <Route
          path="/occupational-health/clinical-suite/consultation"
          element={withLayout(
            MainLayout,
            () => (
              <UnderDevelopment pageName="Clinical Suite > Consultation" />
            )
            // !userPermissionObject?.[
            //   PermissionKeys
            //     .OCCUPATIONAL_HEALTH_CLINICAL_SUITE_CONSULTATION_VIEW
            // ]
          )}
        />
        <Route
          path="/occupational-health/clinical-suite/medicine-stock"
          element={withLayout(
            MainLayout,
            MedicineStockTable,
            !userPermissionObject?.[
              PermissionKeys
                .OCCUPATIONAL_HEALTH_CLINICAL_SUITE_MEDICINE_STOCK_VIEW
            ]
          )}
        />
        <Route
          path="/occupational-health/clinical-suite/pharmacy-queue"
          element={withLayout(
            MainLayout,
            () => (
              <UnderDevelopment pageName="Clinical Suite > Pharmacy Queue" />
            )
            // !userPermissionObject?.[
            //   PermissionKeys
            //     .OCCUPATIONAL_HEALTH_CLINICAL_SUITE_PHARMACY_QUEUE_VIEW
            // ]
          )}
        />
        {/* Medicine Inventory */}
        <Route
          path="/occupational-health/medicines-inventory/medicine-request"
          element={withLayout(
            MainLayout,
            () => (
              <MedicineRequestTable isAssignedTasks={false} />
            ),
            !userPermissionObject?.[
              PermissionKeys
                .OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_MEDICINE_REQUEST_VIEW
            ]
          )}
        />
        <Route
          path="/occupational-health/medicines-inventory/purchase-inventory"
          element={withLayout(
            MainLayout,
            PurchaseAndInventoryTable,
            !userPermissionObject?.[
              PermissionKeys
                .OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_PURCHASE_INVENTORY_VIEW
            ]
          )}
        />
        <Route
          path="/occupational-health/medicines-inventory/transaction"
          element={withLayout(
            MainLayout,
            PurchaseAndInventoryTransactionTable,
            !userPermissionObject?.[
              PermissionKeys
                .OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_TRANSACTION_VIEW
            ]
          )}
        />
        <Route
          path="/occupational-health/medicines-inventory/assigned-tasks"
          element={withLayout(
            MainLayout,
            () => (
              <MedicineRequestTable isAssignedTasks={true} />
            ),
            !userPermissionObject?.[
              PermissionKeys
                .OCCUPATIONAL_HEALTH_MEDICINE_INVENTORY_ASSIGNED_TASKS_VIEW
            ]
          )}
        />
        {/* Medical Records */}
        <Route
          path="/occupational-health/medical-records/maternity-register"
          element={withLayout(
            MainLayout,
            MaternityRegisterTable,
            !userPermissionObject?.[
              PermissionKeys
                .OCCUPATIONAL_HEALTH_MEDICAL_RECORDS_MATERNITY_REGISTER_VIEW
            ]
          )}
        />

        {/* External Audits */}
        <Route
          path="/audit-inspection/external-audit/register"
          element={withLayout(
            MainLayout,
            ExternalAuditTable,
            !userPermissionObject?.[
              PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_REGISTER_VIEW
            ]
          )}
        />
        <Route
          path="/sustainability/register"
          element={withLayout(
            MainLayout,
            SustainabilityTable,
            !userPermissionObject?.[
              PermissionKeys.SUSTAINABILITY_SDG_REPORTING_CREATE
            ]
          )}
        />
      </Route>
      <Route
        path="/audit-inspection/external-audit/assigned-tasks"
        element={withLayout(
          MainLayout,
          () => (
            <ExternalAuditTable
              isAssignedTasks={true}
              isCorrectiveAction={false}
              isAuditQueue={false}
            />
          ),
          false
          // !userPermissionObject?.[
          //   PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_TASK_VIEW
          // ]
        )}
      />
      <Route
        path="/audit-inspection/external-audit/audit-queue"
        element={withLayout(
          MainLayout,
          () => (
            <ExternalAuditTable
              isAssignedTasks={false}
              isCorrectiveAction={false}
              isAuditQueue={true}
            />
          ),
          !userPermissionObject?.[
            PermissionKeys.AUDIT_INSPECTION_EXTERNAL_AUDIT_QUEUE_VIEW
          ]
        )}
      />
      <Route
        path="/audit-inspection/external-audit/corrective-action"
        element={withLayout(
          MainLayout,
          () => (
            <ExternalAuditTable
              isAssignedTasks={false}
              isCorrectiveAction={true}
              isAuditQueue={false}
            />
          ),
          !userPermissionObject?.[
            PermissionKeys
              .AUDIT_INSPECTION_EXTERNAL_AUDIT_CORRECTIVE_ACTION_VIEW
          ]
        )}
      />
    </Routes>
  );
};

export default AppRoutes;
