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
        <Route
          path="/document"
          element={withLayout(MainLayout, DocumentRegister)}
        />

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
      </Route>
    </Routes>
  );
};

export default AppRoutes;
