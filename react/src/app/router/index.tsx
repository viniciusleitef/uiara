import { Routes as AppRoutes, Route } from "react-router-dom";
import { Upload } from "../../pages/Upload";

export const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/" element={<Upload />} />
      <Route path="/upload" element={<Upload />} />
    </AppRoutes>
  );
};
