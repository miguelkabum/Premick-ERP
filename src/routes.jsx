import React from "react";
import Login from "./pages/Login/index.jsx";
import Cadastro from "./pages/Cadastro/index.jsx";
import Home from "./pages/Home/index.jsx";
import CadastroCliente from "./pages/CadastroClientes/CadastroCliente.jsx";
import CadastroProduto from "./pages/CadastroProdutos/CadastroProduto.jsx";
import ProdutosPage from "./pages/Produtos/ProdutosPage.jsx";
import ClientesPage from "./pages/Clientes/ClientesPage.jsx";
import Navbar from "./components/Navbar/index.jsx";
// import Filtros from "./Componets/Filtros/index.jsx"
import Clientes from "./pages/Clientes/index.jsx";
import FilterDrawer from "./components/Filtros/FilterDrawer.jsx";
import ResponsiveAppBar from "./components/Navbar/ResponsiveAppBar.jsx";
import RegistrationForm from "./pages/Cadastro/RegistrationForm.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import CadastroEstoque from "./pages/CadastroEstoques/CadastroEstoque.jsx";
import EstoquesPage from "./pages/Estoques/EstoquesPage.jsx";
import VendasPDV from "./pages/Vendas/VendasPDV.jsx";
import RelatoriosPage from "./pages/Relatorios/RelatoriosPage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const routesPage = () => {
  return (
    <Router>
      {/* <Clientes /> */}
      <ResponsiveAppBar />
      {/* <FilterDrawer /> */}
      {/* {<ClientesPage />} */}
      {/* <RegistrationForm /> */}
      {/* <LoginPage /> */}
      {/* <CadastroCliente /> */}
      {/* <CadastroProduto /> */}
      {/* <ProdutosPage /> */}
      {/* <Navbar /> */}
      {/* <CadastroEstoque /> */}
      {/* <EstoquesPage /> */}
      {/* <VendasPDV /> */}
      {/* <RelatoriosPage /> */}
      {/* <DashboardPage /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/cadastro" element={<CadastroCliente />} />
        <Route path="/clientes/cadastro/:id" element={<CadastroCliente />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/produtos/cadastro" element={<CadastroProduto />} />
        <Route path="/produtos/cadastro/:id" element={<CadastroProduto />} />
        <Route path="/estoques" element={<EstoquesPage />} />
        <Route path="/estoques/:id" element={<EstoquesPage />} />
        <Route path="/estoques/cadastro" element={<CadastroEstoque />} />
        <Route path="/estoques/cadastro/:id" element={<CadastroEstoque />} />
        <Route path="/vendas" element={<VendasPDV />} />
        <Route path="/relatorios" element={<RelatoriosPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </Router>
  );
};

export default routesPage;
