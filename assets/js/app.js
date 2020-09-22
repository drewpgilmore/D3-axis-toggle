// @TODO: YOUR CODE HERE!

// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 660;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 30,
  bottom: 30,
  left: 30
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and down to adhere
// to the margins set in the "chartMargin" object.
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

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
    .domain([d3.min(data, d => d[chosenXAxis]) - 2.5,
    d3.max(data, d => d[chosenYAxis]) + 2.5
    ])
    .range([height, 0]);
  return yScale;
}

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