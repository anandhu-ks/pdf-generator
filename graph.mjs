import * as d3 from 'd3';


window.drawGroupedSalesCollectionChart = function (
  salesCollectionData,
  software
) {

  const elementId = "div#sales-collection-plot";
  const tableId = "sales-collection-table";

  const margin = { top: 10, right: 30, bottom: 30, left: 60 };
  const width = 500 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;

  const data = salesCollectionData;

  const svg = d3
    .select(elementId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr(
      "transform",
      "translate(" + margin.left + "," + margin.top + ")"
    );

  const parseTime = d3.timeParse("%Y-%m-%d");
  const formatMonth = d3.timeFormat("%b");

  data.forEach((d) => {
    d.end_of_month = parseTime(d.end_of_month);
    d.partial_month = formatMonth(d.end_of_month);
  });

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.partial_month))
    .range([0, width])
    .padding(0.4);
  const xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0).tickPadding(10));

  xAxis
    .style("font-family", "Montserrat")
    .style("color", "#22222280")
    .style("font-size", "10px")
    .style("font-weight", "600")
    .selectAll("path")
    .style("stroke", "#FFFFFF")
    .style("stroke-width", 0);

  //Define max range of Y axis
  const maxSales = +(d3.max(data, (d) => +d.sales) || 0);
  const maxCollection = +(d3.max(data, (d) => +d.collection) || 0);
  const maxY =
    maxSales > maxCollection ? maxSales + 1000 : maxCollection + 1000;

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => Math.max(d.sales, d.collection))])
    .range([height, 0]);
  const yAxis = svg
    .append("g")
    .call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .ticks(6)
        .tickValues(d3.range(0, maxY + 1, maxY / 5))
        .tickFormat(d3.format(".2s"))
    )
    .style("font-family", "Montserrat")
    .style("color", "#22222280")
    .style("font-size", "10px")
    .style("font-weight", "600")
    // .style('opacity', '0.5')
    .selectAll("path")
    .style("stroke", "#FFFFFF")
    .style("stroke-width", 0);

  const color = d3
    .scaleOrdinal()
    .domain(["sales", "collection"])
    .range(["#9747FF26", "#9747FF14"]);

  // Draw sales bars
  svg
    .selectAll(".sales-bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "sales-bar")
    .attr("x", (d) => x(d.partial_month) - x.bandwidth() / 4)
    .attr("y", (d) => y(d.sales))
    .attr("width", x.bandwidth() / 2)
    .attr("height", (d) => height - y(d.sales))
    .attr("fill", color("sales"));

  // Draw collection bars
  svg
    .selectAll(".collection-bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "collection-bar")
    .attr("x", (d) => x(d.partial_month) + x.bandwidth() / 4)
    .attr("y", (d) => y(d.collection))
    .attr("width", x.bandwidth() / 2)
    .attr("height", (d) => height - y(d.collection))
    .attr("fill", color("collection"));

  // Draw table
  const table = d3.select("#" + tableId);
  const columns = ["Month", "Sales", "Collection"];

  // Add table header
  table
    .append("thead")
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text((d) => d)
    .style("font-family", "Montserrat")
    .style("text-align", (d) => {
      return d == "Sales" || d == "Collection" ? "right" : "left";
    });

  // Add table rows
  const tableBody = table.append("tbody");

  data.forEach((d) => {
    const row = tableBody.append("tr");

    row
      .append("td")
      .text(d.partial_month)
      .style("font-family", "Montserrat");

    row
      .append("td")
      .text(`₹${d.sales}`)
      .style("color", "green")
      .style("text-align", "right")
      .style("font-family", "Montserrat");
    row
      .append("td")
      .text(`₹${d.collection}`)
      .style("color", "red")
      .style("text-align", "right")
      .style("font-family", "Montserrat");
  });
}


