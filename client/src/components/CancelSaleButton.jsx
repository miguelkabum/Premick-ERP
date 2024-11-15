const CancelSaleButton = async (idVenda) => {
  try {
    const res = await fetch('http://localhost:5000/vendas/canceladas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idVenda, produtos: produtosVenda, desconto, valorTotal }),
    });
    const data = await res.json();

    if (res.ok) {
      openSnackbar("Venda cancelada com sucesso!", "success");
      setProdutosVenda([]); // Limpa os produtos da venda
    } else {
      openSnackbar("Erro ao cancelar a venda.", "error");
    }
  } catch (error) {
    console.error("Erro ao cancelar a venda:", error);
    openSnackbar("Erro ao cancelar a venda.", "error");
  }
};
export default CancelSaleButton;