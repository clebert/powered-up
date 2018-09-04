import {
  DeviceType,
  PropertyOperationType,
  PropertyType,
  SmartHubPortType,
  SmartMoveHubPortType,
  parseInput
} from '..';

function parseHex(s: string): Buffer {
  return Buffer.from(s.split(' ').map(n => parseInt(`0x${n}`, 16)));
}

describe('#parseInput', () => {
  describe('parses a CommandInput message sent from a SmartMoveHub', () => {
    test('EncodedMotorA => Error', () => {
      const data = parseHex('05 00 82 37 00'); // synthetic

      expect(() => parseInput(data)).toThrow(
        new Error('Unexpected command feedback.')
      );
    });

    test('EncodedMotorA => portBusy', () => {
      const data = parseHex('05 00 82 37 01'); // synthetic

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        portBusy: true,
        portBufferFull: false,
        commandCompleted: false,
        commandDiscarded: false
      });
    });

    test('EncodedMotorA => portBusy + commandCompleted', () => {
      const data = parseHex('05 00 82 37 03'); // synthetic

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        portBusy: true,
        portBufferFull: false,
        commandCompleted: true,
        commandDiscarded: false
      });
    });

    test('EncodedMotorA => portBusy + commandDiscarded', () => {
      const data = parseHex('05 00 82 37 05'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        portBusy: true,
        portBufferFull: false,
        commandCompleted: false,
        commandDiscarded: true
      });
    });

    test('EncodedMotorA => commandCompleted', () => {
      const data = parseHex('05 00 82 37 0a'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        portBusy: false,
        portBufferFull: false,
        commandCompleted: true,
        commandDiscarded: false
      });
    });

    test('EncodedMotorA => commandDiscarded', () => {
      const data = parseHex('05 00 82 37 0c'); // synthetic

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        portBusy: false,
        portBufferFull: false,
        commandCompleted: false,
        commandDiscarded: true
      });
    });

    test('EncodedMotorA => commandCompleted + commandDiscarded', () => {
      const data = parseHex('05 00 82 37 0e'); // synthetic

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        portBusy: false,
        portBufferFull: false,
        commandCompleted: true,
        commandDiscarded: true
      });
    });

    test('EncodedMotorA => portBusy + portBufferFull', () => {
      const data = parseHex('05 00 82 37 10'); // synthetic

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        portBusy: true,
        portBufferFull: true,
        commandCompleted: false,
        commandDiscarded: false
      });
    });
  });

  describe('parses a DeviceInfoInput message sent from a SmartMoveHub', () => {
    test('EncodedMotorA => InternalEncodedMotor', () => {
      const data = parseHex('0f 00 04 37 01 27 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorA,
        deviceInfo: {
          kind: 'real',
          deviceType: DeviceType.InternalEncodedMotor
        }
      });
    });

    test('EncodedMotorB => InternalEncodedMotor', () => {
      const data = parseHex('0f 00 04 38 01 27 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorB,
        deviceInfo: {
          kind: 'real',
          deviceType: DeviceType.InternalEncodedMotor
        }
      });
    });

    test('EncodedMotorAB => InternalEncodedMotor', () => {
      const data = parseHex('09 00 04 39 02 27 00 37 38'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.EncodedMotorAB,
        deviceInfo: {
          kind: 'virtual',
          deviceType: DeviceType.InternalEncodedMotor,
          mappedPortTypes: [
            SmartMoveHubPortType.EncodedMotorA,
            SmartMoveHubPortType.EncodedMotorB
          ]
        }
      });
    });

    test('RGBLight => RGBLight', () => {
      const data = parseHex('0f 00 04 32 01 17 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.RGBLight,
        deviceInfo: {kind: 'real', deviceType: DeviceType.RGBLight}
      });
    });

    test('TiltSensorThreeAxis => InternalTiltSensorThreeAxis', () => {
      const data = parseHex('0f 00 04 3a 01 28 00 00 00 00 10 00 00 00 02'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.TiltSensorThreeAxis,
        deviceInfo: {
          kind: 'real',
          deviceType: DeviceType.InternalTiltSensorThreeAxis
        }
      });
    });

    test('Current => Current', () => {
      const data = parseHex('0f 00 04 3b 01 15 00 02 00 00 00 02 00 00 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.Current,
        deviceInfo: {kind: 'real', deviceType: DeviceType.Current}
      });
    });

    test('Voltage => Voltage', () => {
      const data = parseHex('0f 00 04 3c 01 14 00 02 00 00 00 02 00 00 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.Voltage,
        deviceInfo: {kind: 'real', deviceType: DeviceType.Voltage}
      });
    });

    test('C => VisionSensor', () => {
      const data = parseHex('0f 00 04 01 01 25 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.C,
        deviceInfo: {kind: 'real', deviceType: DeviceType.VisionSensor}
      });
    });

    test('D => EncodedMotor', () => {
      const data = parseHex('0f 00 04 02 01 26 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.D,
        deviceInfo: {kind: 'real', deviceType: DeviceType.EncodedMotor}
      });
    });

    test('C => Motor', () => {
      const data = parseHex('0f 00 04 01 01 01 00 00 00 00 00 00 00 00 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.C,
        deviceInfo: {kind: 'real', deviceType: DeviceType.Motor}
      });
    });

    test('C => No device', () => {
      const data = parseHex('05 00 04 01 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.C
      });
    });

    test('D => No device', () => {
      const data = parseHex('05 00 04 02 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartMoveHubPortType.D
      });
    });
  });

  describe('parses a DeviceInfoInput message sent from a SmartHub', () => {
    test('Unknown => No device', () => {
      const data = parseHex('05 00 04 39 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: 57
      });
    });

    test('RGBLight => RGBLight', () => {
      const data = parseHex('0f 00 04 32 01 17 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.RGBLight,
        deviceInfo: {kind: 'real', deviceType: DeviceType.RGBLight}
      });
    });

    test('Current => Current', () => {
      const data = parseHex('0f 00 04 3b 01 15 00 02 00 00 00 02 00 00 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.Current,
        deviceInfo: {kind: 'real', deviceType: DeviceType.Current}
      });
    });

    test('Voltage => Voltage', () => {
      const data = parseHex('0f 00 04 3c 01 14 00 02 00 00 00 02 00 00 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.Voltage,
        deviceInfo: {kind: 'real', deviceType: DeviceType.Voltage}
      });
    });

    test('B => VisionSensor', () => {
      const data = parseHex('0f 00 04 01 01 25 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.B,
        deviceInfo: {kind: 'real', deviceType: DeviceType.VisionSensor}
      });
    });

    test('A => EncodedMotor', () => {
      const data = parseHex('0f 00 04 00 01 26 00 00 00 00 10 00 00 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.A,
        deviceInfo: {kind: 'real', deviceType: DeviceType.EncodedMotor}
      });
    });

    test('A => Motor', () => {
      const data = parseHex('0f 00 04 00 01 01 00 00 00 00 00 00 00 00 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.A,
        deviceInfo: {kind: 'real', deviceType: DeviceType.Motor}
      });
    });

    test('A => No device', () => {
      const data = parseHex('05 00 04 00 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.A
      });
    });

    test('B => No device', () => {
      const data = parseHex('05 00 04 01 00'); // real

      expect(parseInput(data)).toEqual({
        data,
        portType: SmartHubPortType.B
      });
    });
  });

  describe('parses a ErrorInput message sent from a SmartMoveHub', () => {
    // TODO:
  });

  describe('parses a ModeInfoInput message sent from a SmartMoveHub', () => {
    // TODO:
  });

  describe('parses a ModeInput message sent from a SmartMoveHub', () => {
    // TODO:
  });

  describe('parses a PropertyInput message sent from a SmartMoveHub', () => {
    test('FirmwareVersion => Update', () => {
      const data = parseHex('09 00 01 03 06 23 02 00 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        propertyType: PropertyType.FirmwareVersion,
        propertyOperationType: PropertyOperationType.Update,
        propertyOperationPayload: {kind: 'version', version: '1.0.0.547'}
      });
    });

    test('HardwareVersion => Update', () => {
      const data = parseHex('09 00 01 04 06 00 00 00 04'); // real

      expect(parseInput(data)).toEqual({
        data,
        propertyType: PropertyType.HardwareVersion,
        propertyOperationType: PropertyOperationType.Update,
        propertyOperationPayload: {kind: 'version', version: '0.4.0.0'}
      });
    });
  });

  describe('parses a PropertyInput message sent from a SmartHub', () => {
    test('FirmwareVersion => Update', () => {
      const data = parseHex('09 00 01 03 06 00 00 03 10'); // real

      expect(parseInput(data)).toEqual({
        data,
        propertyType: PropertyType.FirmwareVersion,
        propertyOperationType: PropertyOperationType.Update,
        propertyOperationPayload: {kind: 'version', version: '1.0.3.0'}
      });
    });

    test('HardwareVersion => Update', () => {
      const data = parseHex('09 00 01 04 06 00 00 00 01'); // real

      expect(parseInput(data)).toEqual({
        data,
        propertyType: PropertyType.HardwareVersion,
        propertyOperationType: PropertyOperationType.Update,
        propertyOperationPayload: {kind: 'version', version: '0.1.0.0'}
      });
    });
  });

  describe('parses a ValueInput message sent from a SmartMoveHub', () => {
    // TODO:
  });
});
