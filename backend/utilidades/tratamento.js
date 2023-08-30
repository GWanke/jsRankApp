
// Processa os dados JSON e retorna um array de objetos
const process_data = (data) => {
    const rows = [];
    for (const [key, value] of Object.entries(data)) {
      const reserva = key;
      const corretor = value.corretor.corretor;
      if (corretor === 'Evandro Rodrigues da Silva') continue;
  
      const corretor_id = value.corretor.idcorretor_cv;
      const empreendimento = value.unidade.empreendimento;
      const imobiliaria = value.corretor.imobiliaria;
      const valor_contrato = value.condicoes.valor_contrato;
      const data_venda = value.data_venda;
  
      const row = {
        reserva,
        empreendimento,
        corretor,
        id_corretor: corretor_id,
        imobiliaria,
        valor_contrato,
        data_venda,
      };
      rows.push(row);
    }
    return rows;
  };
  
  // Calcula o valor total de vendas no array fornecido
  const calcular_total_vendas = (rows) => {
    return rows.reduce((total, row) => total + row.valor_contrato, 0);
  };
  
  // Normaliza o nome, capitalizando cada palavra
  const normalizar_nome = (nome) => {
    return nome.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };
  
  // Diminui o nome para um comprimento máximo, abreviando os nomes do meio
  const diminuir_nome = (nome, max_length = 30) => {
    if (nome.length <= max_length) return nome;
  
    const parts = nome.split(' ');
    for (let i = 1; i < parts.length - 1; i++) {
      if (nome.length > max_length) {
        parts[i] = parts[i][0] + '.';
        nome = parts.join(' ');
      }
    }
    return nome;
  };

const processar_nome = (nome) => {
    const nomeNormalizado = normalizar_nome(nome);
    const nomeReduzido = diminuir_nome(nomeNormalizado);
    return nomeReduzido;
  };
  
  
  // Filtra o array por empreendimento
  const filter_by_empreendimento = (rows, empreendimento) => {
    if (empreendimento === 'BE GARDEN') return rows.filter(row => row.empreendimento === 'BE GARDEN KAÁ SQUARE');
    if (empreendimento !== 'TOTAL') return rows.filter(row => row.empreendimento === empreendimento);
    return rows;
  };

  function prepare_data(data) {
    const rankingsByEmpreendimento = {};
    const totalRanking = {};
  
    data.forEach(row => {
      const corretor = processar_nome(row.corretor);
      const empreendimento = row.empreendimento;
  
      // Ranking por empreendimento
      if (!rankingsByEmpreendimento[empreendimento]) {
        rankingsByEmpreendimento[empreendimento] = {};
      }
  
      if (!rankingsByEmpreendimento[empreendimento][corretor]) {
        rankingsByEmpreendimento[empreendimento][corretor] = { valor_contrato: 0 };
      }
      rankingsByEmpreendimento[empreendimento][corretor].valor_contrato += parseFloat(row.valor_contrato);
  
      // Ranking total
      if (!totalRanking[corretor]) {
        totalRanking[corretor] = { valor_contrato: 0 };
      }
      totalRanking[corretor].valor_contrato += parseFloat(row.valor_contrato);
    });
  
    // Ordenar rankings
    const sortedRankings = {};
    Object.keys(rankingsByEmpreendimento).forEach(emp => {
      sortedRankings[emp] = sortRankings(rankingsByEmpreendimento[emp]);
    });
    
    // Ranking total
    sortedRankings['TOTAL'] = sortRankings(totalRanking);
  
    return sortedRankings;
  }
  
  function sortRankings(ranking) {
    return Object.keys(ranking)
      .map(corretor => ({
        corretor,
        valor_contrato: ranking[corretor].valor_contrato,
      }))
      .sort((a, b) => b.valor_contrato - a.valor_contrato);
  }
  
  
  

  
  module.exports = {
    process_data,
    calcular_total_vendas,
    normalizar_nome,
    diminuir_nome,
    filter_by_empreendimento,
    prepare_data
  };
  