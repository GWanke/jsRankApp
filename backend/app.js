const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Importando as funções do tratamento.js
const { 
  process_data,  
  prepare_data,
  prepare_data_by_imobiliaria
} = require('./utilidades/tratamento');

require('dotenv').config();

//CORS
const corsOptions = {
  origin: 'https://ranking.serbravo.com.br',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));



app.get('/api/fetchData', async (req, res) => {
  const url = process.env.USER_URL; // Substitua por seu URL
  const headers = {
    email: process.env.USER_EMAIL,  // Substitua por seu email
    token: process.env.USER_TOKEN  // Substitua por seu token
  };

  try {
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
        // Processando os dados recebidos com Axios
        const processedData = process_data(response.data);
        // Filtragem por data_venda
        const dataLimite = new Date("2023-01-01");
        const data_filtrada = processedData.filter(row => row.data_venda > dataLimite);
        const preparedDataCorretores = prepare_data(data_filtrada)
        const preparedDataImobiliarias = prepare_data_by_imobiliaria(data_filtrada);
                res.json({ 
          data: preparedDataCorretores,
          data_imobiliarias: preparedDataImobiliarias
        });
    } else {
      res.status(response.status).json({ message: 'Algo deu errado' });
    }
  } catch (error) {
    if (error.response && error.response.status) {
      res.status(error.response.status).json({ message: `Erro: ${error.response.status}` });
    } else {
      res.status(500).json({ message: 'Erro desconhecido' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
