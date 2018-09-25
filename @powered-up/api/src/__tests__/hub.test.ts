import {
  CommandOutput,
  CommandType,
  ErrorInput,
  ErrorType,
  MessageType
} from '@powered-up/protocol';
import {IReactionDisposer, autorun, observable} from 'mobx';
import {Hub} from '../hub';

class MockHubConnection {
  @observable
  public latestError?: Error;

  @observable
  public latestInput?: ErrorInput;

  public readonly send = jest.fn();
}

class TestHub extends Hub {}

const dummyErrorInput = new ErrorInput(
  Buffer.from([0, 0, 0, MessageType.CommandOutput, ErrorType.InvalidUse])
);

const dummyOutput = new CommandOutput(
  0,
  true,
  CommandType.SetValueForMode,
  Buffer.alloc(0)
);

describe('class Hub', () => {
  let mockHubConnection: MockHubConnection;
  let hub: Hub;
  let latestError: Error | undefined;
  let disposer: IReactionDisposer;

  beforeEach(() => {
    mockHubConnection = new MockHubConnection();

    // tslint:disable-next-line:no-any
    hub = new TestHub(mockHubConnection as any);

    disposer = autorun(() => {
      latestError = hub.latestError;
    });
  });

  afterEach(() => {
    disposer();
  });

  describe('#latestError', () => {
    it('reports hub connection errors', () => {
      expect(latestError).toBe(undefined);

      const error1 = new Error();

      mockHubConnection.latestError = error1;

      expect(latestError).toBe(error1);

      const error2 = new Error();

      mockHubConnection.latestError = error2;

      expect(latestError).toBe(error2);

      mockHubConnection.latestError = undefined;

      expect(latestError).toBe(error2);
    });

    it('reports message delivery problems', () => {
      mockHubConnection.send.mockReturnValue(true);

      hub.send(dummyOutput);

      expect(latestError).toBe(undefined);

      mockHubConnection.send.mockReturnValue(false);

      hub.send(dummyOutput);

      expect(latestError).toEqual(
        new Error('Unable to send message, the hub is not connected.')
      );
    });

    it('reports hub error inputs', () => {
      expect(latestError).toBe(undefined);

      mockHubConnection.latestInput = dummyErrorInput;

      expect(latestError).toEqual(
        new Error(`InvalidUse(6) error caused by CommandOutput(129) message.`)
      );
    });
  });
});
