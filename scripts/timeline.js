function updateTimeline(filteredData) {
    // Count occurrences of each species
    let speciesCounts = {};
    filteredData.forEach(d => {
        speciesCounts[d["Genus_&_Specie"]] = (speciesCounts[d["Genus_&_Specie"]] || 0) + 1;
    });

    let uniqueSpecies = {};
    filteredData.forEach(d => {
        if (!uniqueSpecies[d["Genus_&_Specie"]] || d.Time < uniqueSpecies[d["Genus_&_Specie"]].Time) {
            uniqueSpecies[d["Genus_&_Specie"]] = { ...d, count: speciesCounts[d["Genus_&_Specie"]] };
        }
    });
    filteredData = Object.values(uniqueSpecies);

    // Set up SVG dimensions
    const margin = { top: 400, right: 230, bottom: 500, left: 50 },
          width = 1200 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

    // Clear previous SVG
    d3.select("#timeline-container").html("");

    // Append SVG container
    const svg = d3.select("#timeline-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const minTime = d3.min(filteredData, d => d.Time) || 0;
    const maxTime = d3.max(filteredData, d => d.Time) || 0;
    const maxCount = d3.max(filteredData, d => d.count) || 1;

    const xScale = d3.scaleLinear()
        .domain([maxTime, minTime])
        .range([0, width]);

    const heightScale = d3.scaleLinear()
        .domain([1, maxCount])
        .range([40, 150]);

    // Add centered timeline axis
    const timelineAxis = svg.append("g")
        .attr("class", "timeline-axis")
        .attr("transform", `translate(0,${height/2})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d + "M").ticks(10));

    // Add timeline baseline
    svg.append("line")
        .attr("class", "timeline-base")
        .attr("x1", 0)
        .attr("y1", height/2)
        .attr("x2", width)
        .attr("y2", height/2)
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    // Generate color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create dashed lines with alternating directions
    svg.selectAll(".event-line")
        .data(filteredData)
        .enter().append("line")
        .attr("class", "event-line")
        .attr("x1", d => xScale(d.Time))
        .attr("y1", height/2)
        .attr("x2", d => xScale(d.Time))
        .attr("y2", (d, i) => {
            const direction = i % 2 === 0 ? -1 : 1;
            return height/2 + (direction * heightScale(d.count));
        })
        .attr("stroke", d => colorScale(d["Genus_&_Specie"]))
        .attr("stroke-dasharray", "4,2")
        .attr("stroke-width", 1.5);

    // Add circles at end of dashed lines
    svg.selectAll(".end-circle")
        .data(filteredData)
        .enter().append("circle")
        .attr("class", "end-circle")
        .attr("cx", d => xScale(d.Time))
        .attr("cy", (d, i) => {
            const direction = i % 2 === 0 ? -1 : 1;
            return height/2 + (direction * heightScale(d.count));
        })
        .attr("r", 6)
        .attr("fill", d => colorScale(d["Genus_&_Specie"]))
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5);

    // Add vertical labels at end of lines
    svg.selectAll(".event-label")
        .data(filteredData)
        .enter().append("text")
        .attr("class", "event-label")
        .attr("x", d => xScale(d.Time))
        .attr("y", (d, i) => {
            const direction = i % 2 === 0 ? -1 : 1;
            return height/2 + (direction * (heightScale(d.count) + 20));
        })
        .attr("text-anchor", "middle")
        .attr("transform", (d, i) => {
            const direction = i % 2 === 0 ? -90 : 90;
            return `rotate(${direction},${xScale(d.Time)},${height/2 + (direction/90 * (heightScale(d.count) + 20))})`;
        })
        .style("font-size", "11px")
        .style("font-weight", "600")
        .style("fill", "#000")
        .text(d => `${d["Genus_&_Specie"]} (${d.count})`);
}