import { Component, OnInit, OnChanges, SimpleChanges, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { NameValue } from 'src/app/models/NameValue.model';

const height = 500;
const width = 500;

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit, OnChanges, AfterViewInit {

  constructor() { }

  @Input()
  data: NameValue[] = [];

  @Input()
  id = 'default';

  private svg;

  pie = d3.pie()
    .padAngle(0.02)
    .sort(null)
    .value(d => d.value);

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.data) {
      const domID = `#donutChart${this.id}`;
      d3.select(domID).selectAll('*').remove();
      this.draw(domID, this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && changes.data.currentValue?.length > 0) {
      const domID = `#donutChart${this.id}`;
      d3.select(domID).selectAll('*').remove();
      this.draw(domID, this.data);

    }
  }


  arc() {
    const radius = Math.min(width, height) / 2;
    return d3.arc().innerRadius(radius * 0.57).outerRadius(radius - 1);
  }



  draw(domID, data) {
    const arcs = this.pie(data);

    const color = d3.scaleOrdinal()
    .domain(this.data.map(d => d.name))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), this.data.length).reverse());

    this.svg = d3.select(domID).append('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

    this.svg.selectAll('path')
      .data(arcs)
      .join('path')
        .attr('fill', d => color(d.data.name))
        .attr('d', this.arc())
      .append('title')
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    this.svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 25)
        .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .join('text')
        .attr('transform', d => `translate(${this.arc().centroid(d)})`)
        .call(text => text.append('tspan')
            .attr('y', '-0.4em')
            .attr('font-weight', 'bold')
            .text(d => d.data.name))
        .call(text => text.append('tspan')
            .attr('x', 0)
            .attr('y', '0.7em')
            .attr('fill-opacity', 0.7)
            .text(d => d.data.value));

    return  this.svg.node();
  }

}
