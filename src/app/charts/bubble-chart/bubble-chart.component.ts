import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BubbleChartModel } from './models';
import * as d3 from "d3";

@Component({
  selector: 'bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit, OnChanges {

  @Input()
  data: BubbleChartModel[] = [];

  private width = 300;
  private height = 300;

  constructor() { }

  ngOnInit() {
   
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes.data && changes.data.currentValue.length>0){
      this.createChart('#bubbleChart');
    }
  }

  pack = data => d3.pack()
    .size([this.width - 2, this.height - 2])
    .padding(2)
    (d3.hierarchy({ children: data })
      .sum(d => d.value+10));

  format = d3.format(",d")

  color = d3.scaleOrdinal(this.data.map(d => d.group), d3.schemeCategory10);

  createChart(divID: string) {

    const root = this.pack(this.data);

    const svg = d3.select(divID).append("svg")
      .attr("viewBox", [0, 0, this.width, this.height])
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");



    const leaf = svg.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

    leaf.append("circle")
      .attr("id", d => d)
      .attr("r", d => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", d => this.color(d.data.group));

    leaf.append("clipPath")
      .attr("id", d => (d = d))
      .append("use")
      .attr("xlink:href", d => d);

    leaf.append("text")
    .text(function(d) { return d.data.name; })
    .style("font-size", function(d) { 
      return (2 * d.r ) / this.getComputedTextLength()*8 + "px"; })
      .attr("dy", ".35em")
      .attr("clip-path", d => d.clipUid);

    leaf.append("title")
      .text(d => {return "Wins: "+(d.value-10).toString()});
  }


}
