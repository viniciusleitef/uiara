import { Routes as AppRoutes, Route } from "react-router-dom";
import { Upload } from "../../pages/Upload";
import { Result } from "../../pages/Result";
import { Home } from "../../pages/Home";
import { AllResults } from "../../pages/AllResults";
import AuthGuard from "./authGuard";
import { Login } from "../../pages/Login";

export const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/login" element={<Login />} />
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/result/:numProcess" element={<Result />} />
        <Route path="/results" element={<AllResults />} />
        <Route path="*" element={<Home />} />
      </Route>
    </AppRoutes>
  );
};
