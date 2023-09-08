import React, { useEffect, useState } from 'react';
import GraficoCorretores from './componentes/GraficoCorretores';
import './index.css';
import './App.css';
import axios from 'axios';

const cores = { "Principal": "#007c83", "Secundária": "#9c9fae" };


function App() {
  const [preparedData, setPreparedData] = useState(null);
  const [status, setStatus] = useState('Comunicando com a API...');
  const [currentRanking, setCurrentRanking] = useState(null);
  const [bestSeller, setBestSeller] = useState("");
  const [showRanking, setShowRanking] = useState(false);


  const totalValue = currentRanking ? currentRanking.reduce((acc, item) => acc + item.valor_contrato, 0) : 0;
  const percentage30M = ((totalValue / 30000000) * 100).toFixed(2);
  const percentage60M = ((totalValue / 60000000) * 100).toFixed(2);

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
      console.log(preparedData.slice(0,10))
      const filteredData = preparedData.filter(d => d.corretor !== 'Evandro Rodrigues Da Silva' && d.corretor !== 'Lais Saraiva');
      setCurrentRanking(filteredData);
      setBestSeller(filteredData[0].corretor);
      setShowRanking(true);
    }
  }, [preparedData]);

  return (
    <div className="App">
      <h1 className="app-titulo">Best Seller</h1>
      
      {!preparedData && <div className="mensagem-status">{status}</div>}
      
      {showRanking && (
        <>
          <section className="best-seller-section">
            <div className="best-seller-container">
              O <span className="best-seller-be">BE</span>st Seller atual é <span className="best-seller-name">{bestSeller}</span>!
            </div>  
          </section>
  
          <section className="corretores-section">
            <h2 className="section-title">Ranking de Corretores</h2>
            <div className="chart-container">
              <GraficoCorretores 
                preparedData={currentRanking.slice(0, 10)} 
                cores={cores} 
              />
            </div>
          </section>
  
          <section className="metas-section">
            <h2 className="section-title">Metas Alcançadas</h2>
            <div className="chart-metas-container">
              <p >Estamos em {percentage30M}% em relação à métrica de 30 milhões.</p>
              <p >Estamos em {percentage60M}% em relação à métrica de 60 milhões.</p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
