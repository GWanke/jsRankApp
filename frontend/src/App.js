import React, { useEffect, useState } from 'react';
import GraficoCorretores from './componentes/GraficoCorretores';
import GraficoMetas from './componentes/GraficoMetas';
import './componentes/GraficoCorretores.css'
import './componentes/App.css'
import axios from 'axios';

const cores_empr = {
  "BE GARDEN KAÁ SQUARE": { "Principal": "#2B3956", "Secundária": "#9FCC2E" },
  "BE DEODORO": { "Principal": "#EA580C", "Secundária": "#F6A200" },
  "BE BONIFÁCIO": { "Principal": "#36261C", "Secundária": "#D19A53" },
  "TOTAL": { "Principal": "#007c83", "Secundária": "#9c9fae" },
};

function App() {
  const [preparedData, setPreparedData] = useState(null);
  const [status, setStatus] = useState('Comunicando com a API...');
  const [currentPage, setCurrentPage] = useState(0);
  const [empreendimento, setEmpreendimento] = useState('TOTAL');
  const [currentRanking, setCurrentRanking] = useState(null);
  const [totalValorContrato, setTotalValorContrato] = useState(0);
  const [warningMessage, setWarningMessage] = useState("");



  useEffect(() => {
    axios.get('http://localhost:3001/api/fetchData')
      .then(response => {
        setStatus('Fazendo tratamento de dados...');
        setPreparedData(response.data.data);
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error);
        setStatus('Erro ao buscar dados');
      })
      .finally(() => {
        setStatus('');  
      });
  }, []);

  useEffect(() => {
    if (preparedData) {
      // Verifica se o empreendimento selecionado existe nos dados preparados
      if (preparedData[empreendimento]) {
        const filteredData = preparedData[empreendimento].filter(item => item.corretor !== 'Evandro Rodrigues Da Silva');
        setCurrentRanking(filteredData);
        setWarningMessage(""); // Define a mensagem de aviso
      } else {
        // Se o empreendimento não tiver dados, ajusta o ranking atual para um array vazio
        setCurrentRanking([]);
        setWarningMessage("Não há vendas registradas para este empreendimento."); // Define a mensagem de aviso
      }
  
      // Assume que o campo "TOTAL" sempre existirá
      const unfilteredData = preparedData["TOTAL"];
      const total = unfilteredData.reduce((acc, item) => acc + item.valor_contrato, 0);
      setTotalValorContrato(total);
  
      setCurrentPage(0); // Reset para a primeira página
    }
  }, [preparedData, empreendimento]);
  


  return (
    <div className="App">
      <h1>Gráfico de Vendas por Corretor</h1>
      {!preparedData && <div className="mensagem-status">{status}</div>}
      <div className="select-container">
        <select value={empreendimento} onChange={e => setEmpreendimento(e.target.value)}>
          <option value="TOTAL">Total</option>
          <option value="BE GARDEN KAÁ SQUARE">BE GARDEN</option>
          <option value="BE BONIFÁCIO">BE BONIFÁCIO</option>
          <option value="BE DEODORO">BE DEODORO</option>
        </select>
      </div>
      <div className="chart-container">
        {currentRanking && currentRanking.length > 0 ? (
          <GraficoCorretores 
            preparedData={currentRanking} 
            cores={cores_empr[empreendimento]} 
            coresTotal={cores_empr["TOTAL"]}
            currentPage={currentPage} 
          />
       ) : (
      <div className="mensagem-erro">
        {warningMessage}
      </div>
      )}
      </div>
      <div className="button-container">
        <button disabled={currentPage === 0} onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}>Anterior</button>
        <button 
          disabled={currentRanking ? currentPage >= Math.ceil(currentRanking.length / 10) - 1 : true}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Próximo
        </button>
      </div>
      <div className="chart-metas-container">
      { totalValorContrato > 0 && <GraficoMetas total={totalValorContrato} /> }
      </div>
    </div>
  );
}

export default App;
