import React, { useState } from "react";
import {
  Drawer,
  Button,
  Typography,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterDrawer = () => {
  const [filter, setFilter] = useState({
    situacao: "Todos",
    vendedor: "Todos",
    telefone: "Todos",
    estado: "Sp",
    municipio: "Todos",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const toggleFilterDrawer = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div>
      <Button variant="contained" startIcon={<FilterListIcon />} onClick={toggleFilterDrawer}>
        Abrir Filtros
      </Button>
      
      <Drawer anchor="left" open={isFilterOpen} onClose={toggleFilterDrawer}>
        <Box p={3} width={300}>
          <Typography variant="h6" gutterBottom>
            Filtros
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Situação</InputLabel>
            <Select
              name="situacao"
              value={filter.situacao}
              onChange={handleFilterChange}
              label="Situação"
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Ativo">Ativo</MenuItem>
              <MenuItem value="Inativo">Inativo</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Vendedor</InputLabel>
            <Select
              name="vendedor"
              value={filter.vendedor}
              onChange={handleFilterChange}
              label="Vendedor"
            >
              <MenuItem value="Todos">Todos</MenuItem>
              <MenuItem value="Vendedor 1">Vendedor 1</MenuItem>
              <MenuItem value="Vendedor 2">Vendedor 2</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Telefone / Celular"
            name="telefone"
            value={filter.telefone}
            onChange={handleFilterChange}
            placeholder="Todos"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Estado"
            name="estado"
            value={filter.estado}
            onChange={handleFilterChange}
            placeholder="SP"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Município"
            name="municipio"
            value={filter.municipio}
            onChange={handleFilterChange}
            placeholder="Todos"
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => alert('Filtro aplicado!')}
          >
            Filtrar
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default FilterDrawer;
