  import React, { useEffect, useRef, useState } from 'react';
  import * as d3 from 'd3';
  import './GraficoCorretores.css';

  const maxWidth = 800;

  const GraficoCorretores = ({ preparedData, cores, currentPage }) => {
    const ref = useRef();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Listener para o redimensionamento da janela
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    // O efeito principal para a criação do gráfico
    useEffect(() => {
      if (!preparedData) return;

      const itemsPerPage = 10;
      const topCorretor = preparedData ? d3.max(preparedData, d => Number(d.valor_contrato)) : null;

      const margin = { top: 20, right: 20, bottom: 30, left: 175 };
      const effectiveWidth = Math.min(windowWidth, maxWidth) - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      d3.select(ref.current).selectAll("*").remove();

      const svg = d3.select(ref.current)
        .attr("width", effectiveWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${effectiveWidth + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleLinear().range([0, effectiveWidth]);
      const y = d3.scaleBand().range([height, 0]).padding(0.1);

      let currentPageData = [];
      if (preparedData) {
        currentPageData = preparedData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).reverse();
      }

      x.domain([0, d3.max(currentPageData, d => Number(d.valor_contrato))]);
      y.domain(currentPageData.map(d => d.corretor));

      svg.selectAll(".bar")
        .data(currentPageData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("width", d => x(Number(d.valor_contrato)))
        .attr("y", d => y(d.corretor))
        .attr("height", y.bandwidth())
        .attr("fill", d => {
          return Number(d.valor_contrato) === topCorretor ? cores["Principal"] : cores["Secundária"];
        });

  // Eixo Y com cores customizadas
  const yAxis = d3.axisLeft(y);

  const yAxisGroup = svg.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  yAxisGroup.selectAll(".tick text")
    .attr("fill", d => {
      const correspondingData = currentPageData.find(item => item.corretor === d);
      if (correspondingData) {
        return Number(correspondingData.valor_contrato) === topCorretor ? cores["Principal"] : cores["Secundária"];
      }
      return "black"; // Cor padrão se não encontrar o dado correspondente
    });
  }, [preparedData, cores, currentPage, windowWidth]);


    return (
      <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg ref={ref}></svg>
      </div>
    );
  };

  export default GraficoCorretores;