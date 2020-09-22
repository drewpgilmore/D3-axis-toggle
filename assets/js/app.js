// set SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// set chart margins and dimensions
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 100
};
var width = svgWidth - chartMargin.left - chartMargin.right;
var height = svgHeight - chartMargin.top - chartMargin.bottom;

// append SVG
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// set variables for chosen x and y variables
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function for x and y scale setting per the chosen variables
function xScale(data, chosenXAxis) {
  var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) - 2.5,
      d3.max(data, d => d[chosenXAxis]) + 2.5
      ])
    .range([0, width]);
  return xScale;
}

function yScale(data, chosenYAxis) {
  var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) - 2.5,
      d3.max(data, d => d[chosenYAxis]) + 2.5
      ])
    .range([height, 0]);
  return yScale;
}

// function for rendering new scales per the chosen variables
function renderX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);
  return xAxis;
}

function renderY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
    .duration(1000)
    .call(leftAxis);
  return yAxis;
}

// function to plot circles per the chose variables
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {
  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));
  return circlesGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  var xLabel;
  if (chosenXAxis == "poverty") {
    xLabel = "In Poverty (%)";
  }
  else if (chosenXAxis == "age") {
    xLabel == "Age (Median)";
  }
  else if (chosenXAxis == "income") {
    xLabel == "Household Income (Median)";
  }

  var yLabel; 
  if (chosenYAxis == "healthcare") {
    yLabel = "Lacks Healthcare (%)";
  }
  else if (chosenYAxis == "smokes") {
    yLabel = "Smokes (%)";
  }
  else if (chosenYAxis == "obesity") {
    yLabel = "Obesity (%)";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state} <br> ${d[chosenYAxis]} <br> ${d[chosenXAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });
  return circlesGroup;
}


var variables = ["poverty", "age", "income", "healthcare", "smokes", "obesity"];

d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data - convert desired variables into numbers
  censusData.forEach(d => {
    for (var i = 0; i < variables.length; i++) {
      d[`${variables[i]}`] = +d[`${variables[i]}`];
    };
  })

  var xLinearScale = xScale(censusData, chosenXAxis); 
  var yLinearScale = yScale(censusData, chosenYAxis); 

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .attr("opacity", "0.5");

  var xLabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");
  var ageLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 45)
    .attr("value", "age")
    .classed("active", true)
    .text("Age (Median)");
  var incomeLabel = xLabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 70)
    .attr("value", "income")
    .classed("active", true)
    .text("Household Income (Median)");

  

  var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  var healthcareLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - 85)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");
  var smokesLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - 60)
    .attr("value", "smokes")
    .classed("active", true)
    .text("Smokes (%)");
  var obeseLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - 35)
    .attr("value", "obesity")
    .classed("active", true)
    .text("Obese (%)");

  



}).catch(error => {
  console.log(error);
});