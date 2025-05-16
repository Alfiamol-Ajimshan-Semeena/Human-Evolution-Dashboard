function createBarChart(data, container) {
    const margin = { top: 20, right: 10, bottom: 40, left: 270 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(container).html("");

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.zone))
        .range([0, width])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.frequency)])
        .nice()
        .range([height, 0]);

    // Add animated axes
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .transition()
        .duration(800)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    svg.append("g")
        .attr("class", "y-axis")
        .transition()
        .duration(800)
        .call(d3.axisLeft(y));

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Zones");

        // Add y-axis label
    svg.append("text")
    .attr("class", "y-axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 180)
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Species Frequency");

    // Create bars with animation
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.zone))
        .attr("width", x.bandwidth())
        .attr("y", height) 
        .attr("height", 0) 
        .attr("fill", "steelblue")
        .transition()
        .delay((d, i) => i * 50) 
        .duration(800)
        .attr("y", d => y(d.frequency))
        .attr("height", d => height - y(d.frequency));

    // Add hover effects
    svg.selectAll(".bar")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange")
                .attr("stroke", "black")
                .attr("stroke-width", 2);

            // Show tooltip
            d3.select("#tooltip")
                .style("visibility", "visible")
                .html(`
                    <strong>${d.zone}</strong><br>
                    Species Count: ${d.frequency}
                `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "steelblue")
                .attr("stroke", "none");

            
            d3.select("#tooltip").style("visibility", "hidden");
        });

    // Add chart title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px");
        
}

// Function to calculate species frequency by zone
function calculateSpeciesFrequencyByZone(filteredData) {
    const frequencyMap = d3.rollup(
        filteredData,
        v => v.length,
        d => d["Zone"]
    );
    return Array.from(frequencyMap, ([zone, frequency]) => ({ 
        zone, 
        frequency 
    })).sort((a, b) => b.frequency - a.frequency); // Sort descending
}