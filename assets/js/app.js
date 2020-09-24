// set SVG area dimensions
var svgWidth = 1140;
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
  .attr("width", svgWidth)
  .style("margin-bottom", 30);

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
    .domain([d3.min(data, d => d[chosenXAxis]) * .8,
      d3.max(data, d => d[chosenXAxis]) * 1.1
      ])
    .range([0, width]);
  return xScale;
}

function yScale(data, chosenYAxis) {
  var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * .8,
      d3.max(data, d => d[chosenYAxis]) * 1.1
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
    xLabel = "Poverty";
  }
  else if (chosenXAxis == "age") {
    xLabel == "Age";
  }
  else if (chosenXAxis == "income") {
    xLabel == "Income";
  }

  var yLabel; 
  if (chosenYAxis == "healthcare") {
    yLabel = "Lacks Healthcare";
  }
  else if (chosenYAxis == "smokes") {
    yLabel = "Smokes";
  }
  else if (chosenYAxis == "obesity") {
    yLabel = "Obese";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([100, 0])
    .attr("fill", "black")
    .html(function(d) {
      return (`${d.state} <br>${chosenYAxis}: ${d[chosenYAxis]} <br>${chosenXAxis}: ${d[chosenXAxis]}`);
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
    .attr("id", "Circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "blue")
    .style("fill-opacity", "0.5")
    .attr("stroke", "black")
    .style("stroke-width", 2);

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
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks Healthcare (%)");
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

  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  xLabelsGroup.selectAll("text").on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {
      chosenXAxis = value;
      xLinearScale = xScale(censusData, chosenXAxis);
      xAxis = renderX(xLinearScale, xAxis);
      yLinearScale = yScale(censusData, chosenYAxis);
      yAxis = renderY(yLinearScale, yAxis);
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      if (chosenXAxis == "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis == "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis == "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
        }
    }
  });

  yLabelsGroup.selectAll("text").on("click", function() {
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {
      chosenYAxis = value;
      xLinearScale = xScale(censusData, chosenXAxis);
      xAxis = renderX(xLinearScale, xAxis);
      yLinearScale = yScale(censusData, chosenYAxis);
      yAxis = renderY(yLinearScale, yAxis);
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
      if (chosenYAxis == "healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis == "smokes") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis == "obese") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        }
    };
  });
}).catch(error => {
  console.log(error);
});