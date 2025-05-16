// Function to create the stacked bar chart
function createStackedBarChart(filteredData) {
    // Clear previous chart
    d3.select("#stackedbar-container").html("");

    // Group data by Tecno_type
    const groupedData = d3.group(filteredData, d => d.Tecno_type);
    const groupedArray = Array.from(groupedData, ([tecnoType, values]) => ({ tecnoType, values }));

    // Define SVG dimensions
    const margin = { top: 40, right: 30, bottom: 100, left: 200 },
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#stackedbar-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extract unique Tecno_types for X-axis
    const tecnoTypes = groupedArray.map(d => d.tecnoType);

    // Set up scales
    const x = d3.scaleBand().domain(tecnoTypes).range([0, width]).padding(0.2);
    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.Time)])
        .nice()
        .range([height, 0]);

    // Color scale for species
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
        


    // Add Y-axis
    svg.append("g").call(d3.axisLeft(y));
       


    // Initialize tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "#fff")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none");

    // Stack bars properly
    groupedArray.forEach(group => {
        let yOffset = 0; 

        group.values.forEach(d => {
            const rect = svg.append("rect")
                .attr("x", x(group.tecnoType))
                .attr("width", x.bandwidth())
                .attr("y", y(d.Time + yOffset)) 
                .attr("height", y(yOffset) - y(d.Time + yOffset))
                .attr("fill", color(d["Genus_&_Specie"])) 
                .attr("stroke", "none")
                .attr("stroke-width", 2)
                .on("mouseover", function(event) {
                    tooltip.style("visibility", "visible")
                        .html(`<strong>${d["Genus_&_Specie"] || "Unknown"}</strong><br>Time: ${d.Time}M`)
                        .style("top", `${event.pageY - 20}px`)
                        .style("left", `${event.pageX + 10}px`);
                    
                    d3.select(this).attr("stroke", "#000"); 
                })
                .on("mousemove", function(event) {
                    tooltip.style("top", `${event.pageY - 20}px`)
                        .style("left", `${event.pageX + 10}px`);
                })
                .on("mouseout", function() {
                    tooltip.style("visibility", "hidden");
                    d3.select(this).attr("stroke", "none"); 
                });

            yOffset += d.Time; 
        });
    });
}
