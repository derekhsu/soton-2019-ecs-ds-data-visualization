<template>
  <div></div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Legends",
  mounted() {
    d3.csv(
      "https://docs.google.com/spreadsheets/d/1uWqIeCVUUiG34Mfr5XUjFQ-vV38PrYeWR2f6Wnanfek/gviz/tq?tqx=out:csv"
    ).then(data => {
      //We're going to pre-process the data here
      var countriesOfInterest = [
        "United Kingdom",
        "Brazil",
        "India",
        "Germany",
        "Japan"
      ];
      //This is where we'll store the processed data
      var countries = [];

      data.forEach(d => {
        if (countriesOfInterest.indexOf(d["Country Name"]) > -1) {
          var country = {};

          country.countryName = d["Country Name"];
          country.birthrates = [];

          data.columns.slice(5).forEach(year => {
            var datum = {};
            datum.year = new Date(+year, 0, 1);
            datum.birthrate = +d[year];
            country.birthrates.push(datum);
          });
          countries.push(country);
        }
      });

      var margin = { top: 100, right: 100, bottom: 100, left: 100 };
      var width = 800;
      var height = 300;

      var svg = d3
        .select(this.$el)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var min = d3.min(countries, function(c) {
        return d3.min(c.birthrates, function(d) {
          return d.year;
        });
      });

      var x = d3
        .scaleTime()
        .domain([
          min,
          d3.max(countries, function(c) {
            return d3.max(c.birthrates, function(d) {
              return d.year;
            });
          })
        ])
        .range([0, width]);

      var y = d3
        .scaleLinear()
        .domain([
          d3.min(countries, function(c) {
            return d3.min(c.birthrates, function(d) {
              return d.birthrate;
            });
          }),
          d3.max(countries, function(c) {
            return d3.max(c.birthrates, function(d) {
              return d.birthrate;
            });
          })
        ])
        .range([height, 0]);

      var colourScheme = d3.scaleOrdinal(d3.schemeCategory10).domain(
        countries.map(d => {
          return d.countryName;
        })
      );

      var line = d3
        .line()
        .x(d => {
          return x(d.year);
        })
        .y(d => {
          return y(d.birthrate);
        });

      var country = svg
        .selectAll(".country")
        .data(countries)
        .enter()
        .append("g")
        .attr("class", "country");

      //We then add a path to *every* "country" group at once
      country
        .append("path")
        .attr("class", "line")
        //Remember I said we were doing to use the line differently?
        //This time, when we create the line, we pass the array of birthrates
        //for each country directly to it as a *parameter*
        .attr("d", function(d) {
          return line(d.birthrates);
        })
        .attr("fill", "none")
        .attr("stroke-width", 2)
        //Finally, we set the colour based on the scheme
        .style("stroke", function(d) {
          return colourScheme(d.countryName);
        });

      //Add the x axis
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("fill", "#000")
        .attr("y", 40)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .text("Year");

      //Add the y axis
      svg
        .append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("fill", "#000")
        .attr("y", -40)
        .attr("x", -height / 2)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Average Birthrate");

      //For every line
      country
        .append("text")
        //Get the *last* data value for each line, so we know where to position the text
        .attr("transform", function(d) {
          var lastValue = d.birthrates[d.birthrates.length - 1];
          return (
            "translate(" +
            x(lastValue.year) +
            "," +
            y(lastValue.birthrate) +
            ")"
          );
        })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) {
          return d.countryName;
        });

      //Create the legend, and save it as a variable so we can access it in a moment
      var legend = d3
        .select("svg")
        .append("g")
        .attr("class", "legend")
        //We want to place our legend on the right hand side of the graph (at about (750,100))
        .attr("transform", (d, i) => {
          return "translate(" + (width - 50) + ",100)";
        });

      //Specify the items placed in the legend and add them to the legend
      var items = legend
        .selectAll(".legendItem")
        .data(countries)
        .enter()
        .append("g")
        .attr("class", "legendItem")
        //Move each item in the legend to the right so that we can display a line next to a label, where i is the number of the item in the list
        .attr("transform", function(d, i) {
          return "translate(0," + i * 20 + ")";
        });

      //Add a line in the correct colour to the legend next to the label
      items
        .append("line")
        //start point of line (x1,y1), end point of line (x2,y2)
        .attr("x1", 0)
        .attr("x2", 10)
        .attr("y1", 0)
        .attr("y2", 0)
        //set the colour of the line
        .style("stroke", function(d) {
          return colourScheme(d.countryName);
        });

      //Add the name of each country and style the text
      items
        .append("text")
        .text(function(d) {
          return d.countryName;
        })
        .style("font", "10px sans-serif")
        .attr("text-anchor", "right")
        .attr("alignment-baseline", "middle")
        .attr("transform", function(d) {
          return "translate(15,0)";
        });

      //Draw a grey rectangle with a margin of 15 (attributes x and y) around the legend
      legend
        .append("rect")
        .attr("x", -15)
        .attr("y", -15)
        .attr("width", 120)
        .attr("height", 110)
        .attr("fill", d3.rgb(220, 220, 220, 0.7));
    });
  }
};
</script>

<style scoped></style>
