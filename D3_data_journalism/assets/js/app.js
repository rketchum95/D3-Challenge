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
    .domain([8, d3.max(CensusData, d => d.poverty)])
    .range([2,width]);
    
    var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(CensusData, d => d.healthcare)])
    .range([height, 2]);

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
    var circleText = chartGroup.selectAll("stateText")
    .data(CensusData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare)+4) //+4 adjusts verticle alignment of text to fit in circle
    .text(d=> d.abbr)
    .classed("stateText", true);

    // axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Lacks Healthcare (%)");

    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Poverty (%)");
        

    // // create tooltip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}: <br> Healthcare: ${d.healthcare}% <br> Poverty: ${d.poverty}%`);
    });

    chartGroup.call(toolTip);
   
    circlesGroup.on("mouseover", function(d) {
      toolTip.show(d, this);
    })
    
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });


})

