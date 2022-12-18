export class UserError extends Error {
  public constructor(public readonly title: string, message: string) {
    super(message)
  }
}
