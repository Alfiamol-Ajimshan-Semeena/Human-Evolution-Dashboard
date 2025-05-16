// Bubble Chart for Diet vs. Jaw Shape & Canine Size
function createBubbleChart(data) {
    const margin = { top: 50, right: 50, bottom: 100, left: 100 },
          width = 800 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Remove duplicate entries (ensures unique bubbles)
    const uniqueData = Array.from(new Set(data.map(d => `${d.Diet}-${d.Jaw_Shape}-${d["Genus_&_Specie"]}-${d["Current_Country"]}`)))
        .map(key => data.find(d => `${d.Diet}-${d.Jaw_Shape}-${d["Genus_&_Specie"]}-${d["Current_Country"]}` === key));

    // Select the SVG container
    d3.select("#bubble-chart-container svg").remove(); 
    const svg = d3.select("#bubble-chart-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scalePoint()
        .domain([...new Set(uniqueData.map(d => d.Diet))])
        .range([0, width])
        .padding(0.5);

    const yScale = d3.scalePoint()
        .domain([...new Set(uniqueData.map(d => d.Jaw_Shape))])
        .range([height, 0])
        .padding(0.5);

    const sizeScale = d3.scaleOrdinal()
        .domain(["very small", "small", "medium", "medium large", "big", "megadont"])
        .range([5, 10, 15, 20, 25, 30]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain([...new Set(uniqueData.map(d => d["Genus_&_Specie"]))]);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // X-axis Label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .attr("class", "axis-label")
        .text("Diet");

    // Y-axis Label
    svg.append("text")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("class", "axis-label")
        .text("Jaw Shape");

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip")
        .attr("class", "tooltip")
        .style("visibility", "hidden");

    // Force simulation to reduce bubble overlap
    const simulation = d3.forceSimulation(uniqueData)
        .force("x", d3.forceX(d => xScale(d.Diet)).strength(1))
        .force("y", d3.forceY(d => yScale(d.Jaw_Shape)).strength(1))
        .force("collide", d3.forceCollide(d => sizeScale(d.Incisor_Size) + 2))
        .stop();

    for (let i = 0; i < 100; i++) simulation.tick();

    // Bubbles
    svg.selectAll(".bubble")
        .data(uniqueData)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => sizeScale(d.Incisor_Size))
        .attr("fill", d => colorScale(d["Genus_&_Specie"]))
        .attr("opacity", 0.7)
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition().duration(200)
                .attr("stroke", "black")
                .attr("stroke-width", 3);

            tooltip.style("visibility", "visible")
                .html(`Species: ${d["Genus_&_Specie"]}<br>Region: ${d["Current_Country"]}<br>Diet: ${d.Diet}<br>Jaw Shape: ${d.Jaw_Shape}<br>Incisor Size: ${d.Incisor_Size}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition().duration(200)
                .attr("stroke", "white")
                .attr("stroke-width", 1);

            tooltip.style("visibility", "hidden");
        });
}

// Update chart based on filters
function updateBubbleChart() {
    d3.csv("Evolution_DataSets.csv").then(data => {
        const selectedSpecies = d3.select("#species").property("value");
        const selectedRegion = d3.select("#region").property("value");

        let filteredData = data.filter(d => d.Diet && d.Jaw_Shape && d.Incisor_Size);

        if (selectedSpecies !== "All") {
            filteredData = filteredData.filter(d => d["Genus_&_Specie"] === selectedSpecies);
        }
        if (selectedRegion !== "All") {
            filteredData = filteredData.filter(d => d["Current_Country"] === selectedRegion);
        }

        createBubbleChart(filteredData);
    }).catch(error => console.error("Data Load Error:", error));
}

// Attach event listeners for filters
d3.select("#species").on("change", updateBubbleChart);
d3.select("#region").on("change", updateBubbleChart);

// Initial load
updateBubbleChart();
