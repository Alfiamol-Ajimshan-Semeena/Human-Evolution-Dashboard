let mapInstance;
let worldGeoData;

// Joining both datasets
Promise.all([
    d3.csv("Evolution_DataSets.csv"),
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
]).then(([csvData, worldData]) => {
    console.log("All data loaded successfully");

    // Convert numerical values
    csvData.forEach(d => {
        d.Time = +d.Time;
        d.Cranial_Capacity = +d.Cranial_Capacity || 0;
        d.Height = +d.Height || 0;
        d.Prognathism = +d.Prognathism;
        d.Foramen = +d.Foramen;
    });

    // Process GeoJSON
    worldGeoData = topojson.feature(worldData, worldData.objects.countries);

    // Initialize map
    mapInstance = new ChoroplethMap("mapChart");
    mapInstance.draw(worldGeoData, csvData);

    // Populate dropdowns
    const speciesList = ["All", ...new Set(csvData.map(d => d["Genus_&_Specie"]))];
    d3.select("#species").selectAll("option").data(speciesList).enter().append("option").text(d => d);

    const regionList = ["All", ...new Set(csvData.map(d => d["Current_Country"]))];
    d3.select("#region").selectAll("option").data(regionList).enter().append("option").text(d => d);

    // Function to update charts based on filters
    function updateCharts() {
        let filteredData = csvData;

        const selectedSpecies = d3.select("#species").property("value");
        if (selectedSpecies !== "All") {
            filteredData = filteredData.filter(d => d["Genus_&_Specie"] === selectedSpecies);
        }

        const selectedRegion = d3.select("#region").property("value");
        if (selectedRegion !== "All") {
            filteredData = filteredData.filter(d => d["Current_Country"] === selectedRegion);
        }

        const selectedTime = +d3.select("#timeRange").property("value");
        d3.select("#timeValue").text(selectedTime + "M");
        filteredData = filteredData.filter(d => d.Time <= selectedTime);

        // Update all visualizations
        console.log("Filtered Data:", filteredData);
        mapInstance.update(filteredData, worldGeoData);
        updateTimeline(filteredData); 
        
    }
    
    // Event listeners
    d3.selectAll("#species, #region, #timeRange").on("change input", updateCharts);

    // Initial render
    updateCharts();

}).catch(error => console.error("Data loading error:", error));

// Geographical Map
class ChoroplethMap {
    constructor(containerId) {
        this.containerId = containerId;
        this.projection = d3.geoMercator();
        this.path = d3.geoPath().projection(this.projection);
        this.colorScale = d3.scaleThreshold()
            .domain([1, 5, 10, 20])
            .range(d3.schemeGreens[5]);
        
        this.initTooltip();
    }

    initTooltip() {
        d3.select("body").append("div")
            .attr("id", "map-tooltip")
            .style("position", "absolute")
            .style("padding", "8px")
            .style("background", "rgb(192, 209, 198)")
            .style("border", "1px solid #ddd")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("z-index", 10000);
            
    }

    draw(world, data) {
        const svg = d3.select(`#${this.containerId}`);
        svg.selectAll("*").remove();

        const countryData = d3.rollup(data, v => v.length, d => d.Current_Country);
        this.projection.fitSize([700, 500], world);

        svg.selectAll("path")
            .data(world.features)
            .join("path")
            .attr("d", this.path)
            .attr("fill", d => this.colorScale(countryData.get(d.properties.name) || 0))
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .on("mouseover", (event, d) => this.showTooltip(event, d, countryData))
            .on("mouseout", () => this.hideTooltip());
    }

    update(filteredData, world) {
        this.draw(world, filteredData);
    }

    showTooltip(event, d, countryData) {
        const count = countryData.get(d.properties.name) || 0;
        d3.select("#map-tooltip")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`)
            .style("opacity", 1)
            .html(`${d.properties.name}<br>Species Count: ${count}`);
    }

    hideTooltip() {
        d3.select("#map-tooltip").style("opacity", 0);
    }
    
}