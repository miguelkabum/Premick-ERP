import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Importação das páginas
import LoginPage from "./pages/Login/LoginPage.jsx";
import RegistrationForm from "./pages/CadastroUsuario/RegistrationForm.jsx";
import ClientesPage from "./pages/Clientes/ClientesPage.jsx";
import CadastroCliente from "./pages/CadastroClientes/CadastroCliente.jsx";
import ProdutosPage from "./pages/Produtos/ProdutosPage.jsx";
import CadastroProduto from "./pages/CadastroProdutos/CadastroProduto.jsx";
import EstoquesPage from "./pages/Estoques/EstoquesPage.jsx";
import CadastroEstoque from "./pages/CadastroEstoques/CadastroEstoque.jsx";
import VendasPDV from "./pages/Vendas/VendasPDV.jsx";
import RelatoriosPage from "./pages/Relatorios/RelatoriosPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";
import ResponsiveAppBar from "./components/Navbar/ResponsiveAppBar.jsx";
import Teste from "./pages/Teste/Teste.jsx";

// Componente para rotas protegidas
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoutesPage = () => {
  return (
    <Router>
      <ResponsiveAppBar /> {/* Navbar exibida em todas as rotas */}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/teste" element={<Teste />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegistrationForm />} />

        {/* Rotas protegidas - exigem autenticação */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <ClientesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes/cadastro"
          element={
            <PrivateRoute>
              <CadastroCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes/cadastro/:id"
          element={
            <PrivateRoute>
              <CadastroCliente />
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <ProdutosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos/cadastro"
          element={
            <PrivateRoute>
              <CadastroProduto />
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos/cadastro/:id"
          element={
            <PrivateRoute>
              <CadastroProduto />
            </PrivateRoute>
          }
        />
        <Route
          path="/estoques"
          element={
            <PrivateRoute>
              <EstoquesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/estoques/cadastro"
          element={
            <PrivateRoute>
              <CadastroEstoque />
            </PrivateRoute>
          }
        />
        <Route
          path="/estoques/cadastro/:id"
          element={
            <PrivateRoute>
              <CadastroEstoque />
            </PrivateRoute>
          }
        />
        <Route
          path="/vendas"
          element={
            <PrivateRoute>
              <VendasPDV />
            </PrivateRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <RelatoriosPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default RoutesPage;
