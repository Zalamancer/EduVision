"use client";

import { Component } from "@/lib/sim-engine/types";
import GateBase from "./GateBase";
import {
  ANDShape,
  ORShape,
  NOTShape,
  NANDShape,
  NORShape,
  XORShape,
  XNORShape,
  InputSwitchShape,
  OutputLEDShape,
} from "./GateShapes";

interface GateComponentProps {
  component: Component;
  selected: boolean;
  signalOutputs: boolean[];
  onSelect: (id: string, e: React.MouseEvent) => void;
  onInputPinClick: (compId: string, pinIndex: number) => void;
  onOutputPinClick: (compId: string, pinIndex: number) => void;
  onToggleInput?: (id: string) => void;
}

export default function GateComponent({
  component,
  selected,
  signalOutputs,
  onSelect,
  onInputPinClick,
  onOutputPinClick,
  onToggleInput,
}: GateComponentProps) {
  const isHigh = signalOutputs[0] ?? false;

  const handleClick = (id: string, e: React.MouseEvent) => {
    if (component.type === "INPUT" && onToggleInput) {
      onToggleInput(id);
    } else {
      onSelect(id, e);
    }
  };

  const shape = (() => {
    switch (component.type) {
      case "AND":   return <ANDShape isHigh={isHigh} />;
      case "OR":    return <ORShape isHigh={isHigh} />;
      case "NOT":   return <NOTShape isHigh={isHigh} />;
      case "NAND":  return <NANDShape isHigh={isHigh} />;
      case "NOR":   return <NORShape isHigh={isHigh} />;
      case "XOR":   return <XORShape isHigh={isHigh} />;
      case "XNOR":  return <XNORShape isHigh={isHigh} />;
      case "INPUT": return <InputSwitchShape value={component.value} />;
      case "OUTPUT":
        // Find output signal from incoming wire — handled by parent via signalOutputs hack
        return <OutputLEDShape value={component.value} />;
      default:      return <ANDShape isHigh={isHigh} />;
    }
  })();

  return (
    <GateBase
      id={component.id}
      type={component.type}
      x={component.x}
      y={component.y}
      label={component.label}
      selected={selected}
      signalOutputs={signalOutputs}
      onSelect={handleClick}
      onInputPinClick={onInputPinClick}
      onOutputPinClick={onOutputPinClick}
    >
      {shape}
    </GateBase>
  );
}
