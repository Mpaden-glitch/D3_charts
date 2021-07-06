
function filterData(data) {
    return data.filter(d => {
        return (
            d.Starting_Median_Salary &&
            d.Undergraduate_Major
        );
    });
}


function prepareBarChartData(data) {
    const dataMap= d3.rollup(
        data,
        v => d3.sum(v, leaf => leaf.Starting_Median_Salary),
        d => d.Undergraduate_Major
    );
    const dataArray = Array.from(dataMap, d => ({ Undergraduate_Major: d[0], Starting_Median_Salary: d[1] }));

    return dataArray;
}


function ready(salary) {
    const salaryClean = filterData(salary);
    const barChartData = prepareBarChartData(salaryClean).sort((a, b) => 
        d3.descending(a.Starting_Median_Salary - b.Starting_Median_Salary)
    );

    //Margins
    const margin ={top: 80, right: 40, bottom: 40, left: 200};
    const width = 700 - margin.left - margin.right;
    const height = 800 - margin.top - margin.bottom;

    //Scales
    const xMax = d3.max( barChartData, d => d.Starting_Median_Salary);

    const xScale = d3
        .scaleLinear([0, xMax], [0, width]);
    
    const yScale = d3
        .scaleBand()
        .domain(barChartData.map(d => d.Undergraduate_Major))
        .rangeRound([0, height])
        .paddingInner(0.30);

    //Draw base
    const svg = d3
        .select('.bar-chart-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    //Draw Header
    const header = svg
        .append('g')
        .attr('class','bar-header')
        .attr('transform', `translate(0, ${-margin.top / 2})`)
        .append('text');

    header
        .append('tspan')
        .text('Total Starting Salary Based on Degree');

    //Bars
    const bars = svg
        .selectAll('.bar')
        .data(barChartData)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('y', d => yScale(d.Undergraduate_Major))
        .attr('width', d => xScale(d.Starting_Median_Salary))
        .attr('height', yScale.bandwidth())
        .style('fill', 'dodgerblue');

    //Axes
    const xAxis =d3
        .axisTop(xScale)
        .tickFormat(d3.format('~s'))
        .tickSizeInner(-height)
        .tickSizeOuter(0);

    const xAxisDraw = svg 
        .append('g')
        .attr('class', 'x axis')
        .call(xAxis);

    const yAxis = d3
        .axisLeft(yScale)
        .tickSize(0);

    const yAxisDraw = svg
        .append('g')
        .attr('class', 'y axis')
        .call(yAxis);
    
    yAxisDraw
        .selectAll('text')
        .attr('dx', '-0.6em')
}

function convert(currency){       
  var temp = currency.replace(/[^0-9.-]+/g,"");  
    return parseFloat(temp); 
    }

const parseNA = string => (string === 'NAN' ? undefined : string);
const parseDate = string => d3.timeParse('%Y-%m-%d')(string);

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

//load data
d3.csv('data/Pay_degree.csv', type).then(res => {
    ready(res);
});