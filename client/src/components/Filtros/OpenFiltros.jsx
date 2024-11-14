import React, { useState } from 'react'
import style from './style.module.css'

const OpenFiltros = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Estado para controlar visibilidade da barra de filtros

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const toggleFilterPanel = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <button
        className={style.filterButton}
        onClick={toggleFilterPanel}
      >
        {isFilterOpen ? "Fechar Filtros" : "Abrir Filtros"}
      </button>
    </>
  )
}

export default OpenFiltros