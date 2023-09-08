import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';

const calculateMargins = (windowWidth) => {
  if (windowWidth <= 480) { // Dispositivos móveis
    return { top: 10, right: 10, bottom: 15, left: 75 };
  } else if (windowWidth <= 768) { // Tablets
    return { top: 15, right: 15, bottom: 20, left: 75 };
  } else { // Desktop
    return { top: 20, right: 20, bottom: 30, left: 75 };
  }
};

const calculateMetaPositions = (windowWidth, width) => {
  const proportion = width / 600; // considerando 960 como a largura máxima
  return {
    meta1: 30000000 * proportion,
    meta2: 60000000 * proportion
  };
};

const GraficoMetas = ({ total }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    d3.select("#graficoMetas").selectAll("*").remove();

    const margin = calculateMargins(windowWidth);
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
      barColor = "#DAA520";
    } else if (total >= 30000000 && total < 60000000) {
      barColor = "#9c9fae";
    } else {
      barColor = "#007c83";
    }

    svg.append("rect")
      .attr("y", (height - 120) / 2)
      .attr("height", 120)
      .attr("x", 0)
      .attr("width", x(total))
      .attr("fill", barColor);

    const metaPositions = calculateMetaPositions(windowWidth, width);

    svg.append("line")
       .attr("x1", x(metaPositions.meta1))
       .attr("x2", x(metaPositions.meta1))
       .attr("y1", 0)
       .attr("y2", height)
       .attr("stroke", "#9c9fae");

    svg.append("line")
       .attr("x1", x(metaPositions.meta2))
       .attr("x2", x(metaPositions.meta2))
       .attr("y1", 0)
       .attr("y2", height)
       .attr("stroke", "#007c83");
    
  }, [total, windowWidth]);

  return <div id="graficoMetas"></div>;
};

export default GraficoMetas;
