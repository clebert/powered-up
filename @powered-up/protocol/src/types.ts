export enum CommandType {
  EncodedDualMotorRunWithPower = 2,
  EncodedMotorSetAccelerationDuration = 5,
  EncodedMotorSetDecelerationDuration = 6,
  EncodedMotorRunWithSpeed = 7,
  EncodedDualMotorRunWithSpeed = 8,
  EncodedMotorRunWithSpeedForDuration = 9,
  EncodedDualMotorRunWithSpeedForDuration = 10,
  EncodedMotorRunWithSpeedForDistance = 11,
  EncodedDualMotorRunWithSpeedForDistance = 12,
  EncodedMotorRunWithSpeedToPosition = 13,
  EncodedDualMotorRunWithSpeedToPosition = 14,
  EncodedDualMotorSetPosition = 20,
  SetValueForMode = 81
}

export enum DeviceType {
  Generic = 0,
  Motor = 1,
  SystemTrainMotor = 2,
  SystemTrainLight = 8,
  VoltageSensor = 20,
  CurrentSensor = 21,
  PiezoTonePlayer = 22,
  RGBLight = 23,
  TiltSensor = 34,
  MotionSensor = 35,
  VisionSensor = 37,
  EncodedMotor = 38,
  InternalEncodedMotor = 39,
  InternalTiltSensor = 40,
  DTMotor = 41,
  SoundPlayer = 42,
  ColorSensor = 43,
  MoveSensor = 44
}

export enum ErrorType {
  ACK = 1,
  NAK = 2,
  BufferOverflow = 3,
  Timeout = 4,
  CommandNotRecognized = 5,
  InvalidUse = 6
}

export enum ModeInfoFormatType {
  Int8 = 0,
  Int16 = 1,
  Int32 = 2,
  Float = 3
}

export enum ModeInfoType {
  Name = 0,
  Raw = 1,
  Pct = 2,
  SI = 3,
  Symbol = 4,
  Mapping = 5,
  Format = 128
}

export enum MessageType {
  PropertyInputOutput = 1,
  DeviceInfoInput = 4,
  ErrorInput = 5,
  ModeInfoOutput = 34,
  ModeOutput = 65,
  ModeInfoInput = 68,
  ValueInput = 69,
  ModeInput = 71,
  CommandOutput = 129,
  CommandInput = 130
}

export enum PropertyOperationType {
  Set = 1,
  EnableUpdates = 2,
  DisableUpdates = 3,
  Reset = 4,
  RequestUpdate = 5,
  Update = 6
}

export enum PropertyType {
  Name = 1,
  Button = 2,
  FirmwareVersion = 3,
  HardwareVersion = 4,
  RSSI = 5,
  BatteryVoltage = 6,
  BatteryType = 7,
  ManufacturerName = 8,
  RadioFirmwareVersion = 9,
  WirelessProtocolVersion = 10,
  HardwareSystemType = 11,
  HardwareNetworkId = 12,
  PrimaryMacAddress = 13,
  SecondaryMacAddress = 14
}

export enum SmartHubPortType {
  A = 0,
  B = 1,
  RGBLight = 50,
  CurrentSensor = 59,
  VoltageSensor = 60
}

export enum SmartMoveHubPortType {
  C = 1,
  D = 2,
  RGBLight = 50,
  EncodedMotorA = 55,
  EncodedMotorB = 56,
  EncodedMotorAB = 57,
  TiltSensor = 58,
  CurrentSensor = 59,
  VoltageSensor = 60
}

export enum MotorModeType {
  Power = 0
}

export enum EncodedMotorAccDecProfileType {
  None = 0,
  Start = 1,
  End = 2,
  Both = 3
}

export enum EncodedMotorEndStateType {
  Drifting = 0,
  Holding = 126,
  Braking = 127
}

export enum EncodedMotorModeType {
  Power = 0,
  Speed = 1,
  Position = 2
}

export enum RGBLightModeType {
  DiscreteColor = 0,
  AbsoluteColor = 1
}

export enum RGBLightDiscreteColorType {
  Off = 0,
  Pink = 1,
  Purple = 2,
  Blue = 3,
  LightBlue = 4,
  Cyan = 5,
  Green = 6,
  Yellow = 7,
  Orange = 8,
  Red = 9,
  White = 10
}

export enum VoltageSensorModeType {
  Millivolts = 0
}

export enum CurrentSensorModeType {
  Milliamps = 0
}
