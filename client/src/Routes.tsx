import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import MainLayout from "./components/Layout/MainLayout";

const LoginPage = React.lazy(() => import("./views/LoginPage/LoginPage"));
const InsightsPage = React.lazy(() => import("./views/Insights/Insight"));

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
      <Route path="/insights" element={withLayout(MainLayout, InsightsPage)} />
    </Routes>
  );
};

export default AppRoutes;
