import React, { Suspense } from "react";
import { Route, Routes } from "react-router";

const LoginPage = React.lazy(() => import("./views/LoginPage/LoginPage"));
const RegistrationPage = React.lazy(() => import("./views/RegistrationPage"));

// function withLayout(Layout: any, Component: any) {
//   return (
//     <Layout>
//       <Suspense
//         fallback={
//           <>
//             <h1>[Loading...]</h1>
//           </>
//         }
//       >
//         <Component />
//       </Suspense>
//     </Layout>
//   );
// }

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
      <Route path="/register" element={withoutLayout(RegistrationPage)} />
    </Routes>
  );
};

export default AppRoutes;
