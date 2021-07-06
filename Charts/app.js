//Dollar to int conversion
function convert(currency){       
    var temp = currency.replace(/[^0-9.-]+/g,"");  
      return parseFloat(temp); 
    }

      
const parseNA = string => (string === 'NAN' ? undefined : string);

  //type convert
  function type(d) {
      return {
          Undergraduate_Major: parseNA(d.Undergraduate_Major),
          Starting_Median_Salary: convert(d.Starting_Median_Salary),
          Mid_Career_Median_Salary: convert(d.Mid_Career_Median_Salary),
          Percent_change_from_Starting_to_Mid_Career_Salary: d.Percent_change_from_Starting_to_Mid_Career_Salary,
          Mid_Career_10th_Percentile_Salary: convert(d.Mid_Career_10th_Percentile_Salary),
          Mid_Career_25th_Percentile_Salary: convert(d.Mid_Career_25th_Percentile_Salary),
          Mid_Career_75th_Percentile_Salary: convert(d.Mid_Career_75th_Percentile_Salary),
          Mid_Career_90th_Percentile_Salary: convert(d.Mid_Career_90th_Percentile_Salary)
      };
  } 

//filtering the data
function filterData(data) {
    return data.filter(d => {
        return (
            d.Starting_Median_Salary &&
            d.Mid_Career_Median_Salary &&
            d.Undergraduate_Major
        );
    });
}

//Prepareing the Data for the chart
function prepareScatterData(data) {
    return data.sort((a, b) => b.Starting_Median_Salary - a.Starting_Median_Salary).filter((d, i) => i < 100);
}

//Main function
function ready(salary) {

    //Data prep
    const salaryClean = filterData(salary);
    const scatterData = prepareScatterData(salaryClean);

    //Margins
    const margin ={top: 80, right: 40, bottom: 40, left: 60};
    const width = 700 - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

    //Scales

    const xExtent = d3
        .extent(scatterData, d => d.Starting_Median_Salary)
        .map((d, i) => (i === 0 ? d * 0.95 : d * 1.05));

    const xScale = d3
        .scaleLinear()
        .domain(xExtent)
        .range([0, width]);


    const yExtent = d3
        .extent(scatterData, d => d.Mid_Career_Median_Salary)
        .map((d, i) => (i === 0 ? d * 0.95 : d * 1.05));
    
    const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height, 0]);

    //Draw base
    const svg = d3
        .select('.scatter-plot-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //Draw Header

    const header = svg
        .append('g')
        .attr('class', 'plot-header')
        .attr('transform', `translate(0,${-margin.top * 0.6})`)
        .append('text');

    header.append('tspan').text('Starting Salary vs Mid Carrer Salary')

    //Label function
    function addLabel(axis, label, x) {
        axis
            .selectAll('.tick:last-of-type text')
            .clone()
            .text(label)
            .attr('x', x)
            .style('text-anchor', 'start')
            .style('font-weight', 'bold')
            .style('fill', '#555');
    }

   //Axes
    //xAxis
    const xAxis = d3
        .axisBottom(xScale)
        .ticks(5)
        .tickSizeInner(-height)
        .tickSizeOuter(0);

    const xAxisDraw = svg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)
        .call(addLabel, 'Starting Salary', 25);

   xAxisDraw.selectAll('text').attr('dy', '1.3em')

    //yAxis
    const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSizeInner(-width)
        .tickSizeOuter(0);

    const yAxisDraw = svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .call(addLabel, 'Mid Carrer Salary', 5);


    //scatter/plot
    svg
        .selectAll('.scatter')
        .data(scatterData)
        .enter()
        .append('circle')
        .attr('class', 'scatter')
        .attr('cx', d => xScale(d.Starting_Median_Salary))
        .attr('cy', d => yScale(d.Mid_Career_Median_Salary))
        .attr('r', 3)
        .style('fill', 'dodgerblue');

 
}


//load data
d3.csv('data/Pay_degree.csv', type).then(res => {
    ready(res);
});