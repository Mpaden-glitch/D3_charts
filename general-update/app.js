
//click handler
function click() {
    const dataset = friends[this.dataset.name];
    update(dataset);
}

//The general update pattern
function update(data) {
    svg
        .selectAll('text')
        .data(data, d => d)
        .join(
            enter => {
                enter
                    .append('text')
                    .text(d => d)
                    .attr('x', -100)
                    .attr('y', (d, i) => i * 30 + 50)
                    .style('fill', 'dodgerblue')
                    .transition()
                    .attr('x', 30)
            },
                    

            update => {
                update
                .transition()
                    .style('fill', 'gray')
                    .attr('y', (d, i) => i *30 + 50)
            },
            exit => {
                exit
                    .transition()
                    .attr('x', 150)
                    .style('fill', 'tomato')
                    .remove()
            }
        )

}

//data
const friends = {
    biff: ['Apples', 'Oranges', 'Lemons'],
    chip: ['Apples', 'Oranges'],
    kipper: ['Apples', 'Cherries', 'Peaches', 'Oranges'],
};

//set up
const svg = d3
    .select('svg');

//List to clicks
d3  
    .selectAll('button')
    .on('click', click);