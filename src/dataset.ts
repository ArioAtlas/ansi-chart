type Cell = number;

export class Dataset {
  private values: Array<Array<Cell>>;
  constructor(values?: Array<Array<Cell>>) {
    if (!values) this.values = [];
    else this.values = values;
  }

  public rows(indices: number[]): Dataset {
    return new Dataset(this.values.filter((r, i) => indices.includes(i)));
  }

  public columns(indices: number[]): Dataset {
    return new Dataset(this.values.map((v) => v.filter((v, i) => indices.includes(i))));
  }

  public row(index: number): Array<Cell> {
    return this.values[index];
  }

  public column(index: number): Array<Cell> {
    return this.values.map((v) => v[index]);
  }

  public get(row: number, column: number): Cell {
    return this.values[row][column];
  }

  public set(row: number, column: number, value: Cell): void {
    this.values[row][column] = value;
  }

  public append(value: Array<Cell>): Dataset {
    this.values.push(value);
    return this;
  }

  public toArray() {
    return this.values;
  }

  public get size() {
    return {
      rows: this.values.length,
      columns: this.values[0]?.length ?? 0,
    };
  }

  public sum(column: number): number {
    return this.column(column).reduce((acc, cur) => acc + cur);
  }

  public mean(column: number): number {
    return this._mean(this.column(column));
  }

  public median(column: number): number {
    const col = this.column(column);
    col.sort(function (a, b) {
      return a - b;
    });
    const mid = col.length / 2;
    return mid % 1 ? col[mid - 0.5] : (col[mid - 1] + col[mid]) / 2;
  }

  public variance(column: number): number {
    const col = this.column(column);
    const mean = this._mean(col);
    return this._mean(
      col.map(function (num) {
        return Math.pow(num - mean, 2);
      }),
    );
  }

  public standardDeviation(column: number): number {
    return Math.sqrt(this.variance(column));
  }

  private _mean(array: number[]) {
    return array.reduce((acc, cur) => acc + cur) / array.length;
  }
}
