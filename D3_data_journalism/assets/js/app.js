// @TODO: YOUR CODE HERE!
// Chart set up
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load csv data
d3.csv("assets/data/data.csv").then(function(CensusData) {
    // console.log(CensusData);
     // Format the data
    CensusData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        var state = data.state;
        // console.log(data.poverty);
        // console.log(data.healthcare);      
    });
    
    // Create Scales
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(CensusData, d => d.poverty)])
    .range([0,width]);
    
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(CensusData, d => d.healthcare)])
    .range([height, 0]);

    // Create Axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

      // Append the axes to the chartGroup
    chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
    chartGroup.append("g").call(leftAxis);

      
    // append circles to data points
    var circlesGroup = chartGroup.selectAll("circle")
    .data(CensusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .classed("stateCircle", true)
  
    // // add text to circles
    var circleText = chartGroup.selectAll("text")
    .data(CensusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d=> d.abbr)
    .classed("stateText", true);

    console.log(circleText);

    

    // // Append a div to the body to create tooltips, assign it a class
    // // =======================================================
    // var toolTip = d3.select("body").append("div")
    // .attr("class", "tooltip");

    // // Step 2: Add an onmouseover event to display a tooltip
    // // ========================================================
    // circlesGroup.on("mouseover", function(d, i) {
    // toolTip.style("display", "block");
    // toolTip.html(`${d.state}: <hr> Healthcare: ${d.healthcare}% <br> Poverty: ${d.poverty}%`)
    //     .style("left", d3.event.pageX + "px")
    //     .style("top", d3.event.pageY + "px");
    // })
    // // Step 3: Add an on mouseout event to make the tooltip invisible
    // .on("mouseout", function() {
    //     toolTip.style("display", "none");
    // });

})

