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
import {
  MUX2TO1Shape,
  FullAdderShape,
  Decoder2to4Shape,
  MUX4TO1Shape,
  MUX8TO1Shape,
  DEMUX1TO4Shape,
  PriorityEncoderShape,
  BitSelectorShape,
  SubtractorShape,
  MultiplierShape,
  DividerShape,
  NegatorShape,
  ComparatorShape,
  ShifterShape,
  BitAdderShape,
} from "./CompoundShapes";
import {
  DFlipFlopShape,
  TFlipFlopShape,
  JKFlipFlopShape,
  SRFlipFlopShape,
  RegisterShape,
  CounterShape,
  ShiftRegisterShape,
} from "./MemoryShapes";
import {
  ClockShape,
  ConstantShape,
  PowerShape,
  GroundShape,
  ProbeShape,
  TunnelShape,
  SplitterShape,
} from "./WiringShapes";
import {
  ButtonShape,
  SevenSegmentShape,
  HexDisplayShape,
  LEDMatrixShape,
} from "./IOShapes";

interface GateComponentProps {
  component: Component;
  selected: boolean;
  signalOutputs: boolean[];
  inputSignals?: boolean[];
  onSelect: (id: string, e: React.MouseEvent) => void;
  onInputPinClick: (compId: string, pinIndex: number) => void;
  onOutputPinClick: (compId: string, pinIndex: number) => void;
  onPinDragStart?: (compId: string, e: React.MouseEvent) => void;
  onInputPinDragStart?: (compId: string, pinIndex: number) => void;
  onInputPinMouseUp?: (compId: string, pinIndex: number) => void;
  onToggleInput?: (id: string) => void;
  highlighted?: boolean;
  dimmed?: boolean;
}

export default function GateComponent({
  component,
  selected,
  signalOutputs,
  inputSignals,
  onSelect,
  onInputPinClick,
  onOutputPinClick,
  onPinDragStart,
  onInputPinDragStart,
  onInputPinMouseUp,
  onToggleInput,
  highlighted,
  dimmed,
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
      case "MUX_2TO1":          return <MUX2TO1Shape isHigh={isHigh} />;
      case "MUX_4TO1":          return <MUX4TO1Shape isHigh={isHigh} />;
      case "MUX_8TO1":          return <MUX8TO1Shape isHigh={isHigh} />;
      case "DEMUX_1TO4":        return <DEMUX1TO4Shape isHigh={isHigh} />;
      case "PRIORITY_ENCODER":  return <PriorityEncoderShape isHigh={isHigh} />;
      case "BIT_SELECTOR":      return <BitSelectorShape isHigh={isHigh} />;
      case "FULL_ADDER":        return <FullAdderShape isHigh={isHigh} />;
      case "SUBTRACTOR":        return <SubtractorShape isHigh={isHigh} />;
      case "MULTIPLIER":        return <MultiplierShape isHigh={isHigh} />;
      case "DIVIDER":           return <DividerShape isHigh={isHigh} />;
      case "NEGATOR":           return <NegatorShape isHigh={isHigh} />;
      case "COMPARATOR":        return <ComparatorShape isHigh={isHigh} />;
      case "SHIFTER":           return <ShifterShape isHigh={isHigh} />;
      case "BIT_ADDER":         return <BitAdderShape isHigh={isHigh} />;
      case "DECODER_2TO4":      return <Decoder2to4Shape isHigh={isHigh} />;
      // Memory
      case "D_FLIP_FLOP":       return <DFlipFlopShape isHigh={isHigh} />;
      case "T_FLIP_FLOP":       return <TFlipFlopShape isHigh={isHigh} />;
      case "JK_FLIP_FLOP":      return <JKFlipFlopShape isHigh={isHigh} />;
      case "SR_FLIP_FLOP":      return <SRFlipFlopShape isHigh={isHigh} />;
      case "REGISTER":          return <RegisterShape isHigh={isHigh} />;
      case "COUNTER":           return <CounterShape isHigh={isHigh} />;
      case "SHIFT_REGISTER":    return <ShiftRegisterShape isHigh={isHigh} />;
      // Wiring
      case "CLOCK":             return <ClockShape isHigh={isHigh} />;
      case "CONSTANT":          return <ConstantShape isHigh={isHigh} value={component.value} />;
      case "POWER":             return <PowerShape isHigh={isHigh} />;
      case "GROUND":            return <GroundShape isHigh={isHigh} />;
      case "PROBE":             return <ProbeShape isHigh={inputSignals?.[0] ?? false} />;
      case "TUNNEL":            return <TunnelShape isHigh={isHigh} />;
      case "SPLITTER":          return <SplitterShape isHigh={isHigh} />;
      // I/O
      case "BUTTON":            return <ButtonShape isHigh={isHigh} value={component.value} />;
      case "SEVEN_SEGMENT":     return <SevenSegmentShape inputs={inputSignals} />;
      case "HEX_DISPLAY":       return <HexDisplayShape inputs={inputSignals} />;
      case "LED_MATRIX":        return <LEDMatrixShape inputs={inputSignals} />;
      // Controlled gates
      case "CONTROLLED_BUFFER": return <ANDShape isHigh={isHigh} />;
      case "CONTROLLED_INVERTER": return <NOTShape isHigh={isHigh} />;
      default:                  return <ANDShape isHigh={isHigh} />;
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
      onPinDragStart={onPinDragStart || (() => {})}
      onInputPinDragStart={onInputPinDragStart}
      onInputPinMouseUp={onInputPinMouseUp}
      highlighted={highlighted}
      dimmed={dimmed}
    >
      {shape}
    </GateBase>
  );
}
