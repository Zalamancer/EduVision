export type GateType =
  | "AND"
  | "OR"
  | "NOT"
  | "NAND"
  | "NOR"
  | "XOR"
  | "XNOR"
  | "INPUT"
  | "OUTPUT"
  | "BUFFER";

export interface PinRef {
  componentId: string;
  pinIndex: number; // 0-based
}

export interface Component {
  id: string;
  type: GateType;
  x: number;
  y: number;
  rotation: number; // degrees: 0, 90, 180, 270
  label: string;
  /** For INPUT components, stores the current switch state */
  value?: boolean;
}

export interface Wire {
  id: string;
  from: PinRef; // output pin of source component
  to: PinRef;   // input pin of destination component
}

export interface Circuit {
  id: string;
  name: string;
  components: Component[];
  wires: Wire[];
}

/** Maps componentId -> output values (array, one per output pin) */
export type SignalState = Record<string, boolean[]>;

export interface TruthTableRow {
  inputs: Record<string, boolean>; // label -> value
  outputs: Record<string, boolean>; // label -> value
}

export interface TruthTable {
  inputLabels: string[];
  outputLabels: string[];
  rows: TruthTableRow[];
}
