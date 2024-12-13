function generateRandomDataset(size) {
  const names = [
    "Alice",
    "Bob",
    "Charlie",
    "Diana",
    "Edward",
    "Fiona",
    "George",
    "Hannah",
    "Ivan",
    "Julia",
  ];
  const eyeColors = ["blue", "green", "brown", "hazel", "gray"];

  function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomAge() {
    return Math.floor(Math.random() * 101); // Age between 0 and 100
  }

  function getRandomScore() {
    return Math.floor(Math.random() * 101); // Score between 0 and 100
  }

  return Array.from({ length: size }, () => ({
    name: getRandomElement(names),
    age: getRandomAge(),
    score: getRandomScore(), // New numeric property for X/Y scatter plot
    eyeColor: getRandomElement(eyeColors),
  }));
}

const dataset = generateRandomDataset(20);

console.log(dataset);

const svg1 = d3.select("#viz1");
const parent = svg1.node().parentNode.getBoundingClientRect();
const width = parent.width;
const height = parent.height;

console.log(width, height);

svg1.attr("width", width).attr("height", height);


const xScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 500]);

const yScale = d3.scaleLinear()
  .domain([0, 100])
  .range([400, 0]); 

const fontSizeScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([8, 18]); 

  
const colorScale = d3
  .scaleOrdinal()
  .domain(["blue", "green", "brown", "hazel", "gray"])
  .range(["#4A90E2", "#50C878", "#8B4513", "#CD853F", "#A9A9A9"]);

  

// Adding "text" elements to scatter plot
d3.select("#viz1") // Select SVG element
.selectAll("text") // Select all (non-existing) text elements
.data(dataset) // Bind data to these elements
.enter() // Enter (add new elements)
.append("text") // Add new <text> element for each data point
.attr("x", (d) => xScale(d.age)+100) // Set X-coordinate based on "age"
.attr("y", (d) => yScale(d.score)) // Set Y-coordinate based on "score"
.attr("font-size", (d) => fontSizeScale(d.age)) // Dynamically set font size
.attr("fill", (d) => colorScale(d.eyeColor)) // Text color based on eye color
.style("cursor", "pointer")
.text((d) => d.name); // Display person's name as text


// X-axis (below scatter plot)
const xAxis = d3.axisBottom(xScale);

d3.select("#viz1")
.append("g")
.attr("transform", "translate(100, 400)") // Move to bottom of SVG
.call(xAxis);

// Y-axis (left of scatter plot)
const yAxis = d3.axisLeft(yScale);

d3.select("#viz1")
.append("g")
.attr("transform", "translate(100, 0)") // Left at start of SVG
.call(yAxis);


const list = d3.select("#viz2")
.append("ul")

const listItems = list.selectAll("li")
.data(dataset)
.enter()
.append("li")
.attr("class", d => "list-item-${d.name}")
.text(d => `${d.name}, ${d.age}, ${d.score}, ${d.eyeColor}`);




// Connect hover on list items with hover on scatter plot
d3.selectAll("li")
.on("mouseover", function (event, d) {
  d3.selectAll("text")
    .filter((li) => li.name === d.name && li.age === d.age && li.score === d.score && li.eyeColor === d.eyeColor)
    .style("font-size", "20px")
    .style("font-weight", "bold");
})
.on("mouseout", function (event, d) {
  d3.selectAll("text")
    .filter((li) => li.name === d.name && li.age === d.age && li.score === d.score && li.eyeColor === d.eyeColor)
    .style("font-size", (d) => fontSizeScale(d.age))
    .style("font-weight", "normal");
});

// Connect hover on scatter plot with hover on list items
d3.selectAll("text")
.on("mouseover", function (event, d) {
  d3.selectAll("li")
    .filter((text) => text.name === d.name && text.age === d.age && text.score === d.score && text.eyeColor === d.eyeColor)
    .style("font-size", "20px")
    .style("font-weight", "bold");
})
.on("mouseout", function (event, d) {
  d3.selectAll("li")
    .filter((text) => text.name === d.name && text.age === d.age && text.score === d.score && text.eyeColor === d.eyeColor)
    .style("font-size", (d) => fontSizeScale(d.age))
    .style("font-weight", "normal");
});


// Style text in scatter plot
d3.selectAll("text")
.style("font-family", "Arial")
.style("text-anchor", "middle");