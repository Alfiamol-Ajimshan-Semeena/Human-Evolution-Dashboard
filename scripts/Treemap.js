function createTreemap(data, containerId, width = 800, height = 400) {
    d3.select(containerId).select("svg").remove();
  
    const marginRight = 100; 
    const updatedWidth = width + marginRight;
  
    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", updatedWidth)
        .attr("height", height)
        .attr("fill","none");
        
  
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Check if a tooltip already exists
    let tooltip = d3.select(".tooltip");
    if (tooltip.empty()) {
        // Create the tooltip if it doesn't exist
        tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    }
  
    const habitatData = d3.groups(data, d => d["Habitat"], d => d["Genus_&_Specie"]);
    const hierarchicalData = {
        name: "All Species",
        children: habitatData.map(([habitat, species]) => ({
            name: habitat,
            children: species.map(([speciesName, values]) => ({
                name: speciesName,
                value: values.length 
            }))
        }))
    };

    //Store data globally
    window.treemapData = hierarchicalData;
  
    // Create a hierarchy and sum the values
    const root = d3.hierarchy(hierarchicalData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
  
    // Create the treemap layout
    const treemap = d3.treemap()
        .size([width, height])
        .padding(1);
  
    treemap(root);
  
    // Create cells for each leaf node
    const cells = svg.selectAll("g")
        .data(root.leaves())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
    // Add rectangles for each cell
    cells.append("rect")
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => colorScale(d.parent.data.name)) 
        .attr("stroke", "white")
        .on("mouseover", function(event, d) {
            console.log("Event Object:", event); 
            console.log("Tooltip Position - X:", event.pageX, "Y:", event.pageY); 
            console.log("Tooltip Content:", `<strong>${d.data.name}</strong><br>Count: ${d.value}`); 
  
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`<strong>${d.data.name}</strong><br>Count: ${d.value}`)
                .style("left", (event.pageX + 10) + "px") 
                .style("top", (event.pageY - 30) + "px"); 
            // Highlight the rectangle
            d3.select(this)
                .attr("stroke", "black")
                .attr("stroke-width", 2);
        })
        .on("mouseout", function() {
            
            tooltip.transition().duration(500).style("opacity", 0);
  
            // Reset rectangle style
            d3.select(this)
                .attr("stroke", "white")
                .attr("stroke-width", 1);
        })
        .on("click", function(event, d) {
            event.stopPropagation();
            const species = d.data.name;
            d3.select("#species").property("value", species);
            window.updateCharts(species);
        });
  
    // Add text labels for each cell
    cells.append("text")
        .attr("x", 5)
        .attr("y", 15)
        .text(d => `${d.data.name} (${d.value})`)
        .attr("font-size", 12)
        .attr("fill", "white")
        .style("text-anchor", "start");
  
    // Create the legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width + 100}, 20)`); 
  
    const habitats = [...new Set(hierarchicalData.children.map(d => d.name))]; 
  
    // Add a rectangle and label for each habitat
    legend.selectAll("rect")
        .data(habitats)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 20)
        .attr("height", 15)
        .attr("fill", d => colorScale(d));
  
    legend.selectAll("text")
        .data(habitats)
        .enter()
        .append("text")
        .attr("x", 30)
        .attr("y", (d, i) => i * 20 + 12)
        .text(d => d)
        .attr("font-size", 12)
        .attr("fill", "black");
    
    window.resetTreemapHighlights = function() {
        svg.selectAll("rect")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("opacity", 1);
    };
  }