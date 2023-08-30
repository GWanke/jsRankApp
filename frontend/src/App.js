import React, { useEffect, useState } from 'react';
import GraficoCorretores from './componentes/GraficoCorretores';
import './componentes/GraficoCorretores.css'
import './componentes/App.css'
import axios from 'axios';

const cores_empr = {
  "BE GARDEN": { "Principal": "#2B3956", "Secundária": "#9FCC2E" },
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
      setCurrentRanking(preparedData[empreendimento]);
      setCurrentPage(0); // Reset para a primeira página
    }
  }, [preparedData, empreendimento]);

  return (
    <div className="App">
      <h1>Gráfico de Vendas por Corretor</h1>
      <div className="select-container">
      <select value={empreendimento} onChange={e => setEmpreendimento(e.target.value)}>
        <option value="TOTAL">Total</option>
        <option value="BE GARDEN">BE GARDEN</option>
        <option value="BE BONIFÁCIO">BE BONIFÁCIO</option>
        <option value="BE DEODORO">BE DEODORO</option>
      </select>
      </div>
      <div>{status}</div>
      <div className="chart-container">
      {currentRanking && <GraficoCorretores preparedData={currentRanking} cores={cores_empr[empreendimento]} currentPage={currentPage} />}
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
    </div>
  );
}

export default App;
