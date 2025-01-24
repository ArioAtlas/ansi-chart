import { Dataset } from './dataset';
import { ScatterPlot } from './scatter-plot';

export * from './dataset';
export * from './line-chart';
export * from './scatter-plot';

const scatterPlot = new ScatterPlot();
const dataset = new Dataset([
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
]);

scatterPlot.plot(dataset, [1, 1, 2, 1, 1, 2]);
