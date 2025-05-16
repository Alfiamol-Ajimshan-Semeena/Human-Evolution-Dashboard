// Function to create Pie Chart for Species Distribution by Location
function createPieChart(data, container) {
    const width = 400;
    const height = 400;
   

    // Clear previous chart
    d3.select(container).html("");

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    // Calculate total count for percentage calculation
    const totalCount = d3.sum(data, d => d.count);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.location))
        .range(d3.schemeCategory10);

    const pie = d3.pie()
        .value(d => d.count);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(180);

    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Draw pie slices
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.location))
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    // Add labels with percentages
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => {
            const percentage = ((d.data.count / totalCount) * 100).toFixed(2); 
            return `${d.data.location} (${percentage}%)`; 
        })
        .style("font-size", "12px")
        .style("fill", "white");
}

// Function to calculate species distribution by location
function calculateSpeciesDistributionByLocation(data) {
    const locationMap = d3.rollup(
        data,
        v => v.length,
        d => d["Location"] 
    );
    return Array.from(locationMap, ([location, count]) => ({ location, count }));
}