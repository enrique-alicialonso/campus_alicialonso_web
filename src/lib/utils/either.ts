/**
 * Represents a value of one of two possible types (a disjoint union).
 * An Either is either Left (typically representing failure) or Right (typically representing success).
 */
export class Either<L, R> {
  private constructor(
    private readonly value: L | R,
    private readonly isLeft: boolean
  ) {}

  /**
   * Creates a Left instance.
   */
  static left<L, R>(value: L): Either<L, R> {
    return new Either<L, R>(value, true);
  }

  /**
   * Creates a Right instance.
   */
  static right<L, R>(value: R): Either<L, R> {
    return new Either<L, R>(value, false);
  }

  /**
   * Creates an Either from a function that might throw.
   */
  static try<R>(f: () => R): Either<Error, R> {
    try {
      return Either.right(f());
    } catch (e) {
      return Either.left(e instanceof Error ? e : new Error(String(e)));
    }
  }

  /**
   * Creates an Either from an async function that might throw.
   */
  static async tryAsync<R>(f: () => Promise<R>): Promise<Either<Error, R>> {
    try {
      return Either.right(await f());
    } catch (e) {
      return Either.left(e instanceof Error ? e : new Error(String(e)));
    }
  }

  /**
   * Returns true if this is a Left, false otherwise.
   */
  isLeftSide(): boolean {
    return this.isLeft;
  }

  /**
   * Returns true if this is a Right, false otherwise.
   */
  isRightSide(): boolean {
    return !this.isLeft;
  }

  /**
   * Maps a function over the Right value.
   */
  map<T>(f: (r: R) => T): Either<L, T> {
    return this.isLeft
      ? Either.left(this.value as L)
      : Either.right(f(this.value as R));
  }

  /**
   * Maps a function over the Left value.
   */
  mapLeft<T>(f: (l: L) => T): Either<T, R> {
    return this.isLeft
      ? Either.left(f(this.value as L))
      : Either.right(this.value as R);
  }

  /**
   * Applies a function to each case in the Either.
   */
  fold<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T {
    return this.isLeft ? onLeft(this.value as L) : onRight(this.value as R);
  }

  /**
   * Chain multiple operations that return Either.
   */
  flatMap<T>(f: (r: R) => Either<L, T>): Either<L, T> {
    return this.isLeft ? Either.left(this.value as L) : f(this.value as R);
  }

  /**
   * Recovers from a Left with a provided function.
   */
  recover(f: (l: L) => R): R {
    return this.isLeft ? f(this.value as L) : (this.value as R);
  }

  /**
   * Gets the Right value if it exists, otherwise returns the provided default value.
   */
  getOrElse(defaultValue: R): R {
    return this.isLeft ? defaultValue : (this.value as R);
  }

  /**
   * Gets the Right value if it exists, otherwise throws the Left value.
   */
  getOrThrow(): R {
    if (this.isLeft) {
      throw this.value;
    }
    return this.value as R;
  }

  /**
   * Gets the Left value if it exists, otherwise returns undefined.
   */
  getLeft(): L | undefined {
    return this.isLeft ? (this.value as L) : undefined;
  }

  /**
   * Gets the Right value if it exists, otherwise returns undefined.
   */
  getRight(): R | undefined {
    return this.isLeft ? undefined : (this.value as R);
  }
}
