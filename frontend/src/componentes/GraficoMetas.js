import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const GraficoMetas = ({ total }) => {
    const svgRef = useRef(null);
    
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 20, bottom: 20, left: 20 };
        const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const x = d3.scaleLinear().domain([0, 75000000]).range([0, width]);

        let barColor;
        if (total < 30000000) {
            barColor = "RED";
        } else if (total >= 30000000 && total < 60000000) {
            barColor = "#9c9fae";
        } else {
            barColor = "#007c83";
        }

        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        g.append("rect")
            .attr("y", (height - 120) / 2)
            .attr("height", 120)
            .attr("x", 0)
            .attr("width", x(total))
            .attr("fill", barColor);

            const drawMetaLine = (value, color, label) => {
              const xOffset = windowWidth < 480 ? 10 : 5; // Ajusta o deslocamento das labels para dispositivos móveis
              const labelOffset = windowWidth < 480 ? 15 : 10; // Ajusta o deslocamento das labels para dispositivos móveis
          
              g.append("line")
                  .attr("x1", x(value) + xOffset)
                  .attr("x2", x(value) + xOffset)
                  .attr("y1", 0)
                  .attr("y2", height)
                  .attr("stroke", color)
                  .attr("stroke-dasharray", "5,5");
          
              g.append("text")
                  .attr("x", x(value) + labelOffset)
                  .attr("y", 20)
                  .attr("fill", color)
                  .text(label);
          };

        drawMetaLine(30000000, "#9c9fae", "30 milhões");
        drawMetaLine(60000000, "#007c83", "60 milhões");

    }, [total, windowWidth]);

    return (
        <div className="chart-metas-container">
            <svg ref={svgRef} width="100%" height="300px"></svg>
        </div>
    );
};

export default GraficoMetas;
