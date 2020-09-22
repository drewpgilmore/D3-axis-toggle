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

// Load data from hours-of-tv-watched.csv
d3.csv("assets/data/data.csv").then(d => {
    
    // clean data and change types to number
    d.forEach(d => {
        d.poverty = +d.poverty;
        d.age = +d.age;
        d.income = +d.income;
        d.obesity = +d.obesity;
        d.smokes = +d.smokes;
        d.healthcare = +d.healthcare;
    });

    // x axis variables
    var povertyPct = d.map(d => d.poverty);
    var medianAge = d.map(d => d.age);
    var medianIncome = d.map(d => d.income);
    
    // y axis variables
    var obesePct = d.map(d => d.obesity);
    var smokersPct = d.map(d => d.smokes);
    var noHealthCarePct = d.map(d => d.healthcare);

    var x = d3.scaleBand()
        .domain()
        .range([0, 1])
        .padding(0.05);
    svg.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x));
    
    var y = d3.scaleLinear()
        .domain([0, 1])
        .range([chartHeight, 0]);
    svg.append("g")
        // .attr("transform", `translate(${chartHeight})`)
        .call(d3.axisLeft(y));


    
    // create scatter plot
    chartGroup.selectAll("#scatter")
      .data(d)
      .enter()
      .append("rect")
      .classed("bar", true)
      .attr("width", d => barWidth)
      .attr("height", d => d.poverty * scaleY)
      .attr("x", (d, i) => i * (barWidth + barSpacing))
      .attr("y", d => chartHeight - d.poverty * scaleY);
  }).catch(function(error) {
    console.log(error);
});