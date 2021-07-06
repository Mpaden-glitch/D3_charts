
const expenses = d3.csv('data/testing_set.csv')
console.log(expenses)

const expensesByName = d3.nest()
    .key(function(d) { return d.name; })
    .entries(expenses)