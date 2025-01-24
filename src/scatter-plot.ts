import { Dataset } from './dataset';
import ervy from 'ervy';

export class ScatterPlot {
  private chart = ervy;
  private colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

  constructor(private readonly options?: { pointChar?: string }) {}

  public plot(dataset: Dataset, colors?: Array<number>) {
    console.log(
      this.chart.scatter(
        this.normalize(dataset).map((v, i) => ({
          key: colors && colors[i] !== undefined ? `C${Math.floor(colors[i])}` : 'point',
          value: v,
          style: this.chart.fg(
            this.colors[
              colors && colors[i] !== undefined ? colors[i] % (this.colors.length - 1) : this.colors.length - 1
            ],
            this.options?.pointChar || '●',
          ),
        })),
        { width: 25, height: 25, legendGap: 12 },
      ),
    );
  }

  private normalize(dataset: Dataset) {
    const X = dataset.column(0);
    const Y = dataset.column(1);
    const mx = Math.max(...X);
    const my = Math.max(...Y);
    const nx = Math.min(...X);
    const ny = Math.min(...Y);

    return dataset
      .toArray()
      .map((v) => [Math.round(((v[0] - nx) / (mx - nx)) * 25), Math.round(((v[1] - ny) / (my - ny)) * 25)]);
  }
}
