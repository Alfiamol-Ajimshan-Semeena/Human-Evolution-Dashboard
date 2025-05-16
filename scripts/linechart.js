function createLineChart(filteredData) {
    // Clear existing chart
    d3.select("#line-chart-container").selectAll("*").remove();

    // Set dimensions and margins
    const margin = { top: 50, right: 100, bottom: 70, left: 100 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("#line-chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define ordered size categories
    const sizeCategories = ["very small", "small", "medium large", "big", "megadont"];

    // Data processing with error handling
    const processData = (data, sizeKey, categoryName) => {
        try {
            return d3.rollups(
                data.filter(d => 
                    d[sizeKey] && 
                    sizeCategories.includes(d[sizeKey].toLowerCase()) && 
                    !isNaN(d.Time)
                ),
                v => ({
                    avgTime: d3.mean(v, d => +d.Time),
                    count: v.length
                }),
                d => d[sizeKey].toLowerCase()
            ).map(([size, values]) => ({
                category: categoryName,
                size: size,
                Time: values.avgTime,
                count: values.count
            }));
        } catch (error) {
            console.error("Data processing error:", error);
            return [];
        }
    };

    const incisorData = processData(filteredData, 'Incisor_Size', 'Incisor');
    const canineData = processData(filteredData, 'Canine Size', 'Canine');
    const combinedData = [...incisorData, ...canineData];

    // Scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(combinedData, d => d.Time) * 0.9, d3.max(combinedData, d => d.Time) * 1.1])
        .range([0, width])
        .nice();

    const yScale = d3.scalePoint()
        .domain(sizeCategories)
        .range([height, 0])
        .padding(0.5);

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(["Incisor", "Canine"])
        .range(["#8B4513", "#006400"]); // Brown and dark green

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.Time))
        .y(d => yScale(d.size))
        .curve(d3.curveMonotoneX);

    // Draw lines with back-to-front animation
    ["Incisor", "Canine"].forEach(cat => {
        const categoryData = combinedData
            .filter(d => d.category === cat)
            .sort((a, b) => b.Time - a.Time); // Oldest to newest

        if (categoryData.length > 1) {
            const path = svg.append("path")
                .datum(categoryData)
                .attr("fill", "none")
                .attr("stroke", color(cat))
                .attr("stroke-width", 2)
                .attr("d", line);

            // Animate from first point (oldest) to last point (newest)
            const totalLength = path.node().getTotalLength();
            path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(1500)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        }
    });

    // Animated dots (appear in chronological order)
    const dots = svg.selectAll(".tooth-dot")
        .data(combinedData.sort((a, b) => a.Time - b.Time)) // Sort by time
        .enter()
        .append("circle")
        .attr("class", "tooth-dot")
        .attr("cx", d => xScale(d.Time))
        .attr("cy", d => yScale(d.size))
        .attr("r", 0)
        .attr("fill", d => color(d.category))
        .attr("stroke", "#333")
        .attr("stroke-width", 1);

    // Dot animation with chronological delay
    dots.transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attr("r", 6)
        .on("start", function() {
            d3.select(this).attr("opacity", 1);
        });

    // Interactive elements
    dots.on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 8)
                .attr("fill", "#ff7f00");
            
            svg.append("text")
                .attr("class", "temp-label")
                .attr("x", xScale(d.Time))
                .attr("y", yScale(d.size) - 15)
                .attr("text-anchor", "middle")
                .text(`${d.category}: ${d.size}`);

            showTooltip(event, d);
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 6)
                .attr("fill", d => color(d.category));
            
            svg.selectAll(".temp-label").remove();
            hideTooltip();
        });

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(d => `${d.toFixed(1)}M`);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Axis labels
    svg.append("text")
        .attr("transform", `translate(${width/2},${height + 50})`)
        .style("text-anchor", "middle")
        .text("Time (Millions of years ago)");

    svg.append("text")
        .attr("transform", "rotate(-90")
        .attr("y", -margin.left + 40)
        .attr("x", -height/2)
        .style("text-anchor", "middle")
        .text("Tooth Size Category");

    // Legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120},20)`);

    ["Incisor", "Canine"].forEach((cat, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 25)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color(cat));

        legend.append("text")
            .attr("x", 25)
            .attr("y", i * 25 + 14)
            .text(cat)
            .style("font-size", "14px")
            .style("font-family", "Arial");
    });

    // Tooltip functions
    function showTooltip(event, d) {
        d3.select("#tooltip")
            .style("opacity", 1)
            .html(`
                <strong>${d.category}</strong><br>
                Size: ${d.size}<br>
                Average Time: ${d.Time.toFixed(1)}M years<br>
                Data Points: ${d.count}
            `)
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 30}px`);
    }

    function hideTooltip() {
        d3.select("#tooltip").style("opacity", 0);
    }
}