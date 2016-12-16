$(document).ready(function(){

	w = $(window).width();
	$("#main").fullpage({
			scrollingSpeed: 600
		})
	$(".advance").click(function(){
		$.fn.fullpage.moveSectionDown();
	})
	drawWestScatter();
	drawBalkansScatter();
	drawMideastScatter();
	drawSummaryScatter();

	$(window).resize(function(){
		resize();
	})
	$("#advance3").click(function(){
		//replay animation
		setTimeout(function(){
			playWestAnimation();
		}, 0);
		$("#westTitleText").hide();
		$("#replayWest").hide();
		$("#westScatterHolder").hide()
		setTimeout(function(){
			$("#westTitleText").fadeIn();
			$("#replayWest").fadeIn();
			$("#westScatterHolder").fadeIn()
		}, 6000);
	})
	$("#replayWest").click(function(){
		playWestAnimation();
	})
});

function checkScreenHeight(){
	var h = $(window).height();
	if (h < 700){
		//alert("For the best viewing experience, please view this website on a large screen.")
	}
}




function playWestAnimation(){
	$("#westAni").attr('src', "assets/final/west.gif");
}

function playBalkanAnimation(){
	$("#balkanAni").attr('src', 'assets/balkan1.gif');
}

function resize(){
	checkScreenHeight()
	$("#westScatterHolder").empty();
	$("#balkansScatter").empty();
	$("#mideastScatter").empty();
	$("#summaryScatterHolder").empty();
	drawWestScatter()
	drawBalkansScatter()
	drawMideastScatter()
	drawSummaryScatter()
}

function drawWestScatter(){
	var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	margin = {
		top: 25,
		left: 25,
		right: 25,
		bottom: 25
	};

	width = $(window).width()   * 0.25 //- margin.left - margin.right
	height = $(window).height() * 0.25 - margin.top - margin.bottom

	var y = d3.scale.linear().range([height, 0]);
	var x = d3.scale.linear().range([width, 0]);
		var color = d3.scale.ordinal()
  .domain(["Italy", "Spain", "Malta"])
  .range(["#fbb4ae", "#b3cde3" , "#ccebc5"]);

	// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

	// Define the axes

var svg = d3.select("#westScatterHolder")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

   // Get the data
d3.csv("assets/final/west.csv", function(error, data) {
    data.forEach(function(d) {
        d.X = +d.X
        d.Y = +d.Y;
    });

    // Scale the range of the data
    x.domain([d3.max(data, function(d){return +d.X}), 0]);
    y.domain([0, d3.max(data, function(d){return +d.Y})]);




    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r",5)
        .attr("cx", function(d) { return x(d.X); })
        .attr("cy", function(d) { return y(d.Y); })
        .style("fill", function(d) { return color(d.Country); })
                        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(
            	"<b>" + d.Country + "</b><p>Mentions: " + d.Y + "</p><p>Arriving Refugees:" + d.X + "</p>"
            	)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", color(d.Country))
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0)});

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(xAxis)
        .append("text")
      .attr("class", "label")
      .attr("x", x(d3.max(data, function(d){return d.X})))
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Monthly New Arrivals");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Mentions")

      svg.append('line')
    	.attr('x1', x(0))
    	.attr('x2', x(1500))
    	.attr('y1', y(0.9615))
    	.attr('y2', y(12.6615))
    	.style('stroke', 'gray')
    	.style('stroke-weight', 1)
    	    	    		     .on("mouseover", function(d){
	     	div.transition()
	     		.duration(200)
	     		.style("opacity", 0.9)
	     	div.html("<b>Trendline</b><p>y=0.0078x + 0.9615</p><p>R<sup>2</sup> = 0.19043</p>")
	     	.style("left", (d3.event.pageX) + "px")
	     	.style("top", (d3.event.pageY) + "px")
	     	.style("background", 'white')

	     })
	     .on("mouseout", function(d){
	     	div.transition(500)
	     	.style("opacity", 0)
	     });


  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", x(d3.max(data, function(d){return d.X})) - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", x(d3.max(data, function(d){return d.X})) - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
}


function drawBalkansScatter(){
	var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	//scales

		margins = {
		top: 50,
		left: 25,
		right: 25,
		bottom: 100
	};
	width = $("#balkansTitleContainer2").width() - margin.left - margin.right;
	height = $("#balkansTitleContainer2").height()  - margin.bottom - margin.top;

	var y = d3.scale.linear().range([height, 0]);
	var x = d3.scale.linear().range([width, 0]);
	var color = d3.scale.ordinal()
  .domain(["Austria", "Slovenia", "Hungary", "Macedonia", "Croatia", "Greece", "Serbia"])
  .range(["#fbb4ae", "#b3cde3" , "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd"]);

	// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

	// Define the axes

var svg = d3.select("#balkansScatter")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

   // Get the data
d3.csv("assets/final/balkans.csv", function(error, data) {
    data.forEach(function(d) {
        d.X = +d.X
        d.Y = +d.Y;
        console.log(x(d.X) + "/" + y(d.Y))
    });

    // Scale the range of the data
    x.domain([d3.max(data, function(d){return +d.X}), 0]);
    y.domain([0, d3.max(data, function(d){return +d.Y})]);




    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r",5)
        .attr("cx", function(d) { return x(d.X); })
        .attr("cy", function(d) { return y(d.Y); })
        .style("fill", function(d) { return color(d.Country); })
                .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(
            	"<b>" + d.Country + "</b><p>Mentions: " + d.Y + "</p><p>Arriving Refugees:" + d.X + "</p>"
            	)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", color(d.Country))
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0)});

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(xAxis)
        .append("text")
      .attr("class", "label")
      .attr("x", x(d3.max(data, function(d){return d.X})))
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Weekly New Arrivals");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Mentions")

          svg.append('line')
    	.attr('x1', x(0))
    	.attr('x2', x(80000))
    	.attr('y1', y(5.6011))
    	.attr('y2', y(12.8011))
    	.style('stroke', 'gray')
    	.style('stroke-weight', 1)
    	    		     .on("mouseover", function(d){
	     	div.transition()
	     		.duration(200)
	     		.style("opacity", 0.9)
	     	div.html("<b>Trendline</b><p>y=0.0009x + 5.6011</p><p>R<sup>2</sup> = 0.01691</p>")
	     	.style("left", (d3.event.pageX) + "px")
	     	.style("top", (d3.event.pageY) + "px")
	     	.style("background", 'white')

	     })
	     .on("mouseout", function(d){
	     	div.transition(500)
	     	.style("opacity", 0)
	     });


  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", x(d3.max(data, function(d){return d.X}))  - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", x(d3.max(data, function(d){return d.X}))  - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

   console.log(color)

});
}


function drawMideastScatter(){
	var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	console.log("Drawing...")
	//scales
		margin = {
		top: $("#MidEastContainer2").height() * .1,
		left: 25,
		right: $("#MidEastContainer2").width() * .25,
		bottom: 30,
	};
	width = $("#MidEastContainer2").width()  - margin.left - margin.right ;
	height = $("#MidEastContainer2").height() * .3 - margin.top - margin.bottom ;

	var y = d3.scale.linear().range([height, 0]);
	var x = d3.scale.linear().range([width, 0]);
		var color = d3.scale.ordinal()
  .domain(["Lebanon", "Turkey", "Jordan", "Egypt", "Iraq", ])
  .range(["#fbb4ae", "#b3cde3" , "#ccebc5", "#decbe4", "#fed9a6" ]);

	// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

	// Define the axes

var svg = d3.select("#mideastScatter")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

   // Get the data
d3.csv("assets/final/me.csv", function(error, data) {
    data.forEach(function(d) {
        d.X = +d.X
        d.Y = +d.Y;
    });

    // Scale the range of the data
    x.domain([d3.max(data, function(d){return +d.X}), 0]);
    y.domain([0, d3.max(data, function(d){return +d.Y})]);




    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r",5)
        .attr("cx", function(d) { return x(d.X); })
        .attr("cy", function(d) { return y(d.Y); })
        .style("fill", function(d) { return color(d.Country); })
                .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(
            	"<b>" + d.Country + "</b><p>Mentions: " + d.Y + "</p><p>Arriving Refugees:" + d.X + "</p>"
            	)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", color(d.Country))
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0)});

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + y(0) + ")")
        .call(xAxis)
        .append("text")
      .attr("class", "label")
      .attr("x", x(d3.max(data, function(d){return d.X})))
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Monthly New Arrivals");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Mentions");

    //trendline
    svg.append('line')
    	.attr('x1', x(0))
    	.attr('x2', x(200000))
    	.attr('y1', y(25.875))
    	.attr('y2', y(29.875))
    	.style('stroke', 'gray')
    	.style('stroke-weight', 1)
    		     .on("mouseover", function(d){
	     	div.transition()
	     		.duration(200)
	     		.style("opacity", 0.9)
	     	div.html("<b>Trendline</b><p>y=0.00002x + 25.875</p><p>R<sup>2</sup> = 0.0014</p>")
	     	.style("left", (d3.event.pageX) + "px")
	     	.style("top", (d3.event.pageY) + "px")
	     	.style("background", 'white')

	     })
	     .on("mouseout", function(d){
	     	div.transition(500)
	     	.style("opacity", 0)
	     })


  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", x(d3.max(data, function(d){return d.X}))  - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", x(d3.max(data, function(d){return d.X}))  - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
}

function drawSummaryScatter(){
	console.log("Drawing...")
	//scales

	margin = {
		top: 25,
		left: $(window).width() * .05,
		right: 25,
		bottom: 25
	};

	width = $(window).width() * .8  - margin.left - margin.right ;
	height = $(window).height() * .7 - margin.top - margin.bottom ;
	var y = d3.scale.linear().range([height, 0]);
	var x = d3.scale.linear().range([width, 0]);
		var color = d3.scale.ordinal()
  .domain(["Mid East", "Balkans", "Western Mediterranean",  ])
  .range(["#fbb4ae", "#b3cde3" , "#ccebc5"]);

	// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

	// Define the axes

var svg = d3.select("#summaryScatterHolder")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

   // Get the data
d3.csv("assets/final/all.csv", function(error, data) {
    data.forEach(function(d) {
        d.X = +d.X
        d.Y = +d.Y;
    });

    // Scale the range of the data
    x.domain([d3.max(data, function(d){return +d.X}), 0]);
    y.domain([0, d3.max(data, function(d){return +d.Y})]);


var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
      .enter().append("circle")
        .attr("r",10)
        .attr("cx", function(d) { return x(d.X); })
        .attr("cy", function(d) { return y(d.Y); })
        .style("fill", function(d) { return color(d.Region) })
        .on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div	.html(
            	"<b>" + d.Country + "</b><p>Month: " + d.Month + "</p><p>Mentions: " + d.Y + "</p><p>Arriving Refugees:" + d.X + "</p>"
            	)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", color(d.Region))
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0)});


     svg.append('line')
	     .attr('x1', x(0))
	     .attr('x2', x(200000))
	     .attr('y1', y(18.795))
	     .attr('y2', y(0.0001*200000 + 18.007))
	     .style('stroke', 'gray')
	     .style("stroke-width", 1)
	     .on("mouseover", function(d){
	     	div.transition()
	     		.duration(200)
	     		.style("opacity", 0.9)
	     	div.html("<b>Trendline</b><p>y=0.0001x + 18.007</p><p>R<sup>2</sup> = 0.04636</p>")
	     	.style("left", (d3.event.pageX) + "px")
	     	.style("top", (d3.event.pageY) + "px")
	     	.style("background", 'white')

	     })
	     .on("mouseout", function(d){
	     	div.transition(500)
	     	.style("opacity", 0)
	     })

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Newly Arrived Refugees");

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Mentions");


  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});
}
