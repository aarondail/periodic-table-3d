import * as THREE from "three";

// eslint-disable-next-line import/no-webpack-loader-syntax
import ELEMENTS from "!!raw-loader!./elements.txt";
// eslint-disable-next-line import/no-webpack-loader-syntax
import TABLE from "!!raw-loader!./table.txt";
import { ElementBlock } from "./ElementBlock";

// There are 18 columns in the periodic table
const COLUMNS = 18;

interface Element {
  atomicNumber: number;
  atomicNumberRaw: string;
  symbol: string;
  label: string;
}

export class PeriodicTable extends THREE.Object3D {
  private symbolToInfoMap!: Map<string, Element>;
  private symbolTable!: (string | null)[][];

  public constructor() {
    super();
    // First load the elements and build a map of the symbol to the names...
    this.loadElements();
    // Then load the table
    this.loadTable();

    for (let rowIndex = 0; rowIndex < this.symbolTable.length; rowIndex++) {
      const row = this.symbolTable[rowIndex];
      for (let column = 0; column < row.length; column++) {
        const symbol = row[column];
        if (!symbol) {
          continue;
        }
        const info = this.symbolToInfoMap.get(symbol);
        if (!info) {
          console.warn(`Could not find info for symbol (from table) "${symbol}".`);
          continue;
        }

        const mesh = new ElementBlock({
          name: info.label,
          symbol,
          atomicNumber: info.atomicNumberRaw,
        });
        mesh.position.set((column - 9) * 3.2, -1 * rowIndex * (this.symbolTable.length * 0.75), 0);
        this.add(mesh);
      }
    }
  }

  private loadElements() {
    this.symbolToInfoMap = new Map();
    let lineNumber = 1;
    ELEMENTS.split("\n").forEach((line) => {
      const parts = line.trim().split(/ +/);
      if (parts.length < 3) {
        console.warn(`Skipping elements.txt line ${lineNumber}: "${line}".`);
      } else {
        const element: Element = {
          atomicNumber: parseInt(parts[0], 0),
          atomicNumberRaw: parts[0],
          symbol: parts[1],
          label: parts.slice(2).join(" "),
        };
        this.symbolToInfoMap.set(element.symbol, element);
      }
      lineNumber++;
    });
    console.log(this.symbolToInfoMap);
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
