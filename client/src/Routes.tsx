import React, { Suspense } from "react";
import { Route, Routes } from "react-router";

const LoginPage = React.lazy(() => import("./views/LoginPage/LoginPage"));

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
    </Routes>
  );
};

export default AppRoutes;
