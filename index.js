const D3Node = require('d3-node');

const RANKS = [{
  start: 10,
  end: 400,
  color: 'gray'
},
{
  start: 400,
  end: 800,
  color: 'maroon'
},
{
  start: 800,
  end: 1200,
  color: 'green'
},
{
  start: 1200,
  end: 1600,
  color: 'aqua'
},
{
  start: 1600,
  end: 2000,
  color: 'blue'
},
{
  start: 2000,
  end: 2400,
  color: 'yellow'
},
{
  start: 2400,
  end: 2800,
  color: 'orange'
},
{
  start: 2800,
  end: 5000,
  color: 'red'
},
]

function atCoderGraph({
  data,
  selector: _selector = '#chart',
  container: _container = `
    <div id="container">
      <h2>AtCoder Graph</h2>
      <div id="chart"></div>
    </div>
  `,
  style: _style = '',
  width: _width = 960,
  height: _height = 500,
  margin: _margin = {
    top: 20,
    right: 20,
    bottom: 60,
    left: 50
  },
  lineWidth: _lineWidth = 2,
  lineColor: _lineColor = 'black',
  lineColors: _lineColors = ['black'],
  isCurve: _isCurve = false,
  tickSize: _tickSize = 5,
  tickPadding: _tickPadding = 5,
  yTickValues: _yTickValues = null,
} = {}) {
  const d3n = new D3Node({
    selector: _selector,
    svgStyles: _style,
    container: _container,
  });

  const d3 = d3n.d3;

  const width = _width - _margin.left - _margin.right;
  const height = _height - _margin.top - _margin.bottom;

  const svg = d3n.createSVG(_width, _height)
    .append('g')
    .attr('transform', `translate(${_margin.left}, ${_margin.top})`);

  const g = svg.append('g');

  const {
    allKeys
  } = data;
  const xScale = d3.scaleTime()
    .domain(allKeys ? d3.extent(allKeys) : d3.extent(data, d => d.key))
    .rangeRound([0, width]);
  const yScale = d3.scaleLinear()
    .domain(allKeys ? [d3.min(data, d => d3.min(d, v => v.value)), d3.max(data, d => d3.max(d, v => v.value))] : d3.extent(data, d => d.value))
    .rangeRound([height, 0]);
  const xAxis = d3.axisBottom(xScale)
    .tickSize(_tickSize)
    .tickPadding(_tickPadding)
    .tickFormat(d3.timeFormat("%Y-%-m-%e"));
  const yAxis = d3.axisLeft(yScale)
    .tickSize(_tickSize)
    .tickValues(null)
    .tickPadding(_tickPadding);

  const lineChart = d3.line()
    .x(d => xScale(d.key))
    .y(d => yScale(d.value));

  if (_isCurve) lineChart.curve(d3.curveBasis);

  g.append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis);

  g.append('g').call(yAxis);

  g.append('g')
    .attr('fill', 'none')
    .attr('stroke-width', _lineWidth)
    .selectAll('path')
    .data(allKeys ? data : [data])
    .enter().append("path")
    .attr('stroke', (d, i) => i < _lineColors.length ? _lineColors[i] : _lineColor)
    .attr('d', lineChart)

  RANKS.map(({
    start,
    end,
    color
  }) => {
    const border = d3.area()
      .x(d => xScale(d.key))
      .y0(d => yScale(start))
      .y1(d => yScale(end));

    g.append('g')
      .selectAll('path')
      .data(allKeys ? data : [data])
      .enter().append("path")
      .attr('d', border)
      .attr("fill", color)
      .attr("fill-opacity", '0.3')
  })

  return d3n;
}

module.exports = atCoderGraph;
