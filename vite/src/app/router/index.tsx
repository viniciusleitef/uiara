import { Routes as AppRoutes, Route } from "react-router-dom";
import AuthGuard from "./authGuard";
import { Upload } from "../../pages/Upload";
import { Result } from "../../pages/Result";
import { Home } from "../../pages/Home";
import { AllResults } from "../../pages/AllResults";
import { Login } from "../../pages/Login";
import { EsqueciSenha } from "../../pages/EsqueciSenha";
import { Support } from "../../pages/Support";
import { Cadastro } from "../../pages/Cadastro/Cadastro";

export const Routes = () => {
  return (
    <AppRoutes>
      <Route path="/login" element={<Login />} />
      <Route path="/esqueci-senha" element={<EsqueciSenha />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/result/:numProcess" element={<Result />} />
        <Route path="/results" element={<AllResults />} />
        <Route path="/support" element={<Support />} />
        <Route path="*" element={<Home />} />
      </Route>
    </AppRoutes>
  );
};
