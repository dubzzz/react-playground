const myErrorSymbol = Symbol("MyError");

type MyErrorType = { [myErrorSymbol]: Promise<unknown> } | Promise<unknown>;

export class MyError {
  static from(p: Promise<unknown>): MyErrorType {
    return { [myErrorSymbol]: p, _suppressLogging: true } as MyErrorType;
  }
  static isValid(u: unknown): u is MyErrorType {
    return (
      u !== null && typeof u === "object" && ("then" in u || myErrorSymbol in u)
    );
  }
  static toPromise(e: MyErrorType): Promise<unknown> {
    if ("then" in e) return e;
    else return e[myErrorSymbol];
  }
}
