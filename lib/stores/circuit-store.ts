import { create } from "zustand";
import { Circuit, Component, Wire, SignalState, GateType, BusGroup } from "@/lib/sim-engine/types";
import { propagate } from "@/lib/sim-engine/propagator";
import { nanoid } from "nanoid";

export type Tool = "select" | "wire" | "delete" | "place";

export interface WireInProgress {
  fromComponentId: string;
  fromPinIndex: number;
}

interface CircuitCommand {
  type: string;
  undo: () => void;
  redo: () => void;
}

interface CircuitState {
  circuit: Circuit;
  signalState: SignalState;
  selectedIds: string[];
  selectedTool: Tool;
  placingType: GateType | null;
  wireInProgress: WireInProgress | null;
  undoStack: CircuitCommand[];
  redoStack: CircuitCommand[];
  busGroups: BusGroup[];

  // Actions
  setCircuit: (circuit: Circuit) => void;
  addComponent: (comp: Omit<Component, "id">) => string;
  removeComponent: (id: string) => void;
  moveComponent: (id: string, x: number, y: number) => void;
  addWire: (wire: Omit<Wire, "id">) => string;
  removeWire: (id: string) => void;
  toggleInput: (id: string) => void;
  setSelectedIds: (ids: string[]) => void;
  setSelectedTool: (tool: Tool) => void;
  setPlacingType: (type: GateType | null) => void;
  setWireInProgress: (w: WireInProgress | null) => void;
  updateSignals: () => void;
  undo: () => void;
  redo: () => void;
  clearCircuit: () => void;
  addBusGroup: (group: BusGroup) => void;
  removeBusGroup: (id: string) => void;
  setBusValue: (busId: string, binaryString: string) => void;
}

function emptyCircuit(): Circuit {
  return {
    id: nanoid(),
    name: "Untitled Circuit",
    components: [],
    wires: [],
  };
}

