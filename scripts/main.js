// Main function to load data and manage interactions
d3.csv("Evolution_DataSets.csv").then(data => {
    console.log("Data Loaded Successfully:", data);

    // Convert data types for consistency
    convertDataTypes(data);

    // Populate dropdowns for species and region
    const speciesList = ["All", ...new Set(data.map(d => d["Genus_&_Specie"]))];
    const regionList = ["All", ...new Set(data.map(d => d["Current_Country"]))];

    // Populate dropdown options for species
    d3.select("#species")
        .selectAll("option")
        .data(speciesList)
        .enter()
        .append("option")
        .text(d => d);

    // Populate dropdown options for region
    d3.select("#region")
        .selectAll("option")
        .data(regionList)
        .enter()
        .append("option")
        .text(d => d);

    // Function to update charts based on selected filters
    function updateCharts() {
        const selectedSpecies = d3.select("#species").property("value");
        const selectedRegion = d3.select("#region").property("value");
        const selectedTime = +d3.select("#timeRange").property("value");

        // Display selected time value
        d3.select("#timeValue").text(selectedTime + "M");

        // Filter data based on selected options
        const filteredData = filterData(data, selectedSpecies, selectedRegion, selectedTime);

        console.log("Filtered Data:", filteredData);
        
        //  insights-box for timeperiod and  species
        let totalSpecies = 0;
        let timePeriod = "No data available ";
        
        if (filteredData.length > 0) {
            // Calculate unique species count
            totalSpecies = new Set(filteredData.map(d => d["Genus_&_Specie"])).size;
            
            // Calculate time period range 
            const timeExtent = d3.extent(filteredData, d => d.Time);
            const start = timeExtent[0].toFixed(1);
            const end = timeExtent[1].toFixed(1);
            
            timePeriod = start === end ? 
                `${start}M` : 
                `${start}M - ${end}M`;
        }

          // Update insights box
          d3.select("#total-species").text(totalSpecies);
          d3.select("#time-period").text(timePeriod);
          // Update visualizations
          updateTimeline(filteredData);
          createStackedBarChart(filteredData); 
          createLineChart(filteredData);
          drawTimelineTree(timelineData);
      
  
        // Call other visualization update functions if needed
    
        // Reset highlights before applying new ones
        if (window.resetButterflyHighlights) window.resetButterflyHighlights();
        if (window.resetTreemapHighlights) window.resetTreemapHighlights();

        // Update visualizations
        updateTimeline(filteredData);
        createStackedBarChart(filteredData); 
        createButterflyChart(filteredData, "#butterfly-chart");
        createTreemap(filteredData, "#tree-map");
        createBarChart(filteredData,"#bar-chart-container");
        createPieChart(filteredData,"#pie-chart-container");
        createLineChart(filteredData);
        // Call other visualization update functions if needed
        const speciesFrequencyByZone = calculateSpeciesFrequencyByZone(filteredData);
        const speciesDistributionByLocation = calculateSpeciesDistributionByLocation(filteredData);
        createBarChart(speciesFrequencyByZone, "#bar-chart-container");
        createPieChart(speciesDistributionByLocation, "#pie-chart-container");
        updateBubbleChart(filteredData);

        // Highlight the selected species in charts
        if (selectedSpecies !== "All") {
            // Highlight in butterfly chart if it exists
            if (window.butterflyChartData) {
                d3.select("#butterfly-chart").selectAll(".bar-left, .bar-right")
                    .attr("opacity", 0.3)
                    .filter(d => d["Genus_&_Specie"] === selectedSpecies)
                    .attr("opacity", 1);
            }

            // Highlight in treemap if it exists
            if (window.treemapData) {
                d3.select("#tree-map").selectAll("rect")
                    .attr("opacity", 0.3)
                    .filter(d => d.data && d.data.name === selectedSpecies)
                    .attr("opacity", 1);
            }
        }
        generateSummaryInsights(filteredData);
    
    }
    function generateSummaryInsights(filteredData) {
        // Calculate basic stats for the overall insights
        const totalSpecies = new Set(filteredData.map(d => d["Genus_&_Specie"])).size;
        const timeExtent = d3.extent(filteredData, d => d.Time);
        const regions = new Set(filteredData.map(d => d["Current_Country"]));
    
        // Average physical traits
        const avgCranial = d3.mean(filteredData, d => d.Cranial_Capacity);
        const avgHeight = d3.mean(filteredData, d => d.Height);
        
        
        // Overall Insights
        const overallSummary = `
            The dashboard analyzes evolutionary data of <strong>${totalSpecies}</strong> species, 
            spanning from <strong>${timeExtent[1].toFixed(1)}</strong> million years ago. 
            Species are distributed across <strong>${regions.size}</strong> regions, with some regions showing higher 
            diversity than others. <br><br>Major trends in physical traits include an increase in cranial capacity 
            and body height over time, reflecting evolutionary adaptations to environmental changes. The average cranial capacity is  ${avgCranial.toFixed(1)} cc and height is ${avgHeight.toFixed(1)} cm.The visualizations provide an in-depth look at both physical and technological evolution, as well as 
            the geographic spread of species. A signgificant relation between tooth sizes and the dietry habits are visualized too!
            
            
        `;
    
        // Update the overall insights section
        d3.select("#overall-summary").html(overallSummary);
    
        // Chart-specific insights
        const speciesInsight = `
            The chart shows the count of species across different geographical regions. The species with the highest frequency 
            can be found in regions with higher biodiversity.
        `;
    
        const pieChartInsight = `
            The pie chart displays the distribution of species across different locations, highlighting continents with 
            a significant concentration of species.
        `;
    
        const timelineInsight = `
            The timeline chart shows the development of species across different time periods, highlighting the 
            major trends in evolutionary history.
        `;
    
        const stackedBarInsight = `
            The stacked bar chart provides insights into technological development over time, showcasing different types of tools.
        `;
    
        const barChartInsight = `
            The bar chart visualizes species frequency in various zone, allowing comparisons across regions.
        `;
    
        const lineChartInsight = `
            The line chart shows the evolution of incisor and canine size over time, providing insights into tooth size 
            changes in species.
        `;
    
        const mapInsight = `
            The geographical map shows the global distribution of species, allowing for easy identification of high 
            concentration regions.
        `;
    
        const butterflyChartInsight = `
            The butterfly chart compares the body size (height) and cranial capacity of different species, showing 
            evolutionary trends. The cranial capacity and height increases over evolution.
        `;
    
        const treemapInsight = `
            The treemap visualizes species count across different habitats, providing a hierarchical view of how 
            species are distributed in various ecosystems.
        `;
    
        const bubbleChartInsight = `
            The bubble chart visualizes the relationship between diet, jaw shape, and canine size across species.
            the correlation between different tooth size, jawshape and dietry habits.
        `;
        
        // Update the individual insights for each chart
        d3.select("#species-distribution-insight").html(speciesInsight);
        d3.select("#pie-chart-insight").html(pieChartInsight);
        d3.select("#timeline-chart-insight").html(timelineInsight);
        d3.select("#stackedbar-chart-insight").html(stackedBarInsight);
        d3.select("#bar-chart-insight").html(barChartInsight);
        d3.select("#line-chart-insight").html(lineChartInsight);
        d3.select("#map-chart-insight").html(mapInsight);
        d3.select("#butterfly-chart-insight").html(butterflyChartInsight);
        d3.select("#treemap-chart-insight").html(treemapInsight);
        d3.select("#bubble-chart-insight").html(bubbleChartInsight);
    }
    
    
   // Make updateCharts available globally
   window.updateCharts = updateCharts;

   d3.select("#species").on("change", function() {
       updateCharts();
   });

   d3.select("#region").on("change", function() {
       updateCharts();
   });

   d3.select("#timeRange").on("input", function() {
       updateCharts();
   });

    // Initial chart rendering when data is loaded
    updateCharts();

}).catch(error => console.error("Data Load Error:", error));


// Centralized function for data conversion (e.g., to numeric values)
function convertDataTypes(data) {
    data.forEach(d => {
        d.Time = +d.Time;  // Convert time to numeric
        d.Cranial_Capacity = +d.Cranial_Capacity || 0;  // Convert cranial capacity to numeric, default to 0
        d.Height = +d.Height || 0;  // Convert height to numeric, default to 0
        
    });
}

// Centralized filtering function
function filterData(data, speciesFilter, regionFilter, timeFilter) {
    let filteredData = data;

    // Filter by species if not "All"
    if (speciesFilter !== "All") {
        filteredData = filteredData.filter(d => d["Genus_&_Specie"] === speciesFilter);
    }

    // Filter by region if not "All"
    if (regionFilter !== "All") {
        filteredData = filteredData.filter(d => d["Current_Country"] === regionFilter);
    }

    // Filter by time if a time range is selected
    if (timeFilter) {
        filteredData = filteredData.filter(d => d.Time <= timeFilter);
    }

    return filteredData;
}


