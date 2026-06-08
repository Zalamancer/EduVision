export type GateType =
  // Basic gates (existing)
  | "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR" | "BUFFER"
  | "INPUT" | "OUTPUT"
  // Compound (existing)
  | "MUX_2TO1" | "FULL_ADDER" | "DECODER_2TO4"
  // Gates - new
  | "CONTROLLED_BUFFER" | "CONTROLLED_INVERTER"
  // Plexers - new
  | "MUX_4TO1" | "MUX_8TO1" | "DEMUX_1TO4" | "PRIORITY_ENCODER" | "BIT_SELECTOR"
  // Arithmetic - new
  | "SUBTRACTOR" | "MULTIPLIER" | "DIVIDER" | "NEGATOR" | "COMPARATOR" | "SHIFTER" | "BIT_ADDER"
  // Memory - new
  | "D_FLIP_FLOP" | "T_FLIP_FLOP" | "JK_FLIP_FLOP" | "SR_FLIP_FLOP"
  | "REGISTER" | "COUNTER" | "SHIFT_REGISTER"
  // Wiring - new
  | "CLOCK" | "CONSTANT" | "SPLITTER" | "PROBE" | "TUNNEL" | "POWER" | "GROUND"
  // I/O - new
  | "SEVEN_SEGMENT" | "HEX_DISPLAY" | "LED_MATRIX" | "BUTTON";

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

export interface PropagationLevel {
  depth: number;
  evaluatedIds: string[];
  activeWireIds: string[];
  signalState: SignalState;
}

export interface PropagationTrace {
  levels: PropagationLevel[];
  totalSteps: number;
}

export interface BusGroup {
  id: string;
  label: string;          // e.g. "A" or "F"
  bitWidth: number;       // e.g. 3
  componentIds: string[]; // ordered MSB-first: ["a2", "a1", "a0"]
}