export const useCircuitStore = create<CircuitState>((set, get) => ({
  circuit: emptyCircuit(),
  signalState: {},
  selectedIds: [],
  selectedTool: "select",
  placingType: null,
  wireInProgress: null,
  undoStack: [],
  redoStack: [],
  busGroups: [],

  setCircuit: (circuit) => {
    set({ circuit, undoStack: [], redoStack: [] });
    get().updateSignals();
  },

  addComponent: (comp) => {
    const id = nanoid();
    const newComp: Component = { ...comp, id };
    const prevComponents = [...get().circuit.components];

    const command: CircuitCommand = {
      type: "addComponent",
      redo: () => {
        set((s) => ({
          circuit: { ...s.circuit, components: [...s.circuit.components, newComp] },
        }));
        get().updateSignals();
      },
      undo: () => {
        set((s) => ({
          circuit: { ...s.circuit, components: prevComponents },
        }));
        get().updateSignals();
      },
    };

    command.redo();
    set((s) => ({ undoStack: [...s.undoStack, command], redoStack: [] }));
    return id;
  },

  removeComponent: (id) => {
    const prevCircuit = get().circuit;
    const command: CircuitCommand = {
      type: "removeComponent",
      redo: () => {
        set((s) => ({
          circuit: {
            ...s.circuit,
            components: s.circuit.components.filter((c) => c.id !== id),
            wires: s.circuit.wires.filter(
              (w) => w.from.componentId !== id && w.to.componentId !== id
            ),
          },
        }));
        get().updateSignals();
      },
      undo: () => {
        set({ circuit: prevCircuit });
        get().updateSignals();
      },
    };
    command.redo();
    set((s) => ({ undoStack: [...s.undoStack, command], redoStack: [] }));
  },

  moveComponent: (id, x, y) => {
    const prevComponents = [...get().circuit.components];
    set((s) => ({
      circuit: {
        ...s.circuit,
        components: s.circuit.components.map((c) =>
          c.id === id ? { ...c, x, y } : c
        ),
      },
    }));
    get().updateSignals();

    // Record move for undo
    const newComponents = get().circuit.components;
    const command: CircuitCommand = {
      type: "move",
      redo: () => {
        set((s) => ({ circuit: { ...s.circuit, components: newComponents } }));
        get().updateSignals();
      },
      undo: () => {
        set((s) => ({ circuit: { ...s.circuit, components: prevComponents } }));
        get().updateSignals();
      },
    };
    set((s) => ({ undoStack: [...s.undoStack, command], redoStack: [] }));
  },

  addWire: (wire) => {
    const id = nanoid();
    const newWire: Wire = { ...wire, id };
    const prevWires = [...get().circuit.wires];

    const command: CircuitCommand = {
      type: "addWire",
      redo: () => {
        set((s) => ({
          circuit: { ...s.circuit, wires: [...s.circuit.wires, newWire] },
        }));
        get().updateSignals();
      },
      undo: () => {
        set((s) => ({ circuit: { ...s.circuit, wires: prevWires } }));
        get().updateSignals();
      },
    };
    command.redo();
    set((s) => ({ undoStack: [...s.undoStack, command], redoStack: [] }));
    return id;
  },

  removeWire: (id) => {
    const prevWires = [...get().circuit.wires];
    const command: CircuitCommand = {
      type: "removeWire",
      redo: () => {
        set((s) => ({
          circuit: { ...s.circuit, wires: s.circuit.wires.filter((w) => w.id !== id) },
        }));
        get().updateSignals();
      },
      undo: () => {
        set((s) => ({ circuit: { ...s.circuit, wires: prevWires } }));
        get().updateSignals();
      },
    };
    command.redo();
    set((s) => ({ undoStack: [...s.undoStack, command], redoStack: [] }));
  },

  toggleInput: (id) => {
    set((s) => ({
      circuit: {
        ...s.circuit,
        components: s.circuit.components.map((c) =>
          c.id === id && c.type === "INPUT" ? { ...c, value: !c.value } : c
        ),
      },
    }));
    get().updateSignals();
  },

  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setPlacingType: (type) => set({ placingType: type }),
  setWireInProgress: (w) => set({ wireInProgress: w }),

  updateSignals: () => {
    const state = propagate(get().circuit);
    set({ signalState: state });
  },

  undo: () => {
    const stack = get().undoStack;
    if (stack.length === 0) return;
    const command = stack[stack.length - 1];
    command.undo();
    set((s) => ({
      undoStack: s.undoStack.slice(0, -1),
      redoStack: [...s.redoStack, command],
    }));
  },

  redo: () => {
    const stack = get().redoStack;
    if (stack.length === 0) return;
    const command = stack[stack.length - 1];
    command.redo();
    set((s) => ({
      redoStack: s.redoStack.slice(0, -1),
      undoStack: [...s.undoStack, command],
    }));
  },

  clearCircuit: () => {
    set({ circuit: emptyCircuit(), signalState: {}, undoStack: [], redoStack: [], busGroups: [] });
  },

  addBusGroup: (group) => {
    set((s) => ({ busGroups: [...s.busGroups, group] }));
  },

  removeBusGroup: (id) => {
    set((s) => ({ busGroups: s.busGroups.filter((bg) => bg.id !== id) }));
  },

  setBusValue: (busId, binaryString) => {
    const state = get();
    const bus = state.busGroups.find((bg) => bg.id === busId);
    if (!bus) return;
    // Pad or trim binaryString to match bitWidth
    const padded = binaryString.padStart(bus.bitWidth, "0").slice(-bus.bitWidth);
    // Set each INPUT component in the bus to match the binary string (MSB-first)
    const updatedComponents = state.circuit.components.map((c) => {
      const idx = bus.componentIds.indexOf(c.id);
      if (idx === -1 || c.type !== "INPUT") return c;
      return { ...c, value: padded[idx] === "1" };
    });
    set((s) => ({
      circuit: { ...s.circuit, components: updatedComponents },
    }));
    get().updateSignals();
  },
}));
