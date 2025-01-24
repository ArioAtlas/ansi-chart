import { plot, PlotConfig } from 'asciichart';
import chalk from 'chalk';

export class LineChart {
  constructor(private readonly config: PlotConfig & { xLabel: string; yLabel: string }) {}

  public plot(data: number[][] | number[], color: string) {
    const xArray = Array.isArray(data[0]) ? data.map((v) => v[0]) : data.map((v, i) => i);
    const yArray = Array.isArray(data[0]) ? data.map((v) => v[1]) : data.map((v) => v);

    const chart = plot(yArray, this.config);
    // determine the overall width of the plot (in characters)
    const fullWidth = chart.split('\n')[0].length;
    // get the number of characters reserved for the y-axis legend
    const reservedYLegendWidth = chart.split('\n')[0].split(/┤|┼╮|┼/)[0].length + 2;

    // the difference between the two is the actual width of the x axis
    const widthXaxis = fullWidth - reservedYLegendWidth;
    // get the number of characters of the longest x-axis label
    const longestXLabel = xArray.map((l) => l.toString().length).sort((a, b) => b - a)[0];
    // get maximum amount of decimals in the labels
    const maxDecimals = xArray.map((l) => this.countDecimals(l)).sort((a, b) => b - a)[0];
    // considering a single whitespace left and right (for readibility), the formula for
    // determining the maximum amount of (readable) labels boils down to the following:
    const maxNoXLabels = Math.floor(widthXaxis / (longestXLabel + 2));
    const valueBetweenLabels = (xArray[xArray.length - 1] - xArray[0]) / (maxNoXLabels - 2);
    // add labels with fixed distance, however always include first and last position
    const factor = Math.pow(10, maxDecimals);
    const labels = [Math.round(xArray[0] * factor) / factor];
    for (let i = 0; i < maxNoXLabels - 2; ++i) {
      labels.push(Math.round((labels[labels.length - 1] + valueBetweenLabels) * factor) / factor);
    }

    const ticks = this.generateXAxisTicks(widthXaxis, reservedYLegendWidth, xArray, labels);
    const { xLabel, yLabel } = this.config;

    console.log(`\t(${yLabel})\n${chalk.hex(color)(chart)}\n${ticks} (${xLabel})\n`);
  }

  private generateXAxisTicks(xAxisWidth: number, yAxisWidth: number, xArray: number[], labels: number[]) {
    const tickPositions = labels.map((value) =>
      Math.round(((value - xArray[0]) / (xArray[xArray.length - 1] - xArray[0])) * xAxisWidth),
    );

    const tickString =
      [...new Array(yAxisWidth)].join(' ') +
      [...new Array(xAxisWidth)].map((v, i) => (tickPositions.indexOf(i) > -1 ? '┬' : '─')).join('');

    const tickLabelStartPosition = tickPositions.map((pos, i) => pos - Math.floor(labels[i].toString().length / 2));

    const reservedWhitespace = [...new Array(yAxisWidth - 1)]
      .map((v, i) => {
        if (i - yAxisWidth + 1 == tickLabelStartPosition[0]) return labels[0];
        else return ' ';
      })
      .join('');

    const startIndex = reservedWhitespace.length + 1 - yAxisWidth;

    const tickLabels = [];
    for (let i = startIndex; i < xAxisWidth; ++i) {
      if (tickLabelStartPosition.indexOf(i) > -1) {
        tickLabels.push(labels[tickLabelStartPosition.indexOf(i)]);
        i = startIndex + tickLabels.join('').length - 1;
      } else tickLabels.push(' ');
    }

    return `${tickString}\n${reservedWhitespace + tickLabels.join('')}`;
  }

  private countDecimals(value: number) {
    if (value % 1 != 0) return value.toString().split('.')[1].length;
    return 0;
  }
}
