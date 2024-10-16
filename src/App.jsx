import Login from "./pages/Login/index.jsx";
import Cadastro from "./pages/Cadastro/index.jsx";
import Home from "./pages/Home/index.jsx";
import Navbar from "./components/Navbar/index.jsx";
// import Filtros from "./Componets/Filtros/index.jsx"
import Clientes from "./pages/Clientes/index.jsx";
import ClientesPage from "./pages/Clientes/ClientesPage.jsx";
import FilterDrawer from "./components/Filtros/FilterDrawer.jsx"
import ResponsiveAppBar from "./components/Navbar/ResponsiveAppBar.jsx";
import RegistrationForm from "./pages/Cadastro/RegistrationForm.jsx";
import LoginPage from "./pages/Login/LoginPage.jsx";
import CadastroCliente from "./pages/CadastroClientes/CadastroCliente.jsx";
import CadastroProduto from "./pages/CadastroProdutos/CadastroProduto.jsx";
import ProdutosPage from "./pages/Produtos/ProdutosPage.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      {/* <Clientes /> */}
      {/* <ResponsiveAppBar /> */}
      {/* <FilterDrawer /> */}
      {/* <ClientesPage /> */}
      {/* <RegistrationForm /> */}
      {/* <LoginPage /> */}
      {/* <CadastroCliente /> */}
      {/* <CadastroProduto /> */}
      {/* <ProdutosPage /> */}
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
      </Routes>
    </Router>
  );
}
