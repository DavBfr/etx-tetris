declare module model {
  function getInfo(): Model
  function setInfo(value: Model): void
  function getModule(index: number): Module
  function setModule(index: number, value: Module): void
  function getTimer(timer: number): Timer
  function setTimer(timer: number, value: Timer): void
  function resetTimer(timer: number): void
  function deleteFlightModes(): void
  function getFlightMode(): void
  function setFlightMode(): void
  function getInputsCount(): void
  function getInput(): void
  function insertInput(): void
  function deleteInput(): void
  function deleteInputs(): void
  function defaultInputs(): void
  function getMixesCount(): void
  function getMix(): void
  function insertMix(): void
  function deleteMix(): void
  function deleteMixes(): void
  function getLogicalSwitch(): void
  function setLogicalSwitch(): void
  function getCustomFunction(): void
  function setCustomFunction(): void
  function getCurve(): void
  function setCurve(): void
  function getOutput(index: number): ModelOutput
  function setOutput(): void
  function getGlobalVariable(): void
  function setGlobalVariable(): void
  function getSensor(): void
  function resetSensor(): void
}

declare interface Model {
  name?: string
  bitmap?: string
  filename?: string
  extendedLimits?: boolean
}

declare interface Module {
  subType?: number
  modelId?: number
  firstChannel?: number
  channelsCount?: number
  Type?: number
  protocol?: number
  subProtocol?: number
  channelsOrder?: number
}


declare interface Timer {
  mode?: number
  start?: number
  value?: number
  countdownBeep?: number
  minuteBeep?: boolean
  persistent?: number
  name?: string
}


declare interface ModelOutput {
  name: string
  min: number
  max: number
  offset: number
  ppmCenter: number
  symetrical: number
  revert: number
  curve?: number
}
