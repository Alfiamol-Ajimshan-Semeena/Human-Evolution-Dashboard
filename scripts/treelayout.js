// Function to draw a horizontal Tree Layout for Evolution Data
function drawTimelineTree(filteredData) {
    const margin = { top: 50, right: 90, bottom: 90, left: 10 },
        width = 600 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    d3.select("#family-container").html("");

    const svg = d3.select("#family-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(filteredData);
    const family = d3.tree().size([width, height]);
    family(root);

    // Draw links between nodes
    svg.selectAll(".tree-link")
        .data(root.links())
        .enter().append("path")
        .attr("class", "tree-link")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-width", "2px")
        .attr("d", d3.linkVertical()
            .x(d => d.x)
            .y(d => d.y)
        );

    // Create node groups
    const node = svg.selectAll(".tree-node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", "tree-node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add circles to nodes
    node.append("circle")
        .attr("class", "tree-circle")
        .attr("r", 10)
        .style("fill", "#8B4513");

    // Add text labels with 45-degree rotation
    node.append("text")
        .attr("class", "node-label")
        .attr("text-anchor", "middle")
        .attr("dy", "-1em") 
        .style("font-size", "10px")
        .style("fill", "#000000")
        .style("font-weight", "400") 
    .style("letter-spacing", "0.5px") 
    .attr("transform", "rotate(-30)") 
    .text(d => d.data.name);

}


// Sample data
const timelineData = {
    "name": "Tribe: Hominini",
    "children": [
        {
            "name": "Subtribe: Hominina",
            "children": [
                {
                    "name": "Sahelanthropus tchadensis",
                    "children": []
                },
                {
                    "name": "Orrorin tugenensis",
                    "children": []
                },
                {
                    "name": "Ardipithecus kadabba",
                    "children": [
                        {
                            "name": "Ardipithecus ramidus",
                            "children": [
                                {
                                    "name": "Australopithecus anamensis",
                                    "children": [
                                        {
                                            "name": "Australopithecus afarensis",
                                            "children": [
                                                { "name": "Australopithecus bahrelghazali" },
                                                {
                                                    "name": "Australopithecus garhi",
                                                    "children": [
                                                        {
                                                            "name": "Homo habilis",
                                                            "children": [
                                                                { "name": "Homo rudolfensis" },
                                                                {
                                                                    "name": "Homo ergaster",
                                                                    "children": [
                                                                        {
                                                                            "name": "Homo erectus",
                                                                            "children": [
                                                                                { "name": "Homo georgicus" },
                                                                                { "name": "Homo floresiensis" }
                                                                            ]
                                                                        },
                                                                        {
                                                                            "name": "Homo antecessor",
                                                                            "children": [
                                                                                {
                                                                                    "name": "Homo heidelbergensis",
                                                                                    "children": [
                                                                                        { "name": "Homo rhodesiensis" },
                                                                                        { "name": "Homo neanderthalensis" },
                                                                                        { "name": "Homo sapiens" }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                { "name": "Australopithecus africanus" },
                                                { "name": "Australopithecus sediba" }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "Homo naledi",
                    "children": []
                }
            ]
        },
        {
            "name": "Genus: Paranthropus",
            "children": [
                { "name": "Paranthropus aethiopicus" },
                { "name": "Paranthropus boisei" },
                { "name": "Paranthropus robustus" }
            ]
        }
    ]
};

// Initialize the tree when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    drawTimelineTree(timelineData);
});