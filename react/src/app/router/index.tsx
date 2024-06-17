import { Routes as AppRoutes, Route } from "react-router-dom";
import { Upload } from "../../pages/Upload";
import { Result } from "../../pages/Result";

export const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/" element={<Upload />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/result/:numProcess" element={<Result />} />
    </AppRoutes>
  );
};
