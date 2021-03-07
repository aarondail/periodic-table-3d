import * as THREE from "three";

// eslint-disable-next-line import/no-webpack-loader-syntax
import ELEMENTS from "!!raw-loader!./elements.txt";
// eslint-disable-next-line import/no-webpack-loader-syntax
import TABLE from "!!raw-loader!./table.txt";

// There are 18 columns in the periodic table
const COLUMNS = 18;

export class PeriodicTable extends THREE.Object3D {
  private symbolToNameMap!: Map<string, string>;
  private symbolTable!: (string | null)[][];

  public constructor() {
    super();
    // console.log(ELEMENTS);
    // console.log(TABLE);

    // First load the elements and build a map of the symbol to the names...
    this.loadElements();
    // Then load the table
    this.loadTable();
  }

  private loadElements() {
    this.symbolToNameMap = new Map();
    let lineNumber = 1;
    ELEMENTS.split("\n").forEach((line) => {
      const parts = line.trim().split(/ +/);
      if (parts.length !== 3) {
        console.warn(`Skipping elements.txt line ${lineNumber}: "${line}".`);
      } else {
        this.symbolToNameMap.set(parts[1], parts[2]);
      }
      lineNumber++;
    });
    console.log(this.symbolToNameMap);
    // symbol to name map
  }

  private loadTable() {
    this.symbolTable = [];
    let lineNumber = 1;
    TABLE.split("\n").forEach((line) => {
      const row: (string | null)[] = [];
      this.symbolTable.push(row);
      const parts = line.trim().split(/,+/);
      if (parts.length !== COLUMNS) {
        console.warn(`Skipping table.txt line ${lineNumber} because it doesn't have 18 columns: "${line}".`);
      } else {
        parts.forEach((p) => {
          const s = p.trim();
          if (s) {
            row.push(s);
          } else {
            row.push(null);
          }
        });
      }
      lineNumber++;
    });
    console.log(this.symbolTable);
  }
}
