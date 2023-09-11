import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';


const calculateMargins = (windowWidth) => {
    if (windowWidth <= 480) { // Dispositivos móveis
      return { top: 10, right: 25, bottom: 30, left: 175 };
    } else if (windowWidth <= 768) { // Tablets
      return { top: 15, right: 15, bottom: 20, left: 325 };
    } else { // Desktop
      return { top: 20, right: 35, bottom: 30, left: 450 };
    }
  };

const GraficoImob = ({ ranking, cores }) => {
  const ref = useRef();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!ranking) return;

    const filteredData = [...ranking].reverse();
    const topImobiliaria = filteredData ? d3.max(filteredData, d => Number(d.valor_contrato)) : null;

    const margin = calculateMargins(windowWidth)
    const effectiveWidth = Math.min(windowWidth, 960) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll("*").remove();

    const svg = d3.select(ref.current)
      .attr("width", effectiveWidth + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().range([0, effectiveWidth]);
    const y = d3.scaleBand().range([height, 0]).padding(0.1);

    x.domain([0, d3.max(filteredData, d => Number(d.valor_contrato))]);
    y.domain(filteredData.map(d => d.imobiliaria));

    svg.selectAll(".bar")
      .data(filteredData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("width", d => x(Number(d.valor_contrato)))
      .attr("y", d => y(d.imobiliaria))
      .attr("height", y.bandwidth())
      .attr("fill", d => {
        return Number(d.valor_contrato) === topImobiliaria ? cores["Principal"] : cores["Secundária"];
      });

    const yAxis = d3.axisLeft(y);
    const yAxisGroup = svg.append("g")
      .attr("class", "y-axis-imob")
      .call(yAxis);

    yAxisGroup.selectAll(".tick text")
      .attr("fill", d => {
        const correspondingData = filteredData.find(item => item.imobiliaria === d);

        console.log(yAxisGroup.selectAll(".tick text").nodes());

        if (correspondingData) {
          return Number(correspondingData.valor_contrato) === topImobiliaria ? cores["Principal"] : cores["Secundária"];
        }
        return "black";
      })

  }, [ranking, cores, windowWidth]);

  return (
      <svg ref={ref}></svg>
  );
};

export default GraficoImob;
