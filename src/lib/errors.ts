export class ParseError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = 'ParseError';
  }
}
