import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const GraficoMetas = ({ total }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    d3.select("#graficoMetas").selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = Math.min(windowWidth, 960) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#graficoMetas")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear().domain([0, Math.max(total, 60000000)]).range([0, width]);

    let barColor;
    if (total < 30000000) {
      barColor = "#DAA520"; // Esta é uma sugestão de cor
    } else if (total >= 30000000 && total < 60000000) {
      barColor = "#9c9fae";
    } else {
      barColor = "#007c83";
    }

    svg.append("rect")
      .attr("y", (height - 120) / 2) // 60 é a nova altura da barra
      .attr("height", 120)           // 60 é a nova altura da barra    
       .attr("x", 0)
       .attr("width", x(total))
       .attr("fill", barColor);

    svg.append("line").attr("x1", x(30000000)).attr("x2", x(30000000)).attr("y1", 0).attr("y2", height).attr("stroke", "#9c9fae");
    svg.append("line").attr("x1", x(60000000)).attr("x2", x(60000000)).attr("y1", 0).attr("y2", height).attr("stroke", "#007c83");
    
  }, [total, windowWidth]);

  return <div id="graficoMetas" style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>;

  
};

export default GraficoMetas;
