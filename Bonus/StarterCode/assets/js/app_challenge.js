//Defining chart size
var width = parseInt(d3.select(".chart").style("width"));
var height = width - width / 3.9;
var margin = 20;
var labelArea = 110;
var tPadBot = 40;
var tPadLeft = 40;

//Create SVG Element
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

  //Define Scaling of Radius size according to screen size
  var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

//Append Group Element & Define Functions

svg.append("g").attr("class", "xText");
// xText will allows us to select the group without excess code.
var xtext = d3.select(".xText");

function xtextRefresh() {
    xtext.attr(
      "transform",
      "translate(" +
        ((width - labelArea) / 2 + labelArea) +
        ", " +
        (height - margin - tPadBot) +
        ")"
    );
  }
  xtextRefresh();

  //Creating X Lables
// 1. Poverty
xtext
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// 2. Age
xtext
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// 3. Income
xtext
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

  //Defining Y- axis
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;
svg.append("g").attr("class", "yText");
var ytext = d3.select(".yText");

function yTextRefresh() {
    ytext.attr(
      "transform",
      "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
  }
  yTextRefresh();
// 1. Obese
  ytext
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");
// 2. Smokes
ytext
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");
// 3. Lacks Healthcare
ytext
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

  d3.csv("assets/data/data.csv").then(function(data) {
    // Visualize the data
    visualize(data);
  });

  function visualize(data){
    var curX = "poverty";
    var curY = "obesity";
    var xMin;
    var xMax;
    var yMin;
    var yMax;
    var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      // x key
      var theX;
      // Grab the state name.
      var theState = "<div>" + d.state + "</div>";
      // Snatch the y value's key and value.
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";
      // If the x key is poverty
      if (curX === "poverty") {
        // Grab the x key and a version of the value formatted to show percentage
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {
        // Otherwise
        // Grab the x key and a version of the value formatted to include commas after every third digit.
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Display what we capture.
      return theState + theX + theY;
    });
  // Call the toolTip function.
  svg.call(toolTip);
  function xMinMax() {
    // min will grab the smallest datum from the selected column.
    xMin = d3.min(data, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    xMax = d3.max(data, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }
  // b. change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    yMin = d3.min(data, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });
    // .max will grab the largest datum from the selected column.
    yMax = d3.max(data, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }
  // c. change the classes (and appearance) of label text when clicked.
  function labelChange(axis, clickedText) {
    // Switch the currently active to inactive.
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);
    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  } 
  xMinMax();
  yMinMax();
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    // Height is inverses due to how d3 calc's y-axis placement
    .range([height - margin - labelArea, margin]);
    
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

//Circle Data
var theCircles = svg.selectAll("g theCircles").data(data).enter();
theCircles
    .append("circle")
    // These attr's specify location, size and class.
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // Hover rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d, this);
      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove the tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });
    theCircles
    .append("text")
    // We return the abbreviation to .text, which makes the text the abbreviation.
    .text(function(d) {
      return d.abbr;
    })
    // Now place the text using our scale.
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      // When the size of the text is the radius,
      // adding a third of the radius to the height
      // pushes it into the middle of the circle.
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")
    // Hover Rules
    .on("mouseover", function(d) {
      // Show the tooltip
      toolTip.show(d);
      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      // Remove tooltip
      toolTip.hide(d);
      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

    d3.selectAll(".aText").on("click", function() {
        // Make sure we save a selection of the clicked text,
        // so we can reference it without typing out the invoker each time.
        var self = d3.select(this);
        // We only want to run this on inactive labels.
        // It's a waste of the processor to execute the function
        // if the data is already displayed on the graph.
        if (self.classed("inactive")) {
          // Grab the name and axis saved in label.
          var axis = self.attr("data-axis");
          var name = self.attr("data-name");
          // When x is the saved axis, execute this:
          if (axis === "x") {
            // Make curX the same as the data name.
            curX = name;
            // Change the min and max of the x-axis
            xMinMax();
            // Update the domain of x.
            xScale.domain([xMin, xMax]);
            // Now use a transition when we update the xAxis.
            svg.select(".xAxis").transition().duration(1000).call(xAxis);
            // With the axis changed, let's update the location of the state circles.
            d3.selectAll("circle").each(function() {
              // Each state circle gets a transition for it's new attribute.
              // This will lend the circle a motion tween
              // from it's original spot to the new location.
              d3
                .select(this)
                .transition()
                .attr("cx", function(d) {
                  return xScale(d[curX]);
                })
                .duration(300);
            });
            // We need change the location of the state texts, too.
            d3.selectAll(".stateText").each(function() {
              // We give each state text the same motion tween as the matching circle.
              d3
                .select(this)
                .transition()
                .attr("dx", function(d) {
                  return xScale(d[curX]);
                })
                .duration(300);
            });
            // Finally, change the classes of the last active label and the clicked label.
            labelChange(axis, self);
        }
            else {
                // When y is the saved axis, execute this:
                // Make curY the same as the data name.
                curY = name;
                // Change the min and max of the y-axis.
                yMinMax();
                // Update the domain of y.
                yScale.domain([yMin, yMax]);
                // Update Y Axis
                svg.select(".yAxis").transition().duration(300).call(yAxis);
                // With the axis changed, let's update the location of the state circles.
                d3.selectAll("circle").each(function() {
                  // Each state circle gets a transition for it's new attribute.
                  // This will lend the circle a motion tween
                  // from it's original spot to the new location.
                  d3
                    .select(this)
                    .transition()
                    .attr("cy", function(d) {
                      return yScale(d[curY]);
                    })
                    .duration(300);
                });
                // We need change the location of the state texts, too.
                d3.selectAll(".stateText").each(function() {
                  // We give each state text the same motion tween as the matching circle.
                  d3
                    .select(this)
                    .transition()
                    .attr("dy", function(d) {
                      return yScale(d[curY]) + circRadius / 3;
                    })
                    .duration(300);
                });
                // Finally, change the classes of the last active label and the clicked label.
                labelChange(axis, self);
              }
            }
          });
          d3.select(window).on("resize", resize);
  // One caveat: we need to specify what specific parts of the chart need size and position changes.
  function resize() {
    // Redefine the width, height and leftTextY (the three variables dependent on the width of the window).
    width = parseInt(d3.select(".chart").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;
    // Apply the width and height to the svg canvas.
    svg.attr("width", width).attr("height", height);
    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);
    // With the scales changes, update the axes (and the height of the x-axis)
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    svg.select(".yAxis").call(yAxis);
    // Update the ticks on each axis.
    //tickCount();
    // Update the labels.
    xTextRefresh();
    yTextRefresh();
    // Update the radius of each dot.
    crGet();
    // With the axis changed, let's update the location and radius of the state circles.
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });
    // We need change the location and size of the state texts, too.
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }

          }