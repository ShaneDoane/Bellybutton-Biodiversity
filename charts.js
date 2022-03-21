// create function to initialize the dashboard
function init() {

    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  // Initialize the dashboard
  init();
  
  // create a function for data when options selected
  function optionChanged(newSample) {

    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);
  }
  
  // Demographics Panel 
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;

      // Filter the data for the object with the desired sample number
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      // Use d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
  
      // Use `.html("") to clear any existing metadata
      PANEL.html("");
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  
  // DELIVERABLE 1

  // 1. Create the buildCharts function.
  function buildCharts(sample) {

    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {

      // 3. Create a variable that holds the samples array. 
      var samplesArray = data.samples;
      
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var samplesById = samplesArray.filter(newId => newId.id === sample);
      
      //  5. Create a variable that holds the first sample in the array.
      var firstSample = samplesById[0];

      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = firstSample.otu_ids;
      var otuLabels = firstSample.otu_labels;
      var sampleValues = firstSample.sample_values;
  
      // 7. create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
  
      var yticks = otuIds.map(oId => "OTU " + oId + " ").slice(0, 10).reverse();
  
      // 8. Create the trace for the bar chart. 
      var barData = [{
        type: 'bar',
        orientation: 'h',
        text: otuLabels,
        y: yticks,
        x: sampleValues.slice(0,10).reverse(), 
        marker: {
          color: "DarkGreen",
          width: 10
        } 
      }];

      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: {
          text: "Top 10 Bacteria Cultures Found",
          font: {
            family: 'Helvetica',
            size: 24,
            color: "black",
          },
        }, 
      };

      // 10.  use the Plotly.newPlot() function to plot the trace object with the layout. 
      Plotly.newPlot("bar", barData, barLayout);
  
  // DELIVERABLE 2

        // 1. Create the trace for the bubble chart.      
      var bubbleData = [{
        type: 'bubble',
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Greens",
        }
      }];
  
      // 2. Create the layout for the bubble chart.

      var bubbleLayout = {
        title: {
          text: 'Bacteria Cultures Per Sample',
          font: {
            family: 'Helvetica',
            size: 24,
            color: "black",
          },
        },
        xaxis: {
          title: "OTU Id's",
          showgrid: false,
          showline: true
        },
        yaxis: {
          title: "Quantity Found",
        },
        hovermode: "closest",
        height: 450,
        showlegend: false,
      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
  // DELIVERABLE 3

      // 3. Create a variable that holds the washing frequency.
      
      var freq = data.metadata.filter(guage => guage.id == sample)[0].wfreq;

      // 4. Create the trace for the gauge chart.
      var gaugeData = [{
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          // 10 wfreq, group of 2
          axis: {range: [0,10], dtick: 2},
          bordercolor: "black",
          borderwidth: 2,
          steps: [
            {range:[0,2], color: "darkgreen"},
            {range:[2,4], color: "darkolivegreen"},
            {range:[4,6], color: "olivedrab"},
            {range:[6,8], color: "yellowgreen"},
            {range:[8,10], color: "palegreen"},
          ],        
          bar: {color: "black"},
        },
        value: freq
      }];
      
      // 5. Create the layout for the gauge chart.
      // added title here for consistency in appearance along with bar chart
      var gaugeLayout = { 
        title: {
          text: "Weekly Washing Frequency"},
          font: {
            family: 'Helvetica',
            size: 20,
            color: "black"
          },
        width: 450,
        height: 450,
      };
  
      Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
  
  }