const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

// Importando as funções do tratamento.js
const { 
  process_data,  
  prepare_data 
} = require('./utilidades/tratamento');

require('dotenv').config();

let empreendimentoState = "TOTAL"; // Você pode armazenar isso em uma sessão ou em um banco de dados.

//CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


app.post('/setEmpreendimento', (req, res) => {
  empreendimentoState = req.body.empreendimento; // Atualiza o estado
  res.send({status: 'OK'});
});

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
        const preparedData = prepare_data(processedData)
                res.json({ 
          data: preparedData 
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
