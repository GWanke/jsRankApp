import React, { useEffect, useState } from 'react';
import GraficoCorretores from './componentes/GraficoCorretores';
import GraficoMetas from './componentes/GraficoMetas';
import './index.css';
import './componentes/GraficoCorretores.css';
import './componentes/App.css';
import axios from 'axios';

const cores = { "Principal": "#007c83", "Secundária": "#9c9fae" };


function App() {
  const [preparedData, setPreparedData] = useState(null);
  const [status, setStatus] = useState('Comunicando com a API...');
  const [currentRanking, setCurrentRanking] = useState(null);
  const [bestSeller, setBestSeller] = useState("");

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
      const filteredData = preparedData.filter(d => d.corretor !== 'Evandro Rodrigues Da Silva' && d.corretor !== 'Lais Saraiva');
      setCurrentRanking(filteredData);
      setBestSeller(filteredData[0].corretor);
    }
  }, [preparedData]);

  return (
    <div className="App">
      <h1 className="app-titulo">Best Seller</h1>
      {!preparedData && <div className="mensagem-status">{status}</div>}
    
      <div className="best-seller-container">
        <h2>
          <span className="best-seller-be" style={{ color: cores["Secundária"] }}>BE</span>
          <span>st Seller atual é </span>
          <span className="best-seller-name" style={{ color: cores["Principal"] }}>
            {bestSeller}
          </span>
        </h2>
      </div>
      
      <div className="chart-container">
        {currentRanking && currentRanking.length > 0 ? (
          <GraficoCorretores 
            preparedData={currentRanking.slice(0, 10)} 
            cores={cores} 
          />
        ) : (
          <div className="mensagem-erro">
            Não há vendas registradas.
          </div>
        )}
      </div>
      
      <div className="chart-metas-container">
        {currentRanking && <GraficoMetas total={currentRanking.reduce((acc, item) => acc + item.valor_contrato, 0)} />}
      </div>
    </div>
  );
}

export default App;
