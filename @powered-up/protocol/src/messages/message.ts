export abstract class Message {
  public constructor(public readonly data: Buffer) {}
}
