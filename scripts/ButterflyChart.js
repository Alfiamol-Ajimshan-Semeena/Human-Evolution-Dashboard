function createButterflyChart(data, containerId, width = 800, height = 400) {
    d3.select(containerId).select("svg").remove();
    console.log(data); // Debugging: Log the data to verify its structure

    const margin = { top: 50, right: 50, bottom: 50, left: 300 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const aggregatedData = d3.groups(data, d => d["Genus_&_Specie"])
    .map(([key, values]) => {
    return {
        "Genus_&_Specie": key,
        "Cranial_Capacity": d3.mean(values, d => +d.Cranial_Capacity),
        "Height": d3.mean(values, d => +d.Height)
    };
    });

    // Store data globally
    window.butterflyChartData = aggregatedData;

    // Create SVG container
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Tooltip
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

    // Scales
    const xScale = d3.scaleLinear()
        .domain([-d3.max(aggregatedData, d => d.Cranial_Capacity), d3.max(data, d => d.Height)])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(aggregatedData.map(d => d["Genus_&_Specie"]))
        .range([0, innerHeight])
        .padding(0.1);

    // Add bars for cranial capacity (left side)
    svg.selectAll(".bar-left")
        .data(aggregatedData)
        .enter()
        .append("rect")
        .attr("class", "bar-left")
        .attr("x", d => xScale(-d.Cranial_Capacity))
        .attr("y", d => yScale(d["Genus_&_Specie"]))
        .attr("width", d => xScale(0) - xScale(-d.Cranial_Capacity))
        .attr("height", yScale.bandwidth())
        .attr("fill", "brown")
        .on("mouseover", function(event,d) {
            
            tooltip.style("visibility", "visible")
                .html(`${d["Genus_&_Specie"]} <br> Cranial Capacity: ${d.Cranial_Capacity} cc`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
                d3.select(this).attr("stroke", "#000"); 
        })
        .on("mousemove", function(event,d) {
            tooltip.style("top", `${event.pageY - 20}px`)
                .style("left", `${event.pageX + 10}px`);
        })

        .on("mouseout", function() {
            tooltip.style("visibility", "hidden")
            d3.select(this).attr("stroke", "none");
        })
        .on("click", function(event, d) {
            event.stopPropagation();
            tooltip.style("visibility", "hidden");
            const species = d["Genus_&_Specie"];
            d3.select("#species").property("value", species);
            window.updateCharts(species);
        });

    // Add bars for height (right side)
    svg.selectAll(".bar-right")
        .data(aggregatedData)
        .enter()
        .append("rect")
        .attr("class", "bar-right")
        .attr("x", xScale(0))
        .attr("y", d => yScale(d["Genus_&_Specie"]))
        .attr("width", d => xScale(d.Height) - xScale(0))
        .attr("height", yScale.bandwidth())
        .attr("fill", "darkorange")
        .on("mouseover", function(event,d) {
            
            tooltip.style("visibility", "visible")
                .html(`${d["Genus_&_Specie"]} <br> Height: ${d.Height} cm`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
                d3.select(this).attr("stroke", "#000"); 
        })
        .on("mousemove", function(event,d) {
            tooltip.style("top", `${event.pageY - 20}px`)
                .style("left", `${event.pageX + 10}px`);
        })

        .on("mouseout", function() {
            tooltip.style("visibility", "hidden")
            d3.select(this).attr("stroke", "none");
        })
        .on("click", function(event, d) {
            event.stopPropagation();
            tooltip.style("visibility", "hidden");
            const species = d["Genus_&_Specie"];
            d3.select("#species").property("value", species);
            window.updateCharts(species);
        });

    // Add y-axis (species names)
    svg.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .attr("class", "axis-label");

    // Add x-axis (cranial capacity and height)
    svg.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d => Math.abs(d)));

    // Add chart title
    svg.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Butterfly Chart: Cranial Capacity and Height by Species");
        window.resetButterflyHighlights = function() {
            svg.selectAll(".bar-left, .bar-right").attr("opacity", 1);
        };
    }