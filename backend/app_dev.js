const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

const {
  process_data,
  calcular_total_vendas,
  normalizar_nome,
  diminuir_nome,
  filter_by_empreendimento,
  prepare_data
} = require('./utilidades/tratamento');

require('dotenv').config();

let empreendimentoState = "TOTAL";

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.post('/setEmpreendimento', (req, res) => {
  empreendimentoState = req.body.empreendimento;
  res.send({status: 'OK'});
});

app.get('/api/fetchData', async (req, res) => {
  const cacheFile = path.join(__dirname, 'resposta.json');
     // Checar se o cache existe
  if (fs.existsSync(cacheFile)) {
    const rawData = fs.readFileSync(cacheFile);
    const cachedData = JSON.parse(rawData);
    return res.json(cachedData);
  }

  const url = process.env.USER_URL;
  const headers = {
    email: process.env.USER_EMAIL,
    token: process.env.USER_TOKEN
  };
  try {
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
      const processedData = process_data(response.data);
      const preparedData = prepare_data(processedData, empreendimentoState);
      // Salvando no cache (arquivo .json)
      fs.writeFileSync(cacheFile, JSON.stringify({
        data: processedData
      }));

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


  