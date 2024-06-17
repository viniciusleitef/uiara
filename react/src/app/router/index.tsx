import { Routes as AppRoutes, Route } from "react-router-dom";
import { Upload } from "../../pages/Upload";
import { Result } from "../../pages/Result";
import { Home } from "../../pages/Home";
import { AllResults } from "../../pages/AllResults";

export const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/result/:numProcess" element={<Result />} />
      <Route path="/results" element={<AllResults />} />
    </AppRoutes>
  );
};
