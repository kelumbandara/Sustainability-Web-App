import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import MainLayout from "./components/Layout/MainLayout";

const LoginPage = React.lazy(() => import("./views/LoginPage/LoginPage"));
const InsightsPage = React.lazy(() => import("./views/Insights/Insight"));
const UnderDevelopment = React.lazy(
  () => import("./components/UnderDevelopment")
);
const DocumentRegister = React.lazy(
  () => import("./views/DocumentsPage/DocumentsTable")
);

function withLayout(Layout: any, Component: any) {
  return (
    <Layout>
      <Suspense
        fallback={
          <>
            <h1>[Loading...]</h1>
          </>
        }
      >
        <Component />
      </Suspense>
    </Layout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function withoutLayout(Component: any) {
  return (
    <Suspense
      fallback={
        <>
          <h1>[Loading...]</h1>
        </>
      }
    >
      <Component />
    </Suspense>
  );
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={withoutLayout(LoginPage)} />
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
    </Routes>
  );
};

export default AppRoutes;
