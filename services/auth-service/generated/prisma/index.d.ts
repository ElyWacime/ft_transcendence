
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model FriendRequest
 * 
 */
export type FriendRequest = $Result.DefaultSelection<Prisma.$FriendRequestPayload>
/**
 * Model Tournament
 * 
 */
export type Tournament = $Result.DefaultSelection<Prisma.$TournamentPayload>
/**
 * Model Participate_Tournament
 * 
 */
export type Participate_Tournament = $Result.DefaultSelection<Prisma.$Participate_TournamentPayload>
/**
 * Model Match
 * 
 */
export type Match = $Result.DefaultSelection<Prisma.$MatchPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const FriendRequestStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

export type FriendRequestStatus = (typeof FriendRequestStatus)[keyof typeof FriendRequestStatus]


export const MatchResult: {
  PENDING: 'PENDING',
  WIN: 'WIN',
  LOSE: 'LOSE',
  DRAW: 'DRAW'
};

export type MatchResult = (typeof MatchResult)[keyof typeof MatchResult]

}

export type FriendRequestStatus = $Enums.FriendRequestStatus

export const FriendRequestStatus: typeof $Enums.FriendRequestStatus

export type MatchResult = $Enums.MatchResult

export const MatchResult: typeof $Enums.MatchResult

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.friendRequest`: Exposes CRUD operations for the **FriendRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FriendRequests
    * const friendRequests = await prisma.friendRequest.findMany()
    * ```
    */
  get friendRequest(): Prisma.FriendRequestDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tournament`: Exposes CRUD operations for the **Tournament** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tournaments
    * const tournaments = await prisma.tournament.findMany()
    * ```
    */
  get tournament(): Prisma.TournamentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.participate_Tournament`: Exposes CRUD operations for the **Participate_Tournament** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Participate_Tournaments
    * const participate_Tournaments = await prisma.participate_Tournament.findMany()
    * ```
    */
  get participate_Tournament(): Prisma.Participate_TournamentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.match`: Exposes CRUD operations for the **Match** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Matches
    * const matches = await prisma.match.findMany()
    * ```
    */
  get match(): Prisma.MatchDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.3
   * Query Engine version: bb420e667c1820a8c05a38023385f6cc7ef8e83a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    FriendRequest: 'FriendRequest',
    Tournament: 'Tournament',
    Participate_Tournament: 'Participate_Tournament',
    Match: 'Match'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "friendRequest" | "tournament" | "participate_Tournament" | "match"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      FriendRequest: {
        payload: Prisma.$FriendRequestPayload<ExtArgs>
        fields: Prisma.FriendRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FriendRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FriendRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>
          }
          findFirst: {
            args: Prisma.FriendRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FriendRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>
          }
          findMany: {
            args: Prisma.FriendRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>[]
          }
          create: {
            args: Prisma.FriendRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>
          }
          createMany: {
            args: Prisma.FriendRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FriendRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>[]
          }
          delete: {
            args: Prisma.FriendRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>
          }
          update: {
            args: Prisma.FriendRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>
          }
          deleteMany: {
            args: Prisma.FriendRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FriendRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FriendRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>[]
          }
          upsert: {
            args: Prisma.FriendRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendRequestPayload>
          }
          aggregate: {
            args: Prisma.FriendRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFriendRequest>
          }
          groupBy: {
            args: Prisma.FriendRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<FriendRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.FriendRequestCountArgs<ExtArgs>
            result: $Utils.Optional<FriendRequestCountAggregateOutputType> | number
          }
        }
      }
      Tournament: {
        payload: Prisma.$TournamentPayload<ExtArgs>
        fields: Prisma.TournamentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TournamentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TournamentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          findFirst: {
            args: Prisma.TournamentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TournamentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          findMany: {
            args: Prisma.TournamentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>[]
          }
          create: {
            args: Prisma.TournamentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          createMany: {
            args: Prisma.TournamentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TournamentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>[]
          }
          delete: {
            args: Prisma.TournamentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          update: {
            args: Prisma.TournamentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          deleteMany: {
            args: Prisma.TournamentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TournamentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TournamentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>[]
          }
          upsert: {
            args: Prisma.TournamentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TournamentPayload>
          }
          aggregate: {
            args: Prisma.TournamentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTournament>
          }
          groupBy: {
            args: Prisma.TournamentGroupByArgs<ExtArgs>
            result: $Utils.Optional<TournamentGroupByOutputType>[]
          }
          count: {
            args: Prisma.TournamentCountArgs<ExtArgs>
            result: $Utils.Optional<TournamentCountAggregateOutputType> | number
          }
        }
      }
      Participate_Tournament: {
        payload: Prisma.$Participate_TournamentPayload<ExtArgs>
        fields: Prisma.Participate_TournamentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.Participate_TournamentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.Participate_TournamentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>
          }
          findFirst: {
            args: Prisma.Participate_TournamentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.Participate_TournamentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>
          }
          findMany: {
            args: Prisma.Participate_TournamentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>[]
          }
          create: {
            args: Prisma.Participate_TournamentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>
          }
          createMany: {
            args: Prisma.Participate_TournamentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.Participate_TournamentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>[]
          }
          delete: {
            args: Prisma.Participate_TournamentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>
          }
          update: {
            args: Prisma.Participate_TournamentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>
          }
          deleteMany: {
            args: Prisma.Participate_TournamentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.Participate_TournamentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.Participate_TournamentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>[]
          }
          upsert: {
            args: Prisma.Participate_TournamentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$Participate_TournamentPayload>
          }
          aggregate: {
            args: Prisma.Participate_TournamentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateParticipate_Tournament>
          }
          groupBy: {
            args: Prisma.Participate_TournamentGroupByArgs<ExtArgs>
            result: $Utils.Optional<Participate_TournamentGroupByOutputType>[]
          }
          count: {
            args: Prisma.Participate_TournamentCountArgs<ExtArgs>
            result: $Utils.Optional<Participate_TournamentCountAggregateOutputType> | number
          }
        }
      }
      Match: {
        payload: Prisma.$MatchPayload<ExtArgs>
        fields: Prisma.MatchFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MatchFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MatchFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findFirst: {
            args: Prisma.MatchFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MatchFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          findMany: {
            args: Prisma.MatchFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          create: {
            args: Prisma.MatchCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          createMany: {
            args: Prisma.MatchCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MatchCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          delete: {
            args: Prisma.MatchDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          update: {
            args: Prisma.MatchUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          deleteMany: {
            args: Prisma.MatchDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MatchUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MatchUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>[]
          }
          upsert: {
            args: Prisma.MatchUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MatchPayload>
          }
          aggregate: {
            args: Prisma.MatchAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMatch>
          }
          groupBy: {
            args: Prisma.MatchGroupByArgs<ExtArgs>
            result: $Utils.Optional<MatchGroupByOutputType>[]
          }
          count: {
            args: Prisma.MatchCountArgs<ExtArgs>
            result: $Utils.Optional<MatchCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    friendRequest?: FriendRequestOmit
    tournament?: TournamentOmit
    participate_Tournament?: Participate_TournamentOmit
    match?: MatchOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sentRequests: number
    receivedRequests: number
    Participate_Tournament: number
    Win_Tournament: number
    Match1: number
    Match2: number
    Matchw: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentRequests?: boolean | UserCountOutputTypeCountSentRequestsArgs
    receivedRequests?: boolean | UserCountOutputTypeCountReceivedRequestsArgs
    Participate_Tournament?: boolean | UserCountOutputTypeCountParticipate_TournamentArgs
    Win_Tournament?: boolean | UserCountOutputTypeCountWin_TournamentArgs
    Match1?: boolean | UserCountOutputTypeCountMatch1Args
    Match2?: boolean | UserCountOutputTypeCountMatch2Args
    Matchw?: boolean | UserCountOutputTypeCountMatchwArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendRequestWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountParticipate_TournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Participate_TournamentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountWin_TournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Participate_TournamentWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMatch1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMatch2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMatchwArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Count Type TournamentCountOutputType
   */

  export type TournamentCountOutputType = {
    Participate_Tournament: number
    Match: number
  }

  export type TournamentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Participate_Tournament?: boolean | TournamentCountOutputTypeCountParticipate_TournamentArgs
    Match?: boolean | TournamentCountOutputTypeCountMatchArgs
  }

  // Custom InputTypes
  /**
   * TournamentCountOutputType without action
   */
  export type TournamentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TournamentCountOutputType
     */
    select?: TournamentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TournamentCountOutputType without action
   */
  export type TournamentCountOutputTypeCountParticipate_TournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Participate_TournamentWhereInput
  }

  /**
   * TournamentCountOutputType without action
   */
  export type TournamentCountOutputTypeCountMatchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    loggedIn: boolean | null
    isOnline: boolean | null
    avatar: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
    loggedIn: boolean | null
    isOnline: boolean | null
    avatar: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    loggedIn: number
    isOnline: number
    avatar: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    loggedIn?: true
    isOnline?: true
    avatar?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    loggedIn?: true
    isOnline?: true
    avatar?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
    loggedIn?: true
    isOnline?: true
    avatar?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    password: string
    loggedIn: boolean
    isOnline: boolean
    avatar: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: boolean
    sentRequests?: boolean | User$sentRequestsArgs<ExtArgs>
    receivedRequests?: boolean | User$receivedRequestsArgs<ExtArgs>
    Participate_Tournament?: boolean | User$Participate_TournamentArgs<ExtArgs>
    Win_Tournament?: boolean | User$Win_TournamentArgs<ExtArgs>
    Match1?: boolean | User$Match1Args<ExtArgs>
    Match2?: boolean | User$Match2Args<ExtArgs>
    Matchw?: boolean | User$MatchwArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password" | "loggedIn" | "isOnline" | "avatar", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentRequests?: boolean | User$sentRequestsArgs<ExtArgs>
    receivedRequests?: boolean | User$receivedRequestsArgs<ExtArgs>
    Participate_Tournament?: boolean | User$Participate_TournamentArgs<ExtArgs>
    Win_Tournament?: boolean | User$Win_TournamentArgs<ExtArgs>
    Match1?: boolean | User$Match1Args<ExtArgs>
    Match2?: boolean | User$Match2Args<ExtArgs>
    Matchw?: boolean | User$MatchwArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sentRequests: Prisma.$FriendRequestPayload<ExtArgs>[]
      receivedRequests: Prisma.$FriendRequestPayload<ExtArgs>[]
      Participate_Tournament: Prisma.$Participate_TournamentPayload<ExtArgs>[]
      Win_Tournament: Prisma.$Participate_TournamentPayload<ExtArgs>[]
      Match1: Prisma.$MatchPayload<ExtArgs>[]
      Match2: Prisma.$MatchPayload<ExtArgs>[]
      Matchw: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      password: string
      loggedIn: boolean
      isOnline: boolean
      avatar: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sentRequests<T extends User$sentRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$sentRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedRequests<T extends User$receivedRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Participate_Tournament<T extends User$Participate_TournamentArgs<ExtArgs> = {}>(args?: Subset<T, User$Participate_TournamentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Win_Tournament<T extends User$Win_TournamentArgs<ExtArgs> = {}>(args?: Subset<T, User$Win_TournamentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Match1<T extends User$Match1Args<ExtArgs> = {}>(args?: Subset<T, User$Match1Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Match2<T extends User$Match2Args<ExtArgs> = {}>(args?: Subset<T, User$Match2Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Matchw<T extends User$MatchwArgs<ExtArgs> = {}>(args?: Subset<T, User$MatchwArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly loggedIn: FieldRef<"User", 'Boolean'>
    readonly isOnline: FieldRef<"User", 'Boolean'>
    readonly avatar: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sentRequests
   */
  export type User$sentRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    where?: FriendRequestWhereInput
    orderBy?: FriendRequestOrderByWithRelationInput | FriendRequestOrderByWithRelationInput[]
    cursor?: FriendRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendRequestScalarFieldEnum | FriendRequestScalarFieldEnum[]
  }

  /**
   * User.receivedRequests
   */
  export type User$receivedRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    where?: FriendRequestWhereInput
    orderBy?: FriendRequestOrderByWithRelationInput | FriendRequestOrderByWithRelationInput[]
    cursor?: FriendRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendRequestScalarFieldEnum | FriendRequestScalarFieldEnum[]
  }

  /**
   * User.Participate_Tournament
   */
  export type User$Participate_TournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    where?: Participate_TournamentWhereInput
    orderBy?: Participate_TournamentOrderByWithRelationInput | Participate_TournamentOrderByWithRelationInput[]
    cursor?: Participate_TournamentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Participate_TournamentScalarFieldEnum | Participate_TournamentScalarFieldEnum[]
  }

  /**
   * User.Win_Tournament
   */
  export type User$Win_TournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    where?: Participate_TournamentWhereInput
    orderBy?: Participate_TournamentOrderByWithRelationInput | Participate_TournamentOrderByWithRelationInput[]
    cursor?: Participate_TournamentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Participate_TournamentScalarFieldEnum | Participate_TournamentScalarFieldEnum[]
  }

  /**
   * User.Match1
   */
  export type User$Match1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * User.Match2
   */
  export type User$Match2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * User.Matchw
   */
  export type User$MatchwArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model FriendRequest
   */

  export type AggregateFriendRequest = {
    _count: FriendRequestCountAggregateOutputType | null
    _min: FriendRequestMinAggregateOutputType | null
    _max: FriendRequestMaxAggregateOutputType | null
  }

  export type FriendRequestMinAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    status: $Enums.FriendRequestStatus | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
  }

  export type FriendRequestMaxAggregateOutputType = {
    id: string | null
    senderId: string | null
    receiverId: string | null
    status: $Enums.FriendRequestStatus | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
  }

  export type FriendRequestCountAggregateOutputType = {
    id: number
    senderId: number
    receiverId: number
    status: number
    CreatedAt: number
    UpdatedAt: number
    _all: number
  }


  export type FriendRequestMinAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    status?: true
    CreatedAt?: true
    UpdatedAt?: true
  }

  export type FriendRequestMaxAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    status?: true
    CreatedAt?: true
    UpdatedAt?: true
  }

  export type FriendRequestCountAggregateInputType = {
    id?: true
    senderId?: true
    receiverId?: true
    status?: true
    CreatedAt?: true
    UpdatedAt?: true
    _all?: true
  }

  export type FriendRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FriendRequest to aggregate.
     */
    where?: FriendRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FriendRequests to fetch.
     */
    orderBy?: FriendRequestOrderByWithRelationInput | FriendRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FriendRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FriendRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FriendRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FriendRequests
    **/
    _count?: true | FriendRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FriendRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FriendRequestMaxAggregateInputType
  }

  export type GetFriendRequestAggregateType<T extends FriendRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateFriendRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFriendRequest[P]>
      : GetScalarType<T[P], AggregateFriendRequest[P]>
  }




  export type FriendRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendRequestWhereInput
    orderBy?: FriendRequestOrderByWithAggregationInput | FriendRequestOrderByWithAggregationInput[]
    by: FriendRequestScalarFieldEnum[] | FriendRequestScalarFieldEnum
    having?: FriendRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FriendRequestCountAggregateInputType | true
    _min?: FriendRequestMinAggregateInputType
    _max?: FriendRequestMaxAggregateInputType
  }

  export type FriendRequestGroupByOutputType = {
    id: string
    senderId: string
    receiverId: string
    status: $Enums.FriendRequestStatus
    CreatedAt: Date
    UpdatedAt: Date
    _count: FriendRequestCountAggregateOutputType | null
    _min: FriendRequestMinAggregateOutputType | null
    _max: FriendRequestMaxAggregateOutputType | null
  }

  type GetFriendRequestGroupByPayload<T extends FriendRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FriendRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FriendRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FriendRequestGroupByOutputType[P]>
            : GetScalarType<T[P], FriendRequestGroupByOutputType[P]>
        }
      >
    >


  export type FriendRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendRequest"]>

  export type FriendRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendRequest"]>

  export type FriendRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendRequest"]>

  export type FriendRequestSelectScalar = {
    id?: boolean
    senderId?: boolean
    receiverId?: boolean
    status?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
  }

  export type FriendRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "senderId" | "receiverId" | "status" | "CreatedAt" | "UpdatedAt", ExtArgs["result"]["friendRequest"]>
  export type FriendRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FriendRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FriendRequest"
    objects: {
      sender: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      senderId: string
      receiverId: string
      status: $Enums.FriendRequestStatus
      CreatedAt: Date
      UpdatedAt: Date
    }, ExtArgs["result"]["friendRequest"]>
    composites: {}
  }

  type FriendRequestGetPayload<S extends boolean | null | undefined | FriendRequestDefaultArgs> = $Result.GetResult<Prisma.$FriendRequestPayload, S>

  type FriendRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FriendRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FriendRequestCountAggregateInputType | true
    }

  export interface FriendRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FriendRequest'], meta: { name: 'FriendRequest' } }
    /**
     * Find zero or one FriendRequest that matches the filter.
     * @param {FriendRequestFindUniqueArgs} args - Arguments to find a FriendRequest
     * @example
     * // Get one FriendRequest
     * const friendRequest = await prisma.friendRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FriendRequestFindUniqueArgs>(args: SelectSubset<T, FriendRequestFindUniqueArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one FriendRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FriendRequestFindUniqueOrThrowArgs} args - Arguments to find a FriendRequest
     * @example
     * // Get one FriendRequest
     * const friendRequest = await prisma.friendRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FriendRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, FriendRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FriendRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendRequestFindFirstArgs} args - Arguments to find a FriendRequest
     * @example
     * // Get one FriendRequest
     * const friendRequest = await prisma.friendRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FriendRequestFindFirstArgs>(args?: SelectSubset<T, FriendRequestFindFirstArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first FriendRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendRequestFindFirstOrThrowArgs} args - Arguments to find a FriendRequest
     * @example
     * // Get one FriendRequest
     * const friendRequest = await prisma.friendRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FriendRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, FriendRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more FriendRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FriendRequests
     * const friendRequests = await prisma.friendRequest.findMany()
     * 
     * // Get first 10 FriendRequests
     * const friendRequests = await prisma.friendRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const friendRequestWithIdOnly = await prisma.friendRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FriendRequestFindManyArgs>(args?: SelectSubset<T, FriendRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a FriendRequest.
     * @param {FriendRequestCreateArgs} args - Arguments to create a FriendRequest.
     * @example
     * // Create one FriendRequest
     * const FriendRequest = await prisma.friendRequest.create({
     *   data: {
     *     // ... data to create a FriendRequest
     *   }
     * })
     * 
     */
    create<T extends FriendRequestCreateArgs>(args: SelectSubset<T, FriendRequestCreateArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many FriendRequests.
     * @param {FriendRequestCreateManyArgs} args - Arguments to create many FriendRequests.
     * @example
     * // Create many FriendRequests
     * const friendRequest = await prisma.friendRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FriendRequestCreateManyArgs>(args?: SelectSubset<T, FriendRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FriendRequests and returns the data saved in the database.
     * @param {FriendRequestCreateManyAndReturnArgs} args - Arguments to create many FriendRequests.
     * @example
     * // Create many FriendRequests
     * const friendRequest = await prisma.friendRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FriendRequests and only return the `id`
     * const friendRequestWithIdOnly = await prisma.friendRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FriendRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, FriendRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a FriendRequest.
     * @param {FriendRequestDeleteArgs} args - Arguments to delete one FriendRequest.
     * @example
     * // Delete one FriendRequest
     * const FriendRequest = await prisma.friendRequest.delete({
     *   where: {
     *     // ... filter to delete one FriendRequest
     *   }
     * })
     * 
     */
    delete<T extends FriendRequestDeleteArgs>(args: SelectSubset<T, FriendRequestDeleteArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one FriendRequest.
     * @param {FriendRequestUpdateArgs} args - Arguments to update one FriendRequest.
     * @example
     * // Update one FriendRequest
     * const friendRequest = await prisma.friendRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FriendRequestUpdateArgs>(args: SelectSubset<T, FriendRequestUpdateArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more FriendRequests.
     * @param {FriendRequestDeleteManyArgs} args - Arguments to filter FriendRequests to delete.
     * @example
     * // Delete a few FriendRequests
     * const { count } = await prisma.friendRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FriendRequestDeleteManyArgs>(args?: SelectSubset<T, FriendRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FriendRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FriendRequests
     * const friendRequest = await prisma.friendRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FriendRequestUpdateManyArgs>(args: SelectSubset<T, FriendRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FriendRequests and returns the data updated in the database.
     * @param {FriendRequestUpdateManyAndReturnArgs} args - Arguments to update many FriendRequests.
     * @example
     * // Update many FriendRequests
     * const friendRequest = await prisma.friendRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more FriendRequests and only return the `id`
     * const friendRequestWithIdOnly = await prisma.friendRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FriendRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, FriendRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one FriendRequest.
     * @param {FriendRequestUpsertArgs} args - Arguments to update or create a FriendRequest.
     * @example
     * // Update or create a FriendRequest
     * const friendRequest = await prisma.friendRequest.upsert({
     *   create: {
     *     // ... data to create a FriendRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FriendRequest we want to update
     *   }
     * })
     */
    upsert<T extends FriendRequestUpsertArgs>(args: SelectSubset<T, FriendRequestUpsertArgs<ExtArgs>>): Prisma__FriendRequestClient<$Result.GetResult<Prisma.$FriendRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of FriendRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendRequestCountArgs} args - Arguments to filter FriendRequests to count.
     * @example
     * // Count the number of FriendRequests
     * const count = await prisma.friendRequest.count({
     *   where: {
     *     // ... the filter for the FriendRequests we want to count
     *   }
     * })
    **/
    count<T extends FriendRequestCountArgs>(
      args?: Subset<T, FriendRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FriendRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FriendRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FriendRequestAggregateArgs>(args: Subset<T, FriendRequestAggregateArgs>): Prisma.PrismaPromise<GetFriendRequestAggregateType<T>>

    /**
     * Group by FriendRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FriendRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FriendRequestGroupByArgs['orderBy'] }
        : { orderBy?: FriendRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FriendRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFriendRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FriendRequest model
   */
  readonly fields: FriendRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FriendRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FriendRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FriendRequest model
   */
  interface FriendRequestFieldRefs {
    readonly id: FieldRef<"FriendRequest", 'String'>
    readonly senderId: FieldRef<"FriendRequest", 'String'>
    readonly receiverId: FieldRef<"FriendRequest", 'String'>
    readonly status: FieldRef<"FriendRequest", 'FriendRequestStatus'>
    readonly CreatedAt: FieldRef<"FriendRequest", 'DateTime'>
    readonly UpdatedAt: FieldRef<"FriendRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FriendRequest findUnique
   */
  export type FriendRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * Filter, which FriendRequest to fetch.
     */
    where: FriendRequestWhereUniqueInput
  }

  /**
   * FriendRequest findUniqueOrThrow
   */
  export type FriendRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * Filter, which FriendRequest to fetch.
     */
    where: FriendRequestWhereUniqueInput
  }

  /**
   * FriendRequest findFirst
   */
  export type FriendRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * Filter, which FriendRequest to fetch.
     */
    where?: FriendRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FriendRequests to fetch.
     */
    orderBy?: FriendRequestOrderByWithRelationInput | FriendRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FriendRequests.
     */
    cursor?: FriendRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FriendRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FriendRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FriendRequests.
     */
    distinct?: FriendRequestScalarFieldEnum | FriendRequestScalarFieldEnum[]
  }

  /**
   * FriendRequest findFirstOrThrow
   */
  export type FriendRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * Filter, which FriendRequest to fetch.
     */
    where?: FriendRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FriendRequests to fetch.
     */
    orderBy?: FriendRequestOrderByWithRelationInput | FriendRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FriendRequests.
     */
    cursor?: FriendRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FriendRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FriendRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FriendRequests.
     */
    distinct?: FriendRequestScalarFieldEnum | FriendRequestScalarFieldEnum[]
  }

  /**
   * FriendRequest findMany
   */
  export type FriendRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * Filter, which FriendRequests to fetch.
     */
    where?: FriendRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FriendRequests to fetch.
     */
    orderBy?: FriendRequestOrderByWithRelationInput | FriendRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FriendRequests.
     */
    cursor?: FriendRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FriendRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FriendRequests.
     */
    skip?: number
    distinct?: FriendRequestScalarFieldEnum | FriendRequestScalarFieldEnum[]
  }

  /**
   * FriendRequest create
   */
  export type FriendRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a FriendRequest.
     */
    data: XOR<FriendRequestCreateInput, FriendRequestUncheckedCreateInput>
  }

  /**
   * FriendRequest createMany
   */
  export type FriendRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FriendRequests.
     */
    data: FriendRequestCreateManyInput | FriendRequestCreateManyInput[]
  }

  /**
   * FriendRequest createManyAndReturn
   */
  export type FriendRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * The data used to create many FriendRequests.
     */
    data: FriendRequestCreateManyInput | FriendRequestCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * FriendRequest update
   */
  export type FriendRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a FriendRequest.
     */
    data: XOR<FriendRequestUpdateInput, FriendRequestUncheckedUpdateInput>
    /**
     * Choose, which FriendRequest to update.
     */
    where: FriendRequestWhereUniqueInput
  }

  /**
   * FriendRequest updateMany
   */
  export type FriendRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FriendRequests.
     */
    data: XOR<FriendRequestUpdateManyMutationInput, FriendRequestUncheckedUpdateManyInput>
    /**
     * Filter which FriendRequests to update
     */
    where?: FriendRequestWhereInput
    /**
     * Limit how many FriendRequests to update.
     */
    limit?: number
  }

  /**
   * FriendRequest updateManyAndReturn
   */
  export type FriendRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * The data used to update FriendRequests.
     */
    data: XOR<FriendRequestUpdateManyMutationInput, FriendRequestUncheckedUpdateManyInput>
    /**
     * Filter which FriendRequests to update
     */
    where?: FriendRequestWhereInput
    /**
     * Limit how many FriendRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * FriendRequest upsert
   */
  export type FriendRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the FriendRequest to update in case it exists.
     */
    where: FriendRequestWhereUniqueInput
    /**
     * In case the FriendRequest found by the `where` argument doesn't exist, create a new FriendRequest with this data.
     */
    create: XOR<FriendRequestCreateInput, FriendRequestUncheckedCreateInput>
    /**
     * In case the FriendRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FriendRequestUpdateInput, FriendRequestUncheckedUpdateInput>
  }

  /**
   * FriendRequest delete
   */
  export type FriendRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
    /**
     * Filter which FriendRequest to delete.
     */
    where: FriendRequestWhereUniqueInput
  }

  /**
   * FriendRequest deleteMany
   */
  export type FriendRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FriendRequests to delete
     */
    where?: FriendRequestWhereInput
    /**
     * Limit how many FriendRequests to delete.
     */
    limit?: number
  }

  /**
   * FriendRequest without action
   */
  export type FriendRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FriendRequest
     */
    select?: FriendRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the FriendRequest
     */
    omit?: FriendRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendRequestInclude<ExtArgs> | null
  }


  /**
   * Model Tournament
   */

  export type AggregateTournament = {
    _count: TournamentCountAggregateOutputType | null
    _avg: TournamentAvgAggregateOutputType | null
    _sum: TournamentSumAggregateOutputType | null
    _min: TournamentMinAggregateOutputType | null
    _max: TournamentMaxAggregateOutputType | null
  }

  export type TournamentAvgAggregateOutputType = {
    count_player: number | null
  }

  export type TournamentSumAggregateOutputType = {
    count_player: number | null
  }

  export type TournamentMinAggregateOutputType = {
    id: string | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    count_player: number | null
    result: $Enums.MatchResult | null
  }

  export type TournamentMaxAggregateOutputType = {
    id: string | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    count_player: number | null
    result: $Enums.MatchResult | null
  }

  export type TournamentCountAggregateOutputType = {
    id: number
    CreatedAt: number
    UpdatedAt: number
    count_player: number
    result: number
    _all: number
  }


  export type TournamentAvgAggregateInputType = {
    count_player?: true
  }

  export type TournamentSumAggregateInputType = {
    count_player?: true
  }

  export type TournamentMinAggregateInputType = {
    id?: true
    CreatedAt?: true
    UpdatedAt?: true
    count_player?: true
    result?: true
  }

  export type TournamentMaxAggregateInputType = {
    id?: true
    CreatedAt?: true
    UpdatedAt?: true
    count_player?: true
    result?: true
  }

  export type TournamentCountAggregateInputType = {
    id?: true
    CreatedAt?: true
    UpdatedAt?: true
    count_player?: true
    result?: true
    _all?: true
  }

  export type TournamentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tournament to aggregate.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tournaments
    **/
    _count?: true | TournamentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TournamentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TournamentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TournamentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TournamentMaxAggregateInputType
  }

  export type GetTournamentAggregateType<T extends TournamentAggregateArgs> = {
        [P in keyof T & keyof AggregateTournament]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTournament[P]>
      : GetScalarType<T[P], AggregateTournament[P]>
  }




  export type TournamentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TournamentWhereInput
    orderBy?: TournamentOrderByWithAggregationInput | TournamentOrderByWithAggregationInput[]
    by: TournamentScalarFieldEnum[] | TournamentScalarFieldEnum
    having?: TournamentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TournamentCountAggregateInputType | true
    _avg?: TournamentAvgAggregateInputType
    _sum?: TournamentSumAggregateInputType
    _min?: TournamentMinAggregateInputType
    _max?: TournamentMaxAggregateInputType
  }

  export type TournamentGroupByOutputType = {
    id: string
    CreatedAt: Date
    UpdatedAt: Date
    count_player: number
    result: $Enums.MatchResult
    _count: TournamentCountAggregateOutputType | null
    _avg: TournamentAvgAggregateOutputType | null
    _sum: TournamentSumAggregateOutputType | null
    _min: TournamentMinAggregateOutputType | null
    _max: TournamentMaxAggregateOutputType | null
  }

  type GetTournamentGroupByPayload<T extends TournamentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TournamentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TournamentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TournamentGroupByOutputType[P]>
            : GetScalarType<T[P], TournamentGroupByOutputType[P]>
        }
      >
    >


  export type TournamentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    count_player?: boolean
    result?: boolean
    Participate_Tournament?: boolean | Tournament$Participate_TournamentArgs<ExtArgs>
    Match?: boolean | Tournament$MatchArgs<ExtArgs>
    _count?: boolean | TournamentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tournament"]>

  export type TournamentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    count_player?: boolean
    result?: boolean
  }, ExtArgs["result"]["tournament"]>

  export type TournamentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    count_player?: boolean
    result?: boolean
  }, ExtArgs["result"]["tournament"]>

  export type TournamentSelectScalar = {
    id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    count_player?: boolean
    result?: boolean
  }

  export type TournamentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "CreatedAt" | "UpdatedAt" | "count_player" | "result", ExtArgs["result"]["tournament"]>
  export type TournamentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Participate_Tournament?: boolean | Tournament$Participate_TournamentArgs<ExtArgs>
    Match?: boolean | Tournament$MatchArgs<ExtArgs>
    _count?: boolean | TournamentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TournamentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TournamentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TournamentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tournament"
    objects: {
      Participate_Tournament: Prisma.$Participate_TournamentPayload<ExtArgs>[]
      Match: Prisma.$MatchPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      CreatedAt: Date
      UpdatedAt: Date
      count_player: number
      result: $Enums.MatchResult
    }, ExtArgs["result"]["tournament"]>
    composites: {}
  }

  type TournamentGetPayload<S extends boolean | null | undefined | TournamentDefaultArgs> = $Result.GetResult<Prisma.$TournamentPayload, S>

  type TournamentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TournamentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TournamentCountAggregateInputType | true
    }

  export interface TournamentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tournament'], meta: { name: 'Tournament' } }
    /**
     * Find zero or one Tournament that matches the filter.
     * @param {TournamentFindUniqueArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TournamentFindUniqueArgs>(args: SelectSubset<T, TournamentFindUniqueArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tournament that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TournamentFindUniqueOrThrowArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TournamentFindUniqueOrThrowArgs>(args: SelectSubset<T, TournamentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tournament that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentFindFirstArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TournamentFindFirstArgs>(args?: SelectSubset<T, TournamentFindFirstArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tournament that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentFindFirstOrThrowArgs} args - Arguments to find a Tournament
     * @example
     * // Get one Tournament
     * const tournament = await prisma.tournament.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TournamentFindFirstOrThrowArgs>(args?: SelectSubset<T, TournamentFindFirstOrThrowArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tournaments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tournaments
     * const tournaments = await prisma.tournament.findMany()
     * 
     * // Get first 10 Tournaments
     * const tournaments = await prisma.tournament.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tournamentWithIdOnly = await prisma.tournament.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TournamentFindManyArgs>(args?: SelectSubset<T, TournamentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tournament.
     * @param {TournamentCreateArgs} args - Arguments to create a Tournament.
     * @example
     * // Create one Tournament
     * const Tournament = await prisma.tournament.create({
     *   data: {
     *     // ... data to create a Tournament
     *   }
     * })
     * 
     */
    create<T extends TournamentCreateArgs>(args: SelectSubset<T, TournamentCreateArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tournaments.
     * @param {TournamentCreateManyArgs} args - Arguments to create many Tournaments.
     * @example
     * // Create many Tournaments
     * const tournament = await prisma.tournament.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TournamentCreateManyArgs>(args?: SelectSubset<T, TournamentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tournaments and returns the data saved in the database.
     * @param {TournamentCreateManyAndReturnArgs} args - Arguments to create many Tournaments.
     * @example
     * // Create many Tournaments
     * const tournament = await prisma.tournament.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tournaments and only return the `id`
     * const tournamentWithIdOnly = await prisma.tournament.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TournamentCreateManyAndReturnArgs>(args?: SelectSubset<T, TournamentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Tournament.
     * @param {TournamentDeleteArgs} args - Arguments to delete one Tournament.
     * @example
     * // Delete one Tournament
     * const Tournament = await prisma.tournament.delete({
     *   where: {
     *     // ... filter to delete one Tournament
     *   }
     * })
     * 
     */
    delete<T extends TournamentDeleteArgs>(args: SelectSubset<T, TournamentDeleteArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tournament.
     * @param {TournamentUpdateArgs} args - Arguments to update one Tournament.
     * @example
     * // Update one Tournament
     * const tournament = await prisma.tournament.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TournamentUpdateArgs>(args: SelectSubset<T, TournamentUpdateArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tournaments.
     * @param {TournamentDeleteManyArgs} args - Arguments to filter Tournaments to delete.
     * @example
     * // Delete a few Tournaments
     * const { count } = await prisma.tournament.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TournamentDeleteManyArgs>(args?: SelectSubset<T, TournamentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tournaments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tournaments
     * const tournament = await prisma.tournament.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TournamentUpdateManyArgs>(args: SelectSubset<T, TournamentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tournaments and returns the data updated in the database.
     * @param {TournamentUpdateManyAndReturnArgs} args - Arguments to update many Tournaments.
     * @example
     * // Update many Tournaments
     * const tournament = await prisma.tournament.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tournaments and only return the `id`
     * const tournamentWithIdOnly = await prisma.tournament.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TournamentUpdateManyAndReturnArgs>(args: SelectSubset<T, TournamentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Tournament.
     * @param {TournamentUpsertArgs} args - Arguments to update or create a Tournament.
     * @example
     * // Update or create a Tournament
     * const tournament = await prisma.tournament.upsert({
     *   create: {
     *     // ... data to create a Tournament
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tournament we want to update
     *   }
     * })
     */
    upsert<T extends TournamentUpsertArgs>(args: SelectSubset<T, TournamentUpsertArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tournaments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentCountArgs} args - Arguments to filter Tournaments to count.
     * @example
     * // Count the number of Tournaments
     * const count = await prisma.tournament.count({
     *   where: {
     *     // ... the filter for the Tournaments we want to count
     *   }
     * })
    **/
    count<T extends TournamentCountArgs>(
      args?: Subset<T, TournamentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TournamentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tournament.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TournamentAggregateArgs>(args: Subset<T, TournamentAggregateArgs>): Prisma.PrismaPromise<GetTournamentAggregateType<T>>

    /**
     * Group by Tournament.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TournamentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TournamentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TournamentGroupByArgs['orderBy'] }
        : { orderBy?: TournamentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TournamentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTournamentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tournament model
   */
  readonly fields: TournamentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tournament.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TournamentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Participate_Tournament<T extends Tournament$Participate_TournamentArgs<ExtArgs> = {}>(args?: Subset<T, Tournament$Participate_TournamentArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Match<T extends Tournament$MatchArgs<ExtArgs> = {}>(args?: Subset<T, Tournament$MatchArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tournament model
   */
  interface TournamentFieldRefs {
    readonly id: FieldRef<"Tournament", 'String'>
    readonly CreatedAt: FieldRef<"Tournament", 'DateTime'>
    readonly UpdatedAt: FieldRef<"Tournament", 'DateTime'>
    readonly count_player: FieldRef<"Tournament", 'Int'>
    readonly result: FieldRef<"Tournament", 'MatchResult'>
  }
    

  // Custom InputTypes
  /**
   * Tournament findUnique
   */
  export type TournamentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament findUniqueOrThrow
   */
  export type TournamentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament findFirst
   */
  export type TournamentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tournaments.
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tournaments.
     */
    distinct?: TournamentScalarFieldEnum | TournamentScalarFieldEnum[]
  }

  /**
   * Tournament findFirstOrThrow
   */
  export type TournamentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournament to fetch.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tournaments.
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tournaments.
     */
    distinct?: TournamentScalarFieldEnum | TournamentScalarFieldEnum[]
  }

  /**
   * Tournament findMany
   */
  export type TournamentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Tournaments to fetch.
     */
    where?: TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tournaments to fetch.
     */
    orderBy?: TournamentOrderByWithRelationInput | TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tournaments.
     */
    cursor?: TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tournaments.
     */
    skip?: number
    distinct?: TournamentScalarFieldEnum | TournamentScalarFieldEnum[]
  }

  /**
   * Tournament create
   */
  export type TournamentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * The data needed to create a Tournament.
     */
    data: XOR<TournamentCreateInput, TournamentUncheckedCreateInput>
  }

  /**
   * Tournament createMany
   */
  export type TournamentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tournaments.
     */
    data: TournamentCreateManyInput | TournamentCreateManyInput[]
  }

  /**
   * Tournament createManyAndReturn
   */
  export type TournamentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * The data used to create many Tournaments.
     */
    data: TournamentCreateManyInput | TournamentCreateManyInput[]
  }

  /**
   * Tournament update
   */
  export type TournamentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * The data needed to update a Tournament.
     */
    data: XOR<TournamentUpdateInput, TournamentUncheckedUpdateInput>
    /**
     * Choose, which Tournament to update.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament updateMany
   */
  export type TournamentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tournaments.
     */
    data: XOR<TournamentUpdateManyMutationInput, TournamentUncheckedUpdateManyInput>
    /**
     * Filter which Tournaments to update
     */
    where?: TournamentWhereInput
    /**
     * Limit how many Tournaments to update.
     */
    limit?: number
  }

  /**
   * Tournament updateManyAndReturn
   */
  export type TournamentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * The data used to update Tournaments.
     */
    data: XOR<TournamentUpdateManyMutationInput, TournamentUncheckedUpdateManyInput>
    /**
     * Filter which Tournaments to update
     */
    where?: TournamentWhereInput
    /**
     * Limit how many Tournaments to update.
     */
    limit?: number
  }

  /**
   * Tournament upsert
   */
  export type TournamentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * The filter to search for the Tournament to update in case it exists.
     */
    where: TournamentWhereUniqueInput
    /**
     * In case the Tournament found by the `where` argument doesn't exist, create a new Tournament with this data.
     */
    create: XOR<TournamentCreateInput, TournamentUncheckedCreateInput>
    /**
     * In case the Tournament was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TournamentUpdateInput, TournamentUncheckedUpdateInput>
  }

  /**
   * Tournament delete
   */
  export type TournamentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    /**
     * Filter which Tournament to delete.
     */
    where: TournamentWhereUniqueInput
  }

  /**
   * Tournament deleteMany
   */
  export type TournamentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tournaments to delete
     */
    where?: TournamentWhereInput
    /**
     * Limit how many Tournaments to delete.
     */
    limit?: number
  }

  /**
   * Tournament.Participate_Tournament
   */
  export type Tournament$Participate_TournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    where?: Participate_TournamentWhereInput
    orderBy?: Participate_TournamentOrderByWithRelationInput | Participate_TournamentOrderByWithRelationInput[]
    cursor?: Participate_TournamentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Participate_TournamentScalarFieldEnum | Participate_TournamentScalarFieldEnum[]
  }

  /**
   * Tournament.Match
   */
  export type Tournament$MatchArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    cursor?: MatchWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Tournament without action
   */
  export type TournamentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
  }


  /**
   * Model Participate_Tournament
   */

  export type AggregateParticipate_Tournament = {
    _count: Participate_TournamentCountAggregateOutputType | null
    _min: Participate_TournamentMinAggregateOutputType | null
    _max: Participate_TournamentMaxAggregateOutputType | null
  }

  export type Participate_TournamentMinAggregateOutputType = {
    id: string | null
    P_Id: string | null
    T_Id: string | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    result: $Enums.MatchResult | null
    Winner_Id: string | null
  }

  export type Participate_TournamentMaxAggregateOutputType = {
    id: string | null
    P_Id: string | null
    T_Id: string | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    result: $Enums.MatchResult | null
    Winner_Id: string | null
  }

  export type Participate_TournamentCountAggregateOutputType = {
    id: number
    P_Id: number
    T_Id: number
    CreatedAt: number
    UpdatedAt: number
    result: number
    Winner_Id: number
    _all: number
  }


  export type Participate_TournamentMinAggregateInputType = {
    id?: true
    P_Id?: true
    T_Id?: true
    CreatedAt?: true
    UpdatedAt?: true
    result?: true
    Winner_Id?: true
  }

  export type Participate_TournamentMaxAggregateInputType = {
    id?: true
    P_Id?: true
    T_Id?: true
    CreatedAt?: true
    UpdatedAt?: true
    result?: true
    Winner_Id?: true
  }

  export type Participate_TournamentCountAggregateInputType = {
    id?: true
    P_Id?: true
    T_Id?: true
    CreatedAt?: true
    UpdatedAt?: true
    result?: true
    Winner_Id?: true
    _all?: true
  }

  export type Participate_TournamentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participate_Tournament to aggregate.
     */
    where?: Participate_TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participate_Tournaments to fetch.
     */
    orderBy?: Participate_TournamentOrderByWithRelationInput | Participate_TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: Participate_TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participate_Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participate_Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Participate_Tournaments
    **/
    _count?: true | Participate_TournamentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Participate_TournamentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Participate_TournamentMaxAggregateInputType
  }

  export type GetParticipate_TournamentAggregateType<T extends Participate_TournamentAggregateArgs> = {
        [P in keyof T & keyof AggregateParticipate_Tournament]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateParticipate_Tournament[P]>
      : GetScalarType<T[P], AggregateParticipate_Tournament[P]>
  }




  export type Participate_TournamentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: Participate_TournamentWhereInput
    orderBy?: Participate_TournamentOrderByWithAggregationInput | Participate_TournamentOrderByWithAggregationInput[]
    by: Participate_TournamentScalarFieldEnum[] | Participate_TournamentScalarFieldEnum
    having?: Participate_TournamentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Participate_TournamentCountAggregateInputType | true
    _min?: Participate_TournamentMinAggregateInputType
    _max?: Participate_TournamentMaxAggregateInputType
  }

  export type Participate_TournamentGroupByOutputType = {
    id: string
    P_Id: string
    T_Id: string
    CreatedAt: Date
    UpdatedAt: Date
    result: $Enums.MatchResult
    Winner_Id: string
    _count: Participate_TournamentCountAggregateOutputType | null
    _min: Participate_TournamentMinAggregateOutputType | null
    _max: Participate_TournamentMaxAggregateOutputType | null
  }

  type GetParticipate_TournamentGroupByPayload<T extends Participate_TournamentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Participate_TournamentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Participate_TournamentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Participate_TournamentGroupByOutputType[P]>
            : GetScalarType<T[P], Participate_TournamentGroupByOutputType[P]>
        }
      >
    >


  export type Participate_TournamentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    P_Id?: boolean
    T_Id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
    P?: boolean | UserDefaultArgs<ExtArgs>
    T?: boolean | TournamentDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participate_Tournament"]>

  export type Participate_TournamentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    P_Id?: boolean
    T_Id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
    P?: boolean | UserDefaultArgs<ExtArgs>
    T?: boolean | TournamentDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participate_Tournament"]>

  export type Participate_TournamentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    P_Id?: boolean
    T_Id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
    P?: boolean | UserDefaultArgs<ExtArgs>
    T?: boolean | TournamentDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["participate_Tournament"]>

  export type Participate_TournamentSelectScalar = {
    id?: boolean
    P_Id?: boolean
    T_Id?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
  }

  export type Participate_TournamentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "P_Id" | "T_Id" | "CreatedAt" | "UpdatedAt" | "result" | "Winner_Id", ExtArgs["result"]["participate_Tournament"]>
  export type Participate_TournamentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    P?: boolean | UserDefaultArgs<ExtArgs>
    T?: boolean | TournamentDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type Participate_TournamentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    P?: boolean | UserDefaultArgs<ExtArgs>
    T?: boolean | TournamentDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type Participate_TournamentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    P?: boolean | UserDefaultArgs<ExtArgs>
    T?: boolean | TournamentDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $Participate_TournamentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Participate_Tournament"
    objects: {
      P: Prisma.$UserPayload<ExtArgs>
      T: Prisma.$TournamentPayload<ExtArgs>
      Winner: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      P_Id: string
      T_Id: string
      CreatedAt: Date
      UpdatedAt: Date
      result: $Enums.MatchResult
      Winner_Id: string
    }, ExtArgs["result"]["participate_Tournament"]>
    composites: {}
  }

  type Participate_TournamentGetPayload<S extends boolean | null | undefined | Participate_TournamentDefaultArgs> = $Result.GetResult<Prisma.$Participate_TournamentPayload, S>

  type Participate_TournamentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<Participate_TournamentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Participate_TournamentCountAggregateInputType | true
    }

  export interface Participate_TournamentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Participate_Tournament'], meta: { name: 'Participate_Tournament' } }
    /**
     * Find zero or one Participate_Tournament that matches the filter.
     * @param {Participate_TournamentFindUniqueArgs} args - Arguments to find a Participate_Tournament
     * @example
     * // Get one Participate_Tournament
     * const participate_Tournament = await prisma.participate_Tournament.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends Participate_TournamentFindUniqueArgs>(args: SelectSubset<T, Participate_TournamentFindUniqueArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Participate_Tournament that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {Participate_TournamentFindUniqueOrThrowArgs} args - Arguments to find a Participate_Tournament
     * @example
     * // Get one Participate_Tournament
     * const participate_Tournament = await prisma.participate_Tournament.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends Participate_TournamentFindUniqueOrThrowArgs>(args: SelectSubset<T, Participate_TournamentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participate_Tournament that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Participate_TournamentFindFirstArgs} args - Arguments to find a Participate_Tournament
     * @example
     * // Get one Participate_Tournament
     * const participate_Tournament = await prisma.participate_Tournament.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends Participate_TournamentFindFirstArgs>(args?: SelectSubset<T, Participate_TournamentFindFirstArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Participate_Tournament that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Participate_TournamentFindFirstOrThrowArgs} args - Arguments to find a Participate_Tournament
     * @example
     * // Get one Participate_Tournament
     * const participate_Tournament = await prisma.participate_Tournament.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends Participate_TournamentFindFirstOrThrowArgs>(args?: SelectSubset<T, Participate_TournamentFindFirstOrThrowArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Participate_Tournaments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Participate_TournamentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Participate_Tournaments
     * const participate_Tournaments = await prisma.participate_Tournament.findMany()
     * 
     * // Get first 10 Participate_Tournaments
     * const participate_Tournaments = await prisma.participate_Tournament.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const participate_TournamentWithIdOnly = await prisma.participate_Tournament.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends Participate_TournamentFindManyArgs>(args?: SelectSubset<T, Participate_TournamentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Participate_Tournament.
     * @param {Participate_TournamentCreateArgs} args - Arguments to create a Participate_Tournament.
     * @example
     * // Create one Participate_Tournament
     * const Participate_Tournament = await prisma.participate_Tournament.create({
     *   data: {
     *     // ... data to create a Participate_Tournament
     *   }
     * })
     * 
     */
    create<T extends Participate_TournamentCreateArgs>(args: SelectSubset<T, Participate_TournamentCreateArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Participate_Tournaments.
     * @param {Participate_TournamentCreateManyArgs} args - Arguments to create many Participate_Tournaments.
     * @example
     * // Create many Participate_Tournaments
     * const participate_Tournament = await prisma.participate_Tournament.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends Participate_TournamentCreateManyArgs>(args?: SelectSubset<T, Participate_TournamentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Participate_Tournaments and returns the data saved in the database.
     * @param {Participate_TournamentCreateManyAndReturnArgs} args - Arguments to create many Participate_Tournaments.
     * @example
     * // Create many Participate_Tournaments
     * const participate_Tournament = await prisma.participate_Tournament.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Participate_Tournaments and only return the `id`
     * const participate_TournamentWithIdOnly = await prisma.participate_Tournament.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends Participate_TournamentCreateManyAndReturnArgs>(args?: SelectSubset<T, Participate_TournamentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Participate_Tournament.
     * @param {Participate_TournamentDeleteArgs} args - Arguments to delete one Participate_Tournament.
     * @example
     * // Delete one Participate_Tournament
     * const Participate_Tournament = await prisma.participate_Tournament.delete({
     *   where: {
     *     // ... filter to delete one Participate_Tournament
     *   }
     * })
     * 
     */
    delete<T extends Participate_TournamentDeleteArgs>(args: SelectSubset<T, Participate_TournamentDeleteArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Participate_Tournament.
     * @param {Participate_TournamentUpdateArgs} args - Arguments to update one Participate_Tournament.
     * @example
     * // Update one Participate_Tournament
     * const participate_Tournament = await prisma.participate_Tournament.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends Participate_TournamentUpdateArgs>(args: SelectSubset<T, Participate_TournamentUpdateArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Participate_Tournaments.
     * @param {Participate_TournamentDeleteManyArgs} args - Arguments to filter Participate_Tournaments to delete.
     * @example
     * // Delete a few Participate_Tournaments
     * const { count } = await prisma.participate_Tournament.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends Participate_TournamentDeleteManyArgs>(args?: SelectSubset<T, Participate_TournamentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participate_Tournaments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Participate_TournamentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Participate_Tournaments
     * const participate_Tournament = await prisma.participate_Tournament.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends Participate_TournamentUpdateManyArgs>(args: SelectSubset<T, Participate_TournamentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Participate_Tournaments and returns the data updated in the database.
     * @param {Participate_TournamentUpdateManyAndReturnArgs} args - Arguments to update many Participate_Tournaments.
     * @example
     * // Update many Participate_Tournaments
     * const participate_Tournament = await prisma.participate_Tournament.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Participate_Tournaments and only return the `id`
     * const participate_TournamentWithIdOnly = await prisma.participate_Tournament.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends Participate_TournamentUpdateManyAndReturnArgs>(args: SelectSubset<T, Participate_TournamentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Participate_Tournament.
     * @param {Participate_TournamentUpsertArgs} args - Arguments to update or create a Participate_Tournament.
     * @example
     * // Update or create a Participate_Tournament
     * const participate_Tournament = await prisma.participate_Tournament.upsert({
     *   create: {
     *     // ... data to create a Participate_Tournament
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Participate_Tournament we want to update
     *   }
     * })
     */
    upsert<T extends Participate_TournamentUpsertArgs>(args: SelectSubset<T, Participate_TournamentUpsertArgs<ExtArgs>>): Prisma__Participate_TournamentClient<$Result.GetResult<Prisma.$Participate_TournamentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Participate_Tournaments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Participate_TournamentCountArgs} args - Arguments to filter Participate_Tournaments to count.
     * @example
     * // Count the number of Participate_Tournaments
     * const count = await prisma.participate_Tournament.count({
     *   where: {
     *     // ... the filter for the Participate_Tournaments we want to count
     *   }
     * })
    **/
    count<T extends Participate_TournamentCountArgs>(
      args?: Subset<T, Participate_TournamentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Participate_TournamentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Participate_Tournament.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Participate_TournamentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Participate_TournamentAggregateArgs>(args: Subset<T, Participate_TournamentAggregateArgs>): Prisma.PrismaPromise<GetParticipate_TournamentAggregateType<T>>

    /**
     * Group by Participate_Tournament.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Participate_TournamentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends Participate_TournamentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: Participate_TournamentGroupByArgs['orderBy'] }
        : { orderBy?: Participate_TournamentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, Participate_TournamentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetParticipate_TournamentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Participate_Tournament model
   */
  readonly fields: Participate_TournamentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Participate_Tournament.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__Participate_TournamentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    P<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    T<T extends TournamentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TournamentDefaultArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Winner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Participate_Tournament model
   */
  interface Participate_TournamentFieldRefs {
    readonly id: FieldRef<"Participate_Tournament", 'String'>
    readonly P_Id: FieldRef<"Participate_Tournament", 'String'>
    readonly T_Id: FieldRef<"Participate_Tournament", 'String'>
    readonly CreatedAt: FieldRef<"Participate_Tournament", 'DateTime'>
    readonly UpdatedAt: FieldRef<"Participate_Tournament", 'DateTime'>
    readonly result: FieldRef<"Participate_Tournament", 'MatchResult'>
    readonly Winner_Id: FieldRef<"Participate_Tournament", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Participate_Tournament findUnique
   */
  export type Participate_TournamentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Participate_Tournament to fetch.
     */
    where: Participate_TournamentWhereUniqueInput
  }

  /**
   * Participate_Tournament findUniqueOrThrow
   */
  export type Participate_TournamentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Participate_Tournament to fetch.
     */
    where: Participate_TournamentWhereUniqueInput
  }

  /**
   * Participate_Tournament findFirst
   */
  export type Participate_TournamentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Participate_Tournament to fetch.
     */
    where?: Participate_TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participate_Tournaments to fetch.
     */
    orderBy?: Participate_TournamentOrderByWithRelationInput | Participate_TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participate_Tournaments.
     */
    cursor?: Participate_TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participate_Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participate_Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participate_Tournaments.
     */
    distinct?: Participate_TournamentScalarFieldEnum | Participate_TournamentScalarFieldEnum[]
  }

  /**
   * Participate_Tournament findFirstOrThrow
   */
  export type Participate_TournamentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Participate_Tournament to fetch.
     */
    where?: Participate_TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participate_Tournaments to fetch.
     */
    orderBy?: Participate_TournamentOrderByWithRelationInput | Participate_TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Participate_Tournaments.
     */
    cursor?: Participate_TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participate_Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participate_Tournaments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Participate_Tournaments.
     */
    distinct?: Participate_TournamentScalarFieldEnum | Participate_TournamentScalarFieldEnum[]
  }

  /**
   * Participate_Tournament findMany
   */
  export type Participate_TournamentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * Filter, which Participate_Tournaments to fetch.
     */
    where?: Participate_TournamentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Participate_Tournaments to fetch.
     */
    orderBy?: Participate_TournamentOrderByWithRelationInput | Participate_TournamentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Participate_Tournaments.
     */
    cursor?: Participate_TournamentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Participate_Tournaments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Participate_Tournaments.
     */
    skip?: number
    distinct?: Participate_TournamentScalarFieldEnum | Participate_TournamentScalarFieldEnum[]
  }

  /**
   * Participate_Tournament create
   */
  export type Participate_TournamentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * The data needed to create a Participate_Tournament.
     */
    data: XOR<Participate_TournamentCreateInput, Participate_TournamentUncheckedCreateInput>
  }

  /**
   * Participate_Tournament createMany
   */
  export type Participate_TournamentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Participate_Tournaments.
     */
    data: Participate_TournamentCreateManyInput | Participate_TournamentCreateManyInput[]
  }

  /**
   * Participate_Tournament createManyAndReturn
   */
  export type Participate_TournamentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * The data used to create many Participate_Tournaments.
     */
    data: Participate_TournamentCreateManyInput | Participate_TournamentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Participate_Tournament update
   */
  export type Participate_TournamentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * The data needed to update a Participate_Tournament.
     */
    data: XOR<Participate_TournamentUpdateInput, Participate_TournamentUncheckedUpdateInput>
    /**
     * Choose, which Participate_Tournament to update.
     */
    where: Participate_TournamentWhereUniqueInput
  }

  /**
   * Participate_Tournament updateMany
   */
  export type Participate_TournamentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Participate_Tournaments.
     */
    data: XOR<Participate_TournamentUpdateManyMutationInput, Participate_TournamentUncheckedUpdateManyInput>
    /**
     * Filter which Participate_Tournaments to update
     */
    where?: Participate_TournamentWhereInput
    /**
     * Limit how many Participate_Tournaments to update.
     */
    limit?: number
  }

  /**
   * Participate_Tournament updateManyAndReturn
   */
  export type Participate_TournamentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * The data used to update Participate_Tournaments.
     */
    data: XOR<Participate_TournamentUpdateManyMutationInput, Participate_TournamentUncheckedUpdateManyInput>
    /**
     * Filter which Participate_Tournaments to update
     */
    where?: Participate_TournamentWhereInput
    /**
     * Limit how many Participate_Tournaments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Participate_Tournament upsert
   */
  export type Participate_TournamentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * The filter to search for the Participate_Tournament to update in case it exists.
     */
    where: Participate_TournamentWhereUniqueInput
    /**
     * In case the Participate_Tournament found by the `where` argument doesn't exist, create a new Participate_Tournament with this data.
     */
    create: XOR<Participate_TournamentCreateInput, Participate_TournamentUncheckedCreateInput>
    /**
     * In case the Participate_Tournament was found with the provided `where` argument, update it with this data.
     */
    update: XOR<Participate_TournamentUpdateInput, Participate_TournamentUncheckedUpdateInput>
  }

  /**
   * Participate_Tournament delete
   */
  export type Participate_TournamentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
    /**
     * Filter which Participate_Tournament to delete.
     */
    where: Participate_TournamentWhereUniqueInput
  }

  /**
   * Participate_Tournament deleteMany
   */
  export type Participate_TournamentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Participate_Tournaments to delete
     */
    where?: Participate_TournamentWhereInput
    /**
     * Limit how many Participate_Tournaments to delete.
     */
    limit?: number
  }

  /**
   * Participate_Tournament without action
   */
  export type Participate_TournamentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Participate_Tournament
     */
    select?: Participate_TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Participate_Tournament
     */
    omit?: Participate_TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Participate_TournamentInclude<ExtArgs> | null
  }


  /**
   * Model Match
   */

  export type AggregateMatch = {
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  export type MatchAvgAggregateOutputType = {
    Ball_x: number | null
    Ball_y: number | null
  }

  export type MatchSumAggregateOutputType = {
    Ball_x: number | null
    Ball_y: number | null
  }

  export type MatchMinAggregateOutputType = {
    id: string | null
    P1_Id: string | null
    P2_Id: string | null
    Ball_x: number | null
    Ball_y: number | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    result: $Enums.MatchResult | null
    Winner_Id: string | null
    tournamentId: string | null
  }

  export type MatchMaxAggregateOutputType = {
    id: string | null
    P1_Id: string | null
    P2_Id: string | null
    Ball_x: number | null
    Ball_y: number | null
    CreatedAt: Date | null
    UpdatedAt: Date | null
    result: $Enums.MatchResult | null
    Winner_Id: string | null
    tournamentId: string | null
  }

  export type MatchCountAggregateOutputType = {
    id: number
    P1_Id: number
    P2_Id: number
    Ball_x: number
    Ball_y: number
    CreatedAt: number
    UpdatedAt: number
    result: number
    Winner_Id: number
    tournamentId: number
    _all: number
  }


  export type MatchAvgAggregateInputType = {
    Ball_x?: true
    Ball_y?: true
  }

  export type MatchSumAggregateInputType = {
    Ball_x?: true
    Ball_y?: true
  }

  export type MatchMinAggregateInputType = {
    id?: true
    P1_Id?: true
    P2_Id?: true
    Ball_x?: true
    Ball_y?: true
    CreatedAt?: true
    UpdatedAt?: true
    result?: true
    Winner_Id?: true
    tournamentId?: true
  }

  export type MatchMaxAggregateInputType = {
    id?: true
    P1_Id?: true
    P2_Id?: true
    Ball_x?: true
    Ball_y?: true
    CreatedAt?: true
    UpdatedAt?: true
    result?: true
    Winner_Id?: true
    tournamentId?: true
  }

  export type MatchCountAggregateInputType = {
    id?: true
    P1_Id?: true
    P2_Id?: true
    Ball_x?: true
    Ball_y?: true
    CreatedAt?: true
    UpdatedAt?: true
    result?: true
    Winner_Id?: true
    tournamentId?: true
    _all?: true
  }

  export type MatchAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Match to aggregate.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Matches
    **/
    _count?: true | MatchCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MatchAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MatchSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MatchMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MatchMaxAggregateInputType
  }

  export type GetMatchAggregateType<T extends MatchAggregateArgs> = {
        [P in keyof T & keyof AggregateMatch]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMatch[P]>
      : GetScalarType<T[P], AggregateMatch[P]>
  }




  export type MatchGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MatchWhereInput
    orderBy?: MatchOrderByWithAggregationInput | MatchOrderByWithAggregationInput[]
    by: MatchScalarFieldEnum[] | MatchScalarFieldEnum
    having?: MatchScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MatchCountAggregateInputType | true
    _avg?: MatchAvgAggregateInputType
    _sum?: MatchSumAggregateInputType
    _min?: MatchMinAggregateInputType
    _max?: MatchMaxAggregateInputType
  }

  export type MatchGroupByOutputType = {
    id: string
    P1_Id: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt: Date
    UpdatedAt: Date
    result: $Enums.MatchResult
    Winner_Id: string
    tournamentId: string | null
    _count: MatchCountAggregateOutputType | null
    _avg: MatchAvgAggregateOutputType | null
    _sum: MatchSumAggregateOutputType | null
    _min: MatchMinAggregateOutputType | null
    _max: MatchMaxAggregateOutputType | null
  }

  type GetMatchGroupByPayload<T extends MatchGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MatchGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MatchGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MatchGroupByOutputType[P]>
            : GetScalarType<T[P], MatchGroupByOutputType[P]>
        }
      >
    >


  export type MatchSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    P1_Id?: boolean
    P2_Id?: boolean
    Ball_x?: boolean
    Ball_y?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
    tournamentId?: boolean
    P1?: boolean | UserDefaultArgs<ExtArgs>
    P2?: boolean | UserDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
    Tournament?: boolean | Match$TournamentArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    P1_Id?: boolean
    P2_Id?: boolean
    Ball_x?: boolean
    Ball_y?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
    tournamentId?: boolean
    P1?: boolean | UserDefaultArgs<ExtArgs>
    P2?: boolean | UserDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
    Tournament?: boolean | Match$TournamentArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    P1_Id?: boolean
    P2_Id?: boolean
    Ball_x?: boolean
    Ball_y?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
    tournamentId?: boolean
    P1?: boolean | UserDefaultArgs<ExtArgs>
    P2?: boolean | UserDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
    Tournament?: boolean | Match$TournamentArgs<ExtArgs>
  }, ExtArgs["result"]["match"]>

  export type MatchSelectScalar = {
    id?: boolean
    P1_Id?: boolean
    P2_Id?: boolean
    Ball_x?: boolean
    Ball_y?: boolean
    CreatedAt?: boolean
    UpdatedAt?: boolean
    result?: boolean
    Winner_Id?: boolean
    tournamentId?: boolean
  }

  export type MatchOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "P1_Id" | "P2_Id" | "Ball_x" | "Ball_y" | "CreatedAt" | "UpdatedAt" | "result" | "Winner_Id" | "tournamentId", ExtArgs["result"]["match"]>
  export type MatchInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    P1?: boolean | UserDefaultArgs<ExtArgs>
    P2?: boolean | UserDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
    Tournament?: boolean | Match$TournamentArgs<ExtArgs>
  }
  export type MatchIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    P1?: boolean | UserDefaultArgs<ExtArgs>
    P2?: boolean | UserDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
    Tournament?: boolean | Match$TournamentArgs<ExtArgs>
  }
  export type MatchIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    P1?: boolean | UserDefaultArgs<ExtArgs>
    P2?: boolean | UserDefaultArgs<ExtArgs>
    Winner?: boolean | UserDefaultArgs<ExtArgs>
    Tournament?: boolean | Match$TournamentArgs<ExtArgs>
  }

  export type $MatchPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Match"
    objects: {
      P1: Prisma.$UserPayload<ExtArgs>
      P2: Prisma.$UserPayload<ExtArgs>
      Winner: Prisma.$UserPayload<ExtArgs>
      Tournament: Prisma.$TournamentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      P1_Id: string
      P2_Id: string
      Ball_x: number
      Ball_y: number
      CreatedAt: Date
      UpdatedAt: Date
      result: $Enums.MatchResult
      Winner_Id: string
      tournamentId: string | null
    }, ExtArgs["result"]["match"]>
    composites: {}
  }

  type MatchGetPayload<S extends boolean | null | undefined | MatchDefaultArgs> = $Result.GetResult<Prisma.$MatchPayload, S>

  type MatchCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MatchCountAggregateInputType | true
    }

  export interface MatchDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Match'], meta: { name: 'Match' } }
    /**
     * Find zero or one Match that matches the filter.
     * @param {MatchFindUniqueArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MatchFindUniqueArgs>(args: SelectSubset<T, MatchFindUniqueArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Match that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MatchFindUniqueOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MatchFindUniqueOrThrowArgs>(args: SelectSubset<T, MatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MatchFindFirstArgs>(args?: SelectSubset<T, MatchFindFirstArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Match that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindFirstOrThrowArgs} args - Arguments to find a Match
     * @example
     * // Get one Match
     * const match = await prisma.match.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MatchFindFirstOrThrowArgs>(args?: SelectSubset<T, MatchFindFirstOrThrowArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Matches that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Matches
     * const matches = await prisma.match.findMany()
     * 
     * // Get first 10 Matches
     * const matches = await prisma.match.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const matchWithIdOnly = await prisma.match.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MatchFindManyArgs>(args?: SelectSubset<T, MatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Match.
     * @param {MatchCreateArgs} args - Arguments to create a Match.
     * @example
     * // Create one Match
     * const Match = await prisma.match.create({
     *   data: {
     *     // ... data to create a Match
     *   }
     * })
     * 
     */
    create<T extends MatchCreateArgs>(args: SelectSubset<T, MatchCreateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Matches.
     * @param {MatchCreateManyArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MatchCreateManyArgs>(args?: SelectSubset<T, MatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Matches and returns the data saved in the database.
     * @param {MatchCreateManyAndReturnArgs} args - Arguments to create many Matches.
     * @example
     * // Create many Matches
     * const match = await prisma.match.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MatchCreateManyAndReturnArgs>(args?: SelectSubset<T, MatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Match.
     * @param {MatchDeleteArgs} args - Arguments to delete one Match.
     * @example
     * // Delete one Match
     * const Match = await prisma.match.delete({
     *   where: {
     *     // ... filter to delete one Match
     *   }
     * })
     * 
     */
    delete<T extends MatchDeleteArgs>(args: SelectSubset<T, MatchDeleteArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Match.
     * @param {MatchUpdateArgs} args - Arguments to update one Match.
     * @example
     * // Update one Match
     * const match = await prisma.match.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MatchUpdateArgs>(args: SelectSubset<T, MatchUpdateArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Matches.
     * @param {MatchDeleteManyArgs} args - Arguments to filter Matches to delete.
     * @example
     * // Delete a few Matches
     * const { count } = await prisma.match.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MatchDeleteManyArgs>(args?: SelectSubset<T, MatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MatchUpdateManyArgs>(args: SelectSubset<T, MatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Matches and returns the data updated in the database.
     * @param {MatchUpdateManyAndReturnArgs} args - Arguments to update many Matches.
     * @example
     * // Update many Matches
     * const match = await prisma.match.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Matches and only return the `id`
     * const matchWithIdOnly = await prisma.match.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MatchUpdateManyAndReturnArgs>(args: SelectSubset<T, MatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Match.
     * @param {MatchUpsertArgs} args - Arguments to update or create a Match.
     * @example
     * // Update or create a Match
     * const match = await prisma.match.upsert({
     *   create: {
     *     // ... data to create a Match
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Match we want to update
     *   }
     * })
     */
    upsert<T extends MatchUpsertArgs>(args: SelectSubset<T, MatchUpsertArgs<ExtArgs>>): Prisma__MatchClient<$Result.GetResult<Prisma.$MatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Matches.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchCountArgs} args - Arguments to filter Matches to count.
     * @example
     * // Count the number of Matches
     * const count = await prisma.match.count({
     *   where: {
     *     // ... the filter for the Matches we want to count
     *   }
     * })
    **/
    count<T extends MatchCountArgs>(
      args?: Subset<T, MatchCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MatchCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MatchAggregateArgs>(args: Subset<T, MatchAggregateArgs>): Prisma.PrismaPromise<GetMatchAggregateType<T>>

    /**
     * Group by Match.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MatchGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MatchGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MatchGroupByArgs['orderBy'] }
        : { orderBy?: MatchGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Match model
   */
  readonly fields: MatchFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Match.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MatchClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    P1<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    P2<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Winner<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Tournament<T extends Match$TournamentArgs<ExtArgs> = {}>(args?: Subset<T, Match$TournamentArgs<ExtArgs>>): Prisma__TournamentClient<$Result.GetResult<Prisma.$TournamentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Match model
   */
  interface MatchFieldRefs {
    readonly id: FieldRef<"Match", 'String'>
    readonly P1_Id: FieldRef<"Match", 'String'>
    readonly P2_Id: FieldRef<"Match", 'String'>
    readonly Ball_x: FieldRef<"Match", 'Float'>
    readonly Ball_y: FieldRef<"Match", 'Float'>
    readonly CreatedAt: FieldRef<"Match", 'DateTime'>
    readonly UpdatedAt: FieldRef<"Match", 'DateTime'>
    readonly result: FieldRef<"Match", 'MatchResult'>
    readonly Winner_Id: FieldRef<"Match", 'String'>
    readonly tournamentId: FieldRef<"Match", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Match findUnique
   */
  export type MatchFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findUniqueOrThrow
   */
  export type MatchFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match findFirst
   */
  export type MatchFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findFirstOrThrow
   */
  export type MatchFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Match to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Matches.
     */
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match findMany
   */
  export type MatchFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter, which Matches to fetch.
     */
    where?: MatchWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Matches to fetch.
     */
    orderBy?: MatchOrderByWithRelationInput | MatchOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Matches.
     */
    cursor?: MatchWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Matches from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Matches.
     */
    skip?: number
    distinct?: MatchScalarFieldEnum | MatchScalarFieldEnum[]
  }

  /**
   * Match create
   */
  export type MatchCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to create a Match.
     */
    data: XOR<MatchCreateInput, MatchUncheckedCreateInput>
  }

  /**
   * Match createMany
   */
  export type MatchCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
  }

  /**
   * Match createManyAndReturn
   */
  export type MatchCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to create many Matches.
     */
    data: MatchCreateManyInput | MatchCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match update
   */
  export type MatchUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The data needed to update a Match.
     */
    data: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
    /**
     * Choose, which Match to update.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match updateMany
   */
  export type MatchUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
  }

  /**
   * Match updateManyAndReturn
   */
  export type MatchUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * The data used to update Matches.
     */
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyInput>
    /**
     * Filter which Matches to update
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Match upsert
   */
  export type MatchUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * The filter to search for the Match to update in case it exists.
     */
    where: MatchWhereUniqueInput
    /**
     * In case the Match found by the `where` argument doesn't exist, create a new Match with this data.
     */
    create: XOR<MatchCreateInput, MatchUncheckedCreateInput>
    /**
     * In case the Match was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MatchUpdateInput, MatchUncheckedUpdateInput>
  }

  /**
   * Match delete
   */
  export type MatchDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
    /**
     * Filter which Match to delete.
     */
    where: MatchWhereUniqueInput
  }

  /**
   * Match deleteMany
   */
  export type MatchDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Matches to delete
     */
    where?: MatchWhereInput
    /**
     * Limit how many Matches to delete.
     */
    limit?: number
  }

  /**
   * Match.Tournament
   */
  export type Match$TournamentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tournament
     */
    select?: TournamentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tournament
     */
    omit?: TournamentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TournamentInclude<ExtArgs> | null
    where?: TournamentWhereInput
  }

  /**
   * Match without action
   */
  export type MatchDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Match
     */
    select?: MatchSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Match
     */
    omit?: MatchOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MatchInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    password: 'password',
    loggedIn: 'loggedIn',
    isOnline: 'isOnline',
    avatar: 'avatar'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const FriendRequestScalarFieldEnum: {
    id: 'id',
    senderId: 'senderId',
    receiverId: 'receiverId',
    status: 'status',
    CreatedAt: 'CreatedAt',
    UpdatedAt: 'UpdatedAt'
  };

  export type FriendRequestScalarFieldEnum = (typeof FriendRequestScalarFieldEnum)[keyof typeof FriendRequestScalarFieldEnum]


  export const TournamentScalarFieldEnum: {
    id: 'id',
    CreatedAt: 'CreatedAt',
    UpdatedAt: 'UpdatedAt',
    count_player: 'count_player',
    result: 'result'
  };

  export type TournamentScalarFieldEnum = (typeof TournamentScalarFieldEnum)[keyof typeof TournamentScalarFieldEnum]


  export const Participate_TournamentScalarFieldEnum: {
    id: 'id',
    P_Id: 'P_Id',
    T_Id: 'T_Id',
    CreatedAt: 'CreatedAt',
    UpdatedAt: 'UpdatedAt',
    result: 'result',
    Winner_Id: 'Winner_Id'
  };

  export type Participate_TournamentScalarFieldEnum = (typeof Participate_TournamentScalarFieldEnum)[keyof typeof Participate_TournamentScalarFieldEnum]


  export const MatchScalarFieldEnum: {
    id: 'id',
    P1_Id: 'P1_Id',
    P2_Id: 'P2_Id',
    Ball_x: 'Ball_x',
    Ball_y: 'Ball_y',
    CreatedAt: 'CreatedAt',
    UpdatedAt: 'UpdatedAt',
    result: 'result',
    Winner_Id: 'Winner_Id',
    tournamentId: 'tournamentId'
  };

  export type MatchScalarFieldEnum = (typeof MatchScalarFieldEnum)[keyof typeof MatchScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'FriendRequestStatus'
   */
  export type EnumFriendRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendRequestStatus'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'MatchResult'
   */
  export type EnumMatchResultFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MatchResult'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    password?: StringFilter<"User"> | string
    loggedIn?: BoolFilter<"User"> | boolean
    isOnline?: BoolFilter<"User"> | boolean
    avatar?: StringNullableFilter<"User"> | string | null
    sentRequests?: FriendRequestListRelationFilter
    receivedRequests?: FriendRequestListRelationFilter
    Participate_Tournament?: Participate_TournamentListRelationFilter
    Win_Tournament?: Participate_TournamentListRelationFilter
    Match1?: MatchListRelationFilter
    Match2?: MatchListRelationFilter
    Matchw?: MatchListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    loggedIn?: SortOrder
    isOnline?: SortOrder
    avatar?: SortOrderInput | SortOrder
    sentRequests?: FriendRequestOrderByRelationAggregateInput
    receivedRequests?: FriendRequestOrderByRelationAggregateInput
    Participate_Tournament?: Participate_TournamentOrderByRelationAggregateInput
    Win_Tournament?: Participate_TournamentOrderByRelationAggregateInput
    Match1?: MatchOrderByRelationAggregateInput
    Match2?: MatchOrderByRelationAggregateInput
    Matchw?: MatchOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    name?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    loggedIn?: BoolFilter<"User"> | boolean
    isOnline?: BoolFilter<"User"> | boolean
    avatar?: StringNullableFilter<"User"> | string | null
    sentRequests?: FriendRequestListRelationFilter
    receivedRequests?: FriendRequestListRelationFilter
    Participate_Tournament?: Participate_TournamentListRelationFilter
    Win_Tournament?: Participate_TournamentListRelationFilter
    Match1?: MatchListRelationFilter
    Match2?: MatchListRelationFilter
    Matchw?: MatchListRelationFilter
  }, "id" | "email" | "name">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    password?: SortOrder
    loggedIn?: SortOrder
    isOnline?: SortOrder
    avatar?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringWithAggregatesFilter<"User"> | string
    loggedIn?: BoolWithAggregatesFilter<"User"> | boolean
    isOnline?: BoolWithAggregatesFilter<"User"> | boolean
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type FriendRequestWhereInput = {
    AND?: FriendRequestWhereInput | FriendRequestWhereInput[]
    OR?: FriendRequestWhereInput[]
    NOT?: FriendRequestWhereInput | FriendRequestWhereInput[]
    id?: StringFilter<"FriendRequest"> | string
    senderId?: StringFilter<"FriendRequest"> | string
    receiverId?: StringFilter<"FriendRequest"> | string
    status?: EnumFriendRequestStatusFilter<"FriendRequest"> | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFilter<"FriendRequest"> | Date | string
    UpdatedAt?: DateTimeFilter<"FriendRequest"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FriendRequestOrderByWithRelationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    sender?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
  }

  export type FriendRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    senderId_receiverId?: FriendRequestSenderIdReceiverIdCompoundUniqueInput
    AND?: FriendRequestWhereInput | FriendRequestWhereInput[]
    OR?: FriendRequestWhereInput[]
    NOT?: FriendRequestWhereInput | FriendRequestWhereInput[]
    senderId?: StringFilter<"FriendRequest"> | string
    receiverId?: StringFilter<"FriendRequest"> | string
    status?: EnumFriendRequestStatusFilter<"FriendRequest"> | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFilter<"FriendRequest"> | Date | string
    UpdatedAt?: DateTimeFilter<"FriendRequest"> | Date | string
    sender?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "senderId_receiverId">

  export type FriendRequestOrderByWithAggregationInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    _count?: FriendRequestCountOrderByAggregateInput
    _max?: FriendRequestMaxOrderByAggregateInput
    _min?: FriendRequestMinOrderByAggregateInput
  }

  export type FriendRequestScalarWhereWithAggregatesInput = {
    AND?: FriendRequestScalarWhereWithAggregatesInput | FriendRequestScalarWhereWithAggregatesInput[]
    OR?: FriendRequestScalarWhereWithAggregatesInput[]
    NOT?: FriendRequestScalarWhereWithAggregatesInput | FriendRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FriendRequest"> | string
    senderId?: StringWithAggregatesFilter<"FriendRequest"> | string
    receiverId?: StringWithAggregatesFilter<"FriendRequest"> | string
    status?: EnumFriendRequestStatusWithAggregatesFilter<"FriendRequest"> | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeWithAggregatesFilter<"FriendRequest"> | Date | string
    UpdatedAt?: DateTimeWithAggregatesFilter<"FriendRequest"> | Date | string
  }

  export type TournamentWhereInput = {
    AND?: TournamentWhereInput | TournamentWhereInput[]
    OR?: TournamentWhereInput[]
    NOT?: TournamentWhereInput | TournamentWhereInput[]
    id?: StringFilter<"Tournament"> | string
    CreatedAt?: DateTimeFilter<"Tournament"> | Date | string
    UpdatedAt?: DateTimeFilter<"Tournament"> | Date | string
    count_player?: IntFilter<"Tournament"> | number
    result?: EnumMatchResultFilter<"Tournament"> | $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentListRelationFilter
    Match?: MatchListRelationFilter
  }

  export type TournamentOrderByWithRelationInput = {
    id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    count_player?: SortOrder
    result?: SortOrder
    Participate_Tournament?: Participate_TournamentOrderByRelationAggregateInput
    Match?: MatchOrderByRelationAggregateInput
  }

  export type TournamentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TournamentWhereInput | TournamentWhereInput[]
    OR?: TournamentWhereInput[]
    NOT?: TournamentWhereInput | TournamentWhereInput[]
    CreatedAt?: DateTimeFilter<"Tournament"> | Date | string
    UpdatedAt?: DateTimeFilter<"Tournament"> | Date | string
    count_player?: IntFilter<"Tournament"> | number
    result?: EnumMatchResultFilter<"Tournament"> | $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentListRelationFilter
    Match?: MatchListRelationFilter
  }, "id">

  export type TournamentOrderByWithAggregationInput = {
    id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    count_player?: SortOrder
    result?: SortOrder
    _count?: TournamentCountOrderByAggregateInput
    _avg?: TournamentAvgOrderByAggregateInput
    _max?: TournamentMaxOrderByAggregateInput
    _min?: TournamentMinOrderByAggregateInput
    _sum?: TournamentSumOrderByAggregateInput
  }

  export type TournamentScalarWhereWithAggregatesInput = {
    AND?: TournamentScalarWhereWithAggregatesInput | TournamentScalarWhereWithAggregatesInput[]
    OR?: TournamentScalarWhereWithAggregatesInput[]
    NOT?: TournamentScalarWhereWithAggregatesInput | TournamentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tournament"> | string
    CreatedAt?: DateTimeWithAggregatesFilter<"Tournament"> | Date | string
    UpdatedAt?: DateTimeWithAggregatesFilter<"Tournament"> | Date | string
    count_player?: IntWithAggregatesFilter<"Tournament"> | number
    result?: EnumMatchResultWithAggregatesFilter<"Tournament"> | $Enums.MatchResult
  }

  export type Participate_TournamentWhereInput = {
    AND?: Participate_TournamentWhereInput | Participate_TournamentWhereInput[]
    OR?: Participate_TournamentWhereInput[]
    NOT?: Participate_TournamentWhereInput | Participate_TournamentWhereInput[]
    id?: StringFilter<"Participate_Tournament"> | string
    P_Id?: StringFilter<"Participate_Tournament"> | string
    T_Id?: StringFilter<"Participate_Tournament"> | string
    CreatedAt?: DateTimeFilter<"Participate_Tournament"> | Date | string
    UpdatedAt?: DateTimeFilter<"Participate_Tournament"> | Date | string
    result?: EnumMatchResultFilter<"Participate_Tournament"> | $Enums.MatchResult
    Winner_Id?: StringFilter<"Participate_Tournament"> | string
    P?: XOR<UserScalarRelationFilter, UserWhereInput>
    T?: XOR<TournamentScalarRelationFilter, TournamentWhereInput>
    Winner?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type Participate_TournamentOrderByWithRelationInput = {
    id?: SortOrder
    P_Id?: SortOrder
    T_Id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
    P?: UserOrderByWithRelationInput
    T?: TournamentOrderByWithRelationInput
    Winner?: UserOrderByWithRelationInput
  }

  export type Participate_TournamentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: Participate_TournamentWhereInput | Participate_TournamentWhereInput[]
    OR?: Participate_TournamentWhereInput[]
    NOT?: Participate_TournamentWhereInput | Participate_TournamentWhereInput[]
    P_Id?: StringFilter<"Participate_Tournament"> | string
    T_Id?: StringFilter<"Participate_Tournament"> | string
    CreatedAt?: DateTimeFilter<"Participate_Tournament"> | Date | string
    UpdatedAt?: DateTimeFilter<"Participate_Tournament"> | Date | string
    result?: EnumMatchResultFilter<"Participate_Tournament"> | $Enums.MatchResult
    Winner_Id?: StringFilter<"Participate_Tournament"> | string
    P?: XOR<UserScalarRelationFilter, UserWhereInput>
    T?: XOR<TournamentScalarRelationFilter, TournamentWhereInput>
    Winner?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type Participate_TournamentOrderByWithAggregationInput = {
    id?: SortOrder
    P_Id?: SortOrder
    T_Id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
    _count?: Participate_TournamentCountOrderByAggregateInput
    _max?: Participate_TournamentMaxOrderByAggregateInput
    _min?: Participate_TournamentMinOrderByAggregateInput
  }

  export type Participate_TournamentScalarWhereWithAggregatesInput = {
    AND?: Participate_TournamentScalarWhereWithAggregatesInput | Participate_TournamentScalarWhereWithAggregatesInput[]
    OR?: Participate_TournamentScalarWhereWithAggregatesInput[]
    NOT?: Participate_TournamentScalarWhereWithAggregatesInput | Participate_TournamentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Participate_Tournament"> | string
    P_Id?: StringWithAggregatesFilter<"Participate_Tournament"> | string
    T_Id?: StringWithAggregatesFilter<"Participate_Tournament"> | string
    CreatedAt?: DateTimeWithAggregatesFilter<"Participate_Tournament"> | Date | string
    UpdatedAt?: DateTimeWithAggregatesFilter<"Participate_Tournament"> | Date | string
    result?: EnumMatchResultWithAggregatesFilter<"Participate_Tournament"> | $Enums.MatchResult
    Winner_Id?: StringWithAggregatesFilter<"Participate_Tournament"> | string
  }

  export type MatchWhereInput = {
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    id?: StringFilter<"Match"> | string
    P1_Id?: StringFilter<"Match"> | string
    P2_Id?: StringFilter<"Match"> | string
    Ball_x?: FloatFilter<"Match"> | number
    Ball_y?: FloatFilter<"Match"> | number
    CreatedAt?: DateTimeFilter<"Match"> | Date | string
    UpdatedAt?: DateTimeFilter<"Match"> | Date | string
    result?: EnumMatchResultFilter<"Match"> | $Enums.MatchResult
    Winner_Id?: StringFilter<"Match"> | string
    tournamentId?: StringNullableFilter<"Match"> | string | null
    P1?: XOR<UserScalarRelationFilter, UserWhereInput>
    P2?: XOR<UserScalarRelationFilter, UserWhereInput>
    Winner?: XOR<UserScalarRelationFilter, UserWhereInput>
    Tournament?: XOR<TournamentNullableScalarRelationFilter, TournamentWhereInput> | null
  }

  export type MatchOrderByWithRelationInput = {
    id?: SortOrder
    P1_Id?: SortOrder
    P2_Id?: SortOrder
    Ball_x?: SortOrder
    Ball_y?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
    tournamentId?: SortOrderInput | SortOrder
    P1?: UserOrderByWithRelationInput
    P2?: UserOrderByWithRelationInput
    Winner?: UserOrderByWithRelationInput
    Tournament?: TournamentOrderByWithRelationInput
  }

  export type MatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MatchWhereInput | MatchWhereInput[]
    OR?: MatchWhereInput[]
    NOT?: MatchWhereInput | MatchWhereInput[]
    P1_Id?: StringFilter<"Match"> | string
    P2_Id?: StringFilter<"Match"> | string
    Ball_x?: FloatFilter<"Match"> | number
    Ball_y?: FloatFilter<"Match"> | number
    CreatedAt?: DateTimeFilter<"Match"> | Date | string
    UpdatedAt?: DateTimeFilter<"Match"> | Date | string
    result?: EnumMatchResultFilter<"Match"> | $Enums.MatchResult
    Winner_Id?: StringFilter<"Match"> | string
    tournamentId?: StringNullableFilter<"Match"> | string | null
    P1?: XOR<UserScalarRelationFilter, UserWhereInput>
    P2?: XOR<UserScalarRelationFilter, UserWhereInput>
    Winner?: XOR<UserScalarRelationFilter, UserWhereInput>
    Tournament?: XOR<TournamentNullableScalarRelationFilter, TournamentWhereInput> | null
  }, "id">

  export type MatchOrderByWithAggregationInput = {
    id?: SortOrder
    P1_Id?: SortOrder
    P2_Id?: SortOrder
    Ball_x?: SortOrder
    Ball_y?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
    tournamentId?: SortOrderInput | SortOrder
    _count?: MatchCountOrderByAggregateInput
    _avg?: MatchAvgOrderByAggregateInput
    _max?: MatchMaxOrderByAggregateInput
    _min?: MatchMinOrderByAggregateInput
    _sum?: MatchSumOrderByAggregateInput
  }

  export type MatchScalarWhereWithAggregatesInput = {
    AND?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    OR?: MatchScalarWhereWithAggregatesInput[]
    NOT?: MatchScalarWhereWithAggregatesInput | MatchScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Match"> | string
    P1_Id?: StringWithAggregatesFilter<"Match"> | string
    P2_Id?: StringWithAggregatesFilter<"Match"> | string
    Ball_x?: FloatWithAggregatesFilter<"Match"> | number
    Ball_y?: FloatWithAggregatesFilter<"Match"> | number
    CreatedAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    UpdatedAt?: DateTimeWithAggregatesFilter<"Match"> | Date | string
    result?: EnumMatchResultWithAggregatesFilter<"Match"> | $Enums.MatchResult
    Winner_Id?: StringWithAggregatesFilter<"Match"> | string
    tournamentId?: StringNullableWithAggregatesFilter<"Match"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentCreateNestedManyWithoutWinnerInput
    Match1?: MatchCreateNestedManyWithoutP1Input
    Match2?: MatchCreateNestedManyWithoutP2Input
    Matchw?: MatchCreateNestedManyWithoutWinnerInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestUncheckedCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestUncheckedCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput
    Match1?: MatchUncheckedCreateNestedManyWithoutP1Input
    Match2?: MatchUncheckedCreateNestedManyWithoutP2Input
    Matchw?: MatchUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUpdateManyWithoutP1NestedInput
    Match2?: MatchUpdateManyWithoutP2NestedInput
    Matchw?: MatchUpdateManyWithoutWinnerNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUncheckedUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUncheckedUpdateManyWithoutP1NestedInput
    Match2?: MatchUncheckedUpdateManyWithoutP2NestedInput
    Matchw?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type FriendRequestCreateInput = {
    id?: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentRequestsInput
    receiver: UserCreateNestedOneWithoutReceivedRequestsInput
  }

  export type FriendRequestUncheckedCreateInput = {
    id?: string
    senderId: string
    receiverId: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
  }

  export type FriendRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentRequestsNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedRequestsNestedInput
  }

  export type FriendRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendRequestCreateManyInput = {
    id?: string
    senderId: string
    receiverId: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
  }

  export type FriendRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TournamentCreateInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    count_player?: number
    result?: $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutTInput
    Match?: MatchCreateNestedManyWithoutTournamentInput
  }

  export type TournamentUncheckedCreateInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    count_player?: number
    result?: $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutTInput
    Match?: MatchUncheckedCreateNestedManyWithoutTournamentInput
  }

  export type TournamentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutTNestedInput
    Match?: MatchUpdateManyWithoutTournamentNestedInput
  }

  export type TournamentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutTNestedInput
    Match?: MatchUncheckedUpdateManyWithoutTournamentNestedInput
  }

  export type TournamentCreateManyInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    count_player?: number
    result?: $Enums.MatchResult
  }

  export type TournamentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
  }

  export type TournamentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
  }

  export type Participate_TournamentCreateInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P: UserCreateNestedOneWithoutParticipate_TournamentInput
    T: TournamentCreateNestedOneWithoutParticipate_TournamentInput
    Winner: UserCreateNestedOneWithoutWin_TournamentInput
  }

  export type Participate_TournamentUncheckedCreateInput = {
    id?: string
    P_Id: string
    T_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type Participate_TournamentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P?: UserUpdateOneRequiredWithoutParticipate_TournamentNestedInput
    T?: TournamentUpdateOneRequiredWithoutParticipate_TournamentNestedInput
    Winner?: UserUpdateOneRequiredWithoutWin_TournamentNestedInput
  }

  export type Participate_TournamentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    P_Id?: StringFieldUpdateOperationsInput | string
    T_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }

  export type Participate_TournamentCreateManyInput = {
    id?: string
    P_Id: string
    T_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type Participate_TournamentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
  }

  export type Participate_TournamentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    P_Id?: StringFieldUpdateOperationsInput | string
    T_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }

  export type MatchCreateInput = {
    id?: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P1: UserCreateNestedOneWithoutMatch1Input
    P2: UserCreateNestedOneWithoutMatch2Input
    Winner: UserCreateNestedOneWithoutMatchwInput
    Tournament?: TournamentCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateInput = {
    id?: string
    P1_Id: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
    tournamentId?: string | null
  }

  export type MatchUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P1?: UserUpdateOneRequiredWithoutMatch1NestedInput
    P2?: UserUpdateOneRequiredWithoutMatch2NestedInput
    Winner?: UserUpdateOneRequiredWithoutMatchwNestedInput
    Tournament?: TournamentUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchCreateManyInput = {
    id?: string
    P1_Id: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
    tournamentId?: string | null
  }

  export type MatchUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
  }

  export type MatchUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type FriendRequestListRelationFilter = {
    every?: FriendRequestWhereInput
    some?: FriendRequestWhereInput
    none?: FriendRequestWhereInput
  }

  export type Participate_TournamentListRelationFilter = {
    every?: Participate_TournamentWhereInput
    some?: Participate_TournamentWhereInput
    none?: Participate_TournamentWhereInput
  }

  export type MatchListRelationFilter = {
    every?: MatchWhereInput
    some?: MatchWhereInput
    none?: MatchWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FriendRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type Participate_TournamentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MatchOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    loggedIn?: SortOrder
    isOnline?: SortOrder
    avatar?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    loggedIn?: SortOrder
    isOnline?: SortOrder
    avatar?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    loggedIn?: SortOrder
    isOnline?: SortOrder
    avatar?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumFriendRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendRequestStatus | EnumFriendRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendRequestStatus[]
    notIn?: $Enums.FriendRequestStatus[]
    not?: NestedEnumFriendRequestStatusFilter<$PrismaModel> | $Enums.FriendRequestStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type FriendRequestSenderIdReceiverIdCompoundUniqueInput = {
    senderId: string
    receiverId: string
  }

  export type FriendRequestCountOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
  }

  export type FriendRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
  }

  export type FriendRequestMinOrderByAggregateInput = {
    id?: SortOrder
    senderId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
  }

  export type EnumFriendRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendRequestStatus | EnumFriendRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendRequestStatus[]
    notIn?: $Enums.FriendRequestStatus[]
    not?: NestedEnumFriendRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendRequestStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumMatchResultFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[]
    notIn?: $Enums.MatchResult[]
    not?: NestedEnumMatchResultFilter<$PrismaModel> | $Enums.MatchResult
  }

  export type TournamentCountOrderByAggregateInput = {
    id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    count_player?: SortOrder
    result?: SortOrder
  }

  export type TournamentAvgOrderByAggregateInput = {
    count_player?: SortOrder
  }

  export type TournamentMaxOrderByAggregateInput = {
    id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    count_player?: SortOrder
    result?: SortOrder
  }

  export type TournamentMinOrderByAggregateInput = {
    id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    count_player?: SortOrder
    result?: SortOrder
  }

  export type TournamentSumOrderByAggregateInput = {
    count_player?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumMatchResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[]
    notIn?: $Enums.MatchResult[]
    not?: NestedEnumMatchResultWithAggregatesFilter<$PrismaModel> | $Enums.MatchResult
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchResultFilter<$PrismaModel>
    _max?: NestedEnumMatchResultFilter<$PrismaModel>
  }

  export type TournamentScalarRelationFilter = {
    is?: TournamentWhereInput
    isNot?: TournamentWhereInput
  }

  export type Participate_TournamentCountOrderByAggregateInput = {
    id?: SortOrder
    P_Id?: SortOrder
    T_Id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
  }

  export type Participate_TournamentMaxOrderByAggregateInput = {
    id?: SortOrder
    P_Id?: SortOrder
    T_Id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
  }

  export type Participate_TournamentMinOrderByAggregateInput = {
    id?: SortOrder
    P_Id?: SortOrder
    T_Id?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type TournamentNullableScalarRelationFilter = {
    is?: TournamentWhereInput | null
    isNot?: TournamentWhereInput | null
  }

  export type MatchCountOrderByAggregateInput = {
    id?: SortOrder
    P1_Id?: SortOrder
    P2_Id?: SortOrder
    Ball_x?: SortOrder
    Ball_y?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
    tournamentId?: SortOrder
  }

  export type MatchAvgOrderByAggregateInput = {
    Ball_x?: SortOrder
    Ball_y?: SortOrder
  }

  export type MatchMaxOrderByAggregateInput = {
    id?: SortOrder
    P1_Id?: SortOrder
    P2_Id?: SortOrder
    Ball_x?: SortOrder
    Ball_y?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
    tournamentId?: SortOrder
  }

  export type MatchMinOrderByAggregateInput = {
    id?: SortOrder
    P1_Id?: SortOrder
    P2_Id?: SortOrder
    Ball_x?: SortOrder
    Ball_y?: SortOrder
    CreatedAt?: SortOrder
    UpdatedAt?: SortOrder
    result?: SortOrder
    Winner_Id?: SortOrder
    tournamentId?: SortOrder
  }

  export type MatchSumOrderByAggregateInput = {
    Ball_x?: SortOrder
    Ball_y?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FriendRequestCreateNestedManyWithoutSenderInput = {
    create?: XOR<FriendRequestCreateWithoutSenderInput, FriendRequestUncheckedCreateWithoutSenderInput> | FriendRequestCreateWithoutSenderInput[] | FriendRequestUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutSenderInput | FriendRequestCreateOrConnectWithoutSenderInput[]
    createMany?: FriendRequestCreateManySenderInputEnvelope
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
  }

  export type FriendRequestCreateNestedManyWithoutReceiverInput = {
    create?: XOR<FriendRequestCreateWithoutReceiverInput, FriendRequestUncheckedCreateWithoutReceiverInput> | FriendRequestCreateWithoutReceiverInput[] | FriendRequestUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutReceiverInput | FriendRequestCreateOrConnectWithoutReceiverInput[]
    createMany?: FriendRequestCreateManyReceiverInputEnvelope
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
  }

  export type Participate_TournamentCreateNestedManyWithoutPInput = {
    create?: XOR<Participate_TournamentCreateWithoutPInput, Participate_TournamentUncheckedCreateWithoutPInput> | Participate_TournamentCreateWithoutPInput[] | Participate_TournamentUncheckedCreateWithoutPInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutPInput | Participate_TournamentCreateOrConnectWithoutPInput[]
    createMany?: Participate_TournamentCreateManyPInputEnvelope
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
  }

  export type Participate_TournamentCreateNestedManyWithoutWinnerInput = {
    create?: XOR<Participate_TournamentCreateWithoutWinnerInput, Participate_TournamentUncheckedCreateWithoutWinnerInput> | Participate_TournamentCreateWithoutWinnerInput[] | Participate_TournamentUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutWinnerInput | Participate_TournamentCreateOrConnectWithoutWinnerInput[]
    createMany?: Participate_TournamentCreateManyWinnerInputEnvelope
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutP1Input = {
    create?: XOR<MatchCreateWithoutP1Input, MatchUncheckedCreateWithoutP1Input> | MatchCreateWithoutP1Input[] | MatchUncheckedCreateWithoutP1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP1Input | MatchCreateOrConnectWithoutP1Input[]
    createMany?: MatchCreateManyP1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutP2Input = {
    create?: XOR<MatchCreateWithoutP2Input, MatchUncheckedCreateWithoutP2Input> | MatchCreateWithoutP2Input[] | MatchUncheckedCreateWithoutP2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP2Input | MatchCreateOrConnectWithoutP2Input[]
    createMany?: MatchCreateManyP2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutWinnerInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type FriendRequestUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<FriendRequestCreateWithoutSenderInput, FriendRequestUncheckedCreateWithoutSenderInput> | FriendRequestCreateWithoutSenderInput[] | FriendRequestUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutSenderInput | FriendRequestCreateOrConnectWithoutSenderInput[]
    createMany?: FriendRequestCreateManySenderInputEnvelope
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
  }

  export type FriendRequestUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<FriendRequestCreateWithoutReceiverInput, FriendRequestUncheckedCreateWithoutReceiverInput> | FriendRequestCreateWithoutReceiverInput[] | FriendRequestUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutReceiverInput | FriendRequestCreateOrConnectWithoutReceiverInput[]
    createMany?: FriendRequestCreateManyReceiverInputEnvelope
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
  }

  export type Participate_TournamentUncheckedCreateNestedManyWithoutPInput = {
    create?: XOR<Participate_TournamentCreateWithoutPInput, Participate_TournamentUncheckedCreateWithoutPInput> | Participate_TournamentCreateWithoutPInput[] | Participate_TournamentUncheckedCreateWithoutPInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutPInput | Participate_TournamentCreateOrConnectWithoutPInput[]
    createMany?: Participate_TournamentCreateManyPInputEnvelope
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
  }

  export type Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput = {
    create?: XOR<Participate_TournamentCreateWithoutWinnerInput, Participate_TournamentUncheckedCreateWithoutWinnerInput> | Participate_TournamentCreateWithoutWinnerInput[] | Participate_TournamentUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutWinnerInput | Participate_TournamentCreateOrConnectWithoutWinnerInput[]
    createMany?: Participate_TournamentCreateManyWinnerInputEnvelope
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutP1Input = {
    create?: XOR<MatchCreateWithoutP1Input, MatchUncheckedCreateWithoutP1Input> | MatchCreateWithoutP1Input[] | MatchUncheckedCreateWithoutP1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP1Input | MatchCreateOrConnectWithoutP1Input[]
    createMany?: MatchCreateManyP1InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutP2Input = {
    create?: XOR<MatchCreateWithoutP2Input, MatchUncheckedCreateWithoutP2Input> | MatchCreateWithoutP2Input[] | MatchUncheckedCreateWithoutP2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP2Input | MatchCreateOrConnectWithoutP2Input[]
    createMany?: MatchCreateManyP2InputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutWinnerInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type FriendRequestUpdateManyWithoutSenderNestedInput = {
    create?: XOR<FriendRequestCreateWithoutSenderInput, FriendRequestUncheckedCreateWithoutSenderInput> | FriendRequestCreateWithoutSenderInput[] | FriendRequestUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutSenderInput | FriendRequestCreateOrConnectWithoutSenderInput[]
    upsert?: FriendRequestUpsertWithWhereUniqueWithoutSenderInput | FriendRequestUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: FriendRequestCreateManySenderInputEnvelope
    set?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    disconnect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    delete?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    update?: FriendRequestUpdateWithWhereUniqueWithoutSenderInput | FriendRequestUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: FriendRequestUpdateManyWithWhereWithoutSenderInput | FriendRequestUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: FriendRequestScalarWhereInput | FriendRequestScalarWhereInput[]
  }

  export type FriendRequestUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<FriendRequestCreateWithoutReceiverInput, FriendRequestUncheckedCreateWithoutReceiverInput> | FriendRequestCreateWithoutReceiverInput[] | FriendRequestUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutReceiverInput | FriendRequestCreateOrConnectWithoutReceiverInput[]
    upsert?: FriendRequestUpsertWithWhereUniqueWithoutReceiverInput | FriendRequestUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: FriendRequestCreateManyReceiverInputEnvelope
    set?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    disconnect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    delete?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    update?: FriendRequestUpdateWithWhereUniqueWithoutReceiverInput | FriendRequestUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: FriendRequestUpdateManyWithWhereWithoutReceiverInput | FriendRequestUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: FriendRequestScalarWhereInput | FriendRequestScalarWhereInput[]
  }

  export type Participate_TournamentUpdateManyWithoutPNestedInput = {
    create?: XOR<Participate_TournamentCreateWithoutPInput, Participate_TournamentUncheckedCreateWithoutPInput> | Participate_TournamentCreateWithoutPInput[] | Participate_TournamentUncheckedCreateWithoutPInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutPInput | Participate_TournamentCreateOrConnectWithoutPInput[]
    upsert?: Participate_TournamentUpsertWithWhereUniqueWithoutPInput | Participate_TournamentUpsertWithWhereUniqueWithoutPInput[]
    createMany?: Participate_TournamentCreateManyPInputEnvelope
    set?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    disconnect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    delete?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    update?: Participate_TournamentUpdateWithWhereUniqueWithoutPInput | Participate_TournamentUpdateWithWhereUniqueWithoutPInput[]
    updateMany?: Participate_TournamentUpdateManyWithWhereWithoutPInput | Participate_TournamentUpdateManyWithWhereWithoutPInput[]
    deleteMany?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
  }

  export type Participate_TournamentUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<Participate_TournamentCreateWithoutWinnerInput, Participate_TournamentUncheckedCreateWithoutWinnerInput> | Participate_TournamentCreateWithoutWinnerInput[] | Participate_TournamentUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutWinnerInput | Participate_TournamentCreateOrConnectWithoutWinnerInput[]
    upsert?: Participate_TournamentUpsertWithWhereUniqueWithoutWinnerInput | Participate_TournamentUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: Participate_TournamentCreateManyWinnerInputEnvelope
    set?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    disconnect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    delete?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    update?: Participate_TournamentUpdateWithWhereUniqueWithoutWinnerInput | Participate_TournamentUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: Participate_TournamentUpdateManyWithWhereWithoutWinnerInput | Participate_TournamentUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutP1NestedInput = {
    create?: XOR<MatchCreateWithoutP1Input, MatchUncheckedCreateWithoutP1Input> | MatchCreateWithoutP1Input[] | MatchUncheckedCreateWithoutP1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP1Input | MatchCreateOrConnectWithoutP1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutP1Input | MatchUpsertWithWhereUniqueWithoutP1Input[]
    createMany?: MatchCreateManyP1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutP1Input | MatchUpdateWithWhereUniqueWithoutP1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutP1Input | MatchUpdateManyWithWhereWithoutP1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutP2NestedInput = {
    create?: XOR<MatchCreateWithoutP2Input, MatchUncheckedCreateWithoutP2Input> | MatchCreateWithoutP2Input[] | MatchUncheckedCreateWithoutP2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP2Input | MatchCreateOrConnectWithoutP2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutP2Input | MatchUpsertWithWhereUniqueWithoutP2Input[]
    createMany?: MatchCreateManyP2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutP2Input | MatchUpdateWithWhereUniqueWithoutP2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutP2Input | MatchUpdateManyWithWhereWithoutP2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutWinnerInput | MatchUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutWinnerInput | MatchUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutWinnerInput | MatchUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type FriendRequestUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<FriendRequestCreateWithoutSenderInput, FriendRequestUncheckedCreateWithoutSenderInput> | FriendRequestCreateWithoutSenderInput[] | FriendRequestUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutSenderInput | FriendRequestCreateOrConnectWithoutSenderInput[]
    upsert?: FriendRequestUpsertWithWhereUniqueWithoutSenderInput | FriendRequestUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: FriendRequestCreateManySenderInputEnvelope
    set?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    disconnect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    delete?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    update?: FriendRequestUpdateWithWhereUniqueWithoutSenderInput | FriendRequestUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: FriendRequestUpdateManyWithWhereWithoutSenderInput | FriendRequestUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: FriendRequestScalarWhereInput | FriendRequestScalarWhereInput[]
  }

  export type FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<FriendRequestCreateWithoutReceiverInput, FriendRequestUncheckedCreateWithoutReceiverInput> | FriendRequestCreateWithoutReceiverInput[] | FriendRequestUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendRequestCreateOrConnectWithoutReceiverInput | FriendRequestCreateOrConnectWithoutReceiverInput[]
    upsert?: FriendRequestUpsertWithWhereUniqueWithoutReceiverInput | FriendRequestUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: FriendRequestCreateManyReceiverInputEnvelope
    set?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    disconnect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    delete?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    connect?: FriendRequestWhereUniqueInput | FriendRequestWhereUniqueInput[]
    update?: FriendRequestUpdateWithWhereUniqueWithoutReceiverInput | FriendRequestUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: FriendRequestUpdateManyWithWhereWithoutReceiverInput | FriendRequestUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: FriendRequestScalarWhereInput | FriendRequestScalarWhereInput[]
  }

  export type Participate_TournamentUncheckedUpdateManyWithoutPNestedInput = {
    create?: XOR<Participate_TournamentCreateWithoutPInput, Participate_TournamentUncheckedCreateWithoutPInput> | Participate_TournamentCreateWithoutPInput[] | Participate_TournamentUncheckedCreateWithoutPInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutPInput | Participate_TournamentCreateOrConnectWithoutPInput[]
    upsert?: Participate_TournamentUpsertWithWhereUniqueWithoutPInput | Participate_TournamentUpsertWithWhereUniqueWithoutPInput[]
    createMany?: Participate_TournamentCreateManyPInputEnvelope
    set?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    disconnect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    delete?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    update?: Participate_TournamentUpdateWithWhereUniqueWithoutPInput | Participate_TournamentUpdateWithWhereUniqueWithoutPInput[]
    updateMany?: Participate_TournamentUpdateManyWithWhereWithoutPInput | Participate_TournamentUpdateManyWithWhereWithoutPInput[]
    deleteMany?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
  }

  export type Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<Participate_TournamentCreateWithoutWinnerInput, Participate_TournamentUncheckedCreateWithoutWinnerInput> | Participate_TournamentCreateWithoutWinnerInput[] | Participate_TournamentUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutWinnerInput | Participate_TournamentCreateOrConnectWithoutWinnerInput[]
    upsert?: Participate_TournamentUpsertWithWhereUniqueWithoutWinnerInput | Participate_TournamentUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: Participate_TournamentCreateManyWinnerInputEnvelope
    set?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    disconnect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    delete?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    update?: Participate_TournamentUpdateWithWhereUniqueWithoutWinnerInput | Participate_TournamentUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: Participate_TournamentUpdateManyWithWhereWithoutWinnerInput | Participate_TournamentUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutP1NestedInput = {
    create?: XOR<MatchCreateWithoutP1Input, MatchUncheckedCreateWithoutP1Input> | MatchCreateWithoutP1Input[] | MatchUncheckedCreateWithoutP1Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP1Input | MatchCreateOrConnectWithoutP1Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutP1Input | MatchUpsertWithWhereUniqueWithoutP1Input[]
    createMany?: MatchCreateManyP1InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutP1Input | MatchUpdateWithWhereUniqueWithoutP1Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutP1Input | MatchUpdateManyWithWhereWithoutP1Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutP2NestedInput = {
    create?: XOR<MatchCreateWithoutP2Input, MatchUncheckedCreateWithoutP2Input> | MatchCreateWithoutP2Input[] | MatchUncheckedCreateWithoutP2Input[]
    connectOrCreate?: MatchCreateOrConnectWithoutP2Input | MatchCreateOrConnectWithoutP2Input[]
    upsert?: MatchUpsertWithWhereUniqueWithoutP2Input | MatchUpsertWithWhereUniqueWithoutP2Input[]
    createMany?: MatchCreateManyP2InputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutP2Input | MatchUpdateWithWhereUniqueWithoutP2Input[]
    updateMany?: MatchUpdateManyWithWhereWithoutP2Input | MatchUpdateManyWithWhereWithoutP2Input[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutWinnerNestedInput = {
    create?: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput> | MatchCreateWithoutWinnerInput[] | MatchUncheckedCreateWithoutWinnerInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutWinnerInput | MatchCreateOrConnectWithoutWinnerInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutWinnerInput | MatchUpsertWithWhereUniqueWithoutWinnerInput[]
    createMany?: MatchCreateManyWinnerInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutWinnerInput | MatchUpdateWithWhereUniqueWithoutWinnerInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutWinnerInput | MatchUpdateManyWithWhereWithoutWinnerInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSentRequestsInput = {
    create?: XOR<UserCreateWithoutSentRequestsInput, UserUncheckedCreateWithoutSentRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedRequestsInput = {
    create?: XOR<UserCreateWithoutReceivedRequestsInput, UserUncheckedCreateWithoutReceivedRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumFriendRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.FriendRequestStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutSentRequestsNestedInput = {
    create?: XOR<UserCreateWithoutSentRequestsInput, UserUncheckedCreateWithoutSentRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentRequestsInput
    upsert?: UserUpsertWithoutSentRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentRequestsInput, UserUpdateWithoutSentRequestsInput>, UserUncheckedUpdateWithoutSentRequestsInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedRequestsNestedInput = {
    create?: XOR<UserCreateWithoutReceivedRequestsInput, UserUncheckedCreateWithoutReceivedRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedRequestsInput
    upsert?: UserUpsertWithoutReceivedRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedRequestsInput, UserUpdateWithoutReceivedRequestsInput>, UserUncheckedUpdateWithoutReceivedRequestsInput>
  }

  export type Participate_TournamentCreateNestedManyWithoutTInput = {
    create?: XOR<Participate_TournamentCreateWithoutTInput, Participate_TournamentUncheckedCreateWithoutTInput> | Participate_TournamentCreateWithoutTInput[] | Participate_TournamentUncheckedCreateWithoutTInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutTInput | Participate_TournamentCreateOrConnectWithoutTInput[]
    createMany?: Participate_TournamentCreateManyTInputEnvelope
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
  }

  export type MatchCreateNestedManyWithoutTournamentInput = {
    create?: XOR<MatchCreateWithoutTournamentInput, MatchUncheckedCreateWithoutTournamentInput> | MatchCreateWithoutTournamentInput[] | MatchUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutTournamentInput | MatchCreateOrConnectWithoutTournamentInput[]
    createMany?: MatchCreateManyTournamentInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type Participate_TournamentUncheckedCreateNestedManyWithoutTInput = {
    create?: XOR<Participate_TournamentCreateWithoutTInput, Participate_TournamentUncheckedCreateWithoutTInput> | Participate_TournamentCreateWithoutTInput[] | Participate_TournamentUncheckedCreateWithoutTInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutTInput | Participate_TournamentCreateOrConnectWithoutTInput[]
    createMany?: Participate_TournamentCreateManyTInputEnvelope
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
  }

  export type MatchUncheckedCreateNestedManyWithoutTournamentInput = {
    create?: XOR<MatchCreateWithoutTournamentInput, MatchUncheckedCreateWithoutTournamentInput> | MatchCreateWithoutTournamentInput[] | MatchUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutTournamentInput | MatchCreateOrConnectWithoutTournamentInput[]
    createMany?: MatchCreateManyTournamentInputEnvelope
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumMatchResultFieldUpdateOperationsInput = {
    set?: $Enums.MatchResult
  }

  export type Participate_TournamentUpdateManyWithoutTNestedInput = {
    create?: XOR<Participate_TournamentCreateWithoutTInput, Participate_TournamentUncheckedCreateWithoutTInput> | Participate_TournamentCreateWithoutTInput[] | Participate_TournamentUncheckedCreateWithoutTInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutTInput | Participate_TournamentCreateOrConnectWithoutTInput[]
    upsert?: Participate_TournamentUpsertWithWhereUniqueWithoutTInput | Participate_TournamentUpsertWithWhereUniqueWithoutTInput[]
    createMany?: Participate_TournamentCreateManyTInputEnvelope
    set?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    disconnect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    delete?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    update?: Participate_TournamentUpdateWithWhereUniqueWithoutTInput | Participate_TournamentUpdateWithWhereUniqueWithoutTInput[]
    updateMany?: Participate_TournamentUpdateManyWithWhereWithoutTInput | Participate_TournamentUpdateManyWithWhereWithoutTInput[]
    deleteMany?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
  }

  export type MatchUpdateManyWithoutTournamentNestedInput = {
    create?: XOR<MatchCreateWithoutTournamentInput, MatchUncheckedCreateWithoutTournamentInput> | MatchCreateWithoutTournamentInput[] | MatchUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutTournamentInput | MatchCreateOrConnectWithoutTournamentInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutTournamentInput | MatchUpsertWithWhereUniqueWithoutTournamentInput[]
    createMany?: MatchCreateManyTournamentInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutTournamentInput | MatchUpdateWithWhereUniqueWithoutTournamentInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutTournamentInput | MatchUpdateManyWithWhereWithoutTournamentInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type Participate_TournamentUncheckedUpdateManyWithoutTNestedInput = {
    create?: XOR<Participate_TournamentCreateWithoutTInput, Participate_TournamentUncheckedCreateWithoutTInput> | Participate_TournamentCreateWithoutTInput[] | Participate_TournamentUncheckedCreateWithoutTInput[]
    connectOrCreate?: Participate_TournamentCreateOrConnectWithoutTInput | Participate_TournamentCreateOrConnectWithoutTInput[]
    upsert?: Participate_TournamentUpsertWithWhereUniqueWithoutTInput | Participate_TournamentUpsertWithWhereUniqueWithoutTInput[]
    createMany?: Participate_TournamentCreateManyTInputEnvelope
    set?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    disconnect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    delete?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    connect?: Participate_TournamentWhereUniqueInput | Participate_TournamentWhereUniqueInput[]
    update?: Participate_TournamentUpdateWithWhereUniqueWithoutTInput | Participate_TournamentUpdateWithWhereUniqueWithoutTInput[]
    updateMany?: Participate_TournamentUpdateManyWithWhereWithoutTInput | Participate_TournamentUpdateManyWithWhereWithoutTInput[]
    deleteMany?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
  }

  export type MatchUncheckedUpdateManyWithoutTournamentNestedInput = {
    create?: XOR<MatchCreateWithoutTournamentInput, MatchUncheckedCreateWithoutTournamentInput> | MatchCreateWithoutTournamentInput[] | MatchUncheckedCreateWithoutTournamentInput[]
    connectOrCreate?: MatchCreateOrConnectWithoutTournamentInput | MatchCreateOrConnectWithoutTournamentInput[]
    upsert?: MatchUpsertWithWhereUniqueWithoutTournamentInput | MatchUpsertWithWhereUniqueWithoutTournamentInput[]
    createMany?: MatchCreateManyTournamentInputEnvelope
    set?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    disconnect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    delete?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    connect?: MatchWhereUniqueInput | MatchWhereUniqueInput[]
    update?: MatchUpdateWithWhereUniqueWithoutTournamentInput | MatchUpdateWithWhereUniqueWithoutTournamentInput[]
    updateMany?: MatchUpdateManyWithWhereWithoutTournamentInput | MatchUpdateManyWithWhereWithoutTournamentInput[]
    deleteMany?: MatchScalarWhereInput | MatchScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutParticipate_TournamentInput = {
    create?: XOR<UserCreateWithoutParticipate_TournamentInput, UserUncheckedCreateWithoutParticipate_TournamentInput>
    connectOrCreate?: UserCreateOrConnectWithoutParticipate_TournamentInput
    connect?: UserWhereUniqueInput
  }

  export type TournamentCreateNestedOneWithoutParticipate_TournamentInput = {
    create?: XOR<TournamentCreateWithoutParticipate_TournamentInput, TournamentUncheckedCreateWithoutParticipate_TournamentInput>
    connectOrCreate?: TournamentCreateOrConnectWithoutParticipate_TournamentInput
    connect?: TournamentWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutWin_TournamentInput = {
    create?: XOR<UserCreateWithoutWin_TournamentInput, UserUncheckedCreateWithoutWin_TournamentInput>
    connectOrCreate?: UserCreateOrConnectWithoutWin_TournamentInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutParticipate_TournamentNestedInput = {
    create?: XOR<UserCreateWithoutParticipate_TournamentInput, UserUncheckedCreateWithoutParticipate_TournamentInput>
    connectOrCreate?: UserCreateOrConnectWithoutParticipate_TournamentInput
    upsert?: UserUpsertWithoutParticipate_TournamentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutParticipate_TournamentInput, UserUpdateWithoutParticipate_TournamentInput>, UserUncheckedUpdateWithoutParticipate_TournamentInput>
  }

  export type TournamentUpdateOneRequiredWithoutParticipate_TournamentNestedInput = {
    create?: XOR<TournamentCreateWithoutParticipate_TournamentInput, TournamentUncheckedCreateWithoutParticipate_TournamentInput>
    connectOrCreate?: TournamentCreateOrConnectWithoutParticipate_TournamentInput
    upsert?: TournamentUpsertWithoutParticipate_TournamentInput
    connect?: TournamentWhereUniqueInput
    update?: XOR<XOR<TournamentUpdateToOneWithWhereWithoutParticipate_TournamentInput, TournamentUpdateWithoutParticipate_TournamentInput>, TournamentUncheckedUpdateWithoutParticipate_TournamentInput>
  }

  export type UserUpdateOneRequiredWithoutWin_TournamentNestedInput = {
    create?: XOR<UserCreateWithoutWin_TournamentInput, UserUncheckedCreateWithoutWin_TournamentInput>
    connectOrCreate?: UserCreateOrConnectWithoutWin_TournamentInput
    upsert?: UserUpsertWithoutWin_TournamentInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutWin_TournamentInput, UserUpdateWithoutWin_TournamentInput>, UserUncheckedUpdateWithoutWin_TournamentInput>
  }

  export type UserCreateNestedOneWithoutMatch1Input = {
    create?: XOR<UserCreateWithoutMatch1Input, UserUncheckedCreateWithoutMatch1Input>
    connectOrCreate?: UserCreateOrConnectWithoutMatch1Input
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMatch2Input = {
    create?: XOR<UserCreateWithoutMatch2Input, UserUncheckedCreateWithoutMatch2Input>
    connectOrCreate?: UserCreateOrConnectWithoutMatch2Input
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutMatchwInput = {
    create?: XOR<UserCreateWithoutMatchwInput, UserUncheckedCreateWithoutMatchwInput>
    connectOrCreate?: UserCreateOrConnectWithoutMatchwInput
    connect?: UserWhereUniqueInput
  }

  export type TournamentCreateNestedOneWithoutMatchInput = {
    create?: XOR<TournamentCreateWithoutMatchInput, TournamentUncheckedCreateWithoutMatchInput>
    connectOrCreate?: TournamentCreateOrConnectWithoutMatchInput
    connect?: TournamentWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutMatch1NestedInput = {
    create?: XOR<UserCreateWithoutMatch1Input, UserUncheckedCreateWithoutMatch1Input>
    connectOrCreate?: UserCreateOrConnectWithoutMatch1Input
    upsert?: UserUpsertWithoutMatch1Input
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMatch1Input, UserUpdateWithoutMatch1Input>, UserUncheckedUpdateWithoutMatch1Input>
  }

  export type UserUpdateOneRequiredWithoutMatch2NestedInput = {
    create?: XOR<UserCreateWithoutMatch2Input, UserUncheckedCreateWithoutMatch2Input>
    connectOrCreate?: UserCreateOrConnectWithoutMatch2Input
    upsert?: UserUpsertWithoutMatch2Input
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMatch2Input, UserUpdateWithoutMatch2Input>, UserUncheckedUpdateWithoutMatch2Input>
  }

  export type UserUpdateOneRequiredWithoutMatchwNestedInput = {
    create?: XOR<UserCreateWithoutMatchwInput, UserUncheckedCreateWithoutMatchwInput>
    connectOrCreate?: UserCreateOrConnectWithoutMatchwInput
    upsert?: UserUpsertWithoutMatchwInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMatchwInput, UserUpdateWithoutMatchwInput>, UserUncheckedUpdateWithoutMatchwInput>
  }

  export type TournamentUpdateOneWithoutMatchNestedInput = {
    create?: XOR<TournamentCreateWithoutMatchInput, TournamentUncheckedCreateWithoutMatchInput>
    connectOrCreate?: TournamentCreateOrConnectWithoutMatchInput
    upsert?: TournamentUpsertWithoutMatchInput
    disconnect?: TournamentWhereInput | boolean
    delete?: TournamentWhereInput | boolean
    connect?: TournamentWhereUniqueInput
    update?: XOR<XOR<TournamentUpdateToOneWithWhereWithoutMatchInput, TournamentUpdateWithoutMatchInput>, TournamentUncheckedUpdateWithoutMatchInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumFriendRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendRequestStatus | EnumFriendRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendRequestStatus[]
    notIn?: $Enums.FriendRequestStatus[]
    not?: NestedEnumFriendRequestStatusFilter<$PrismaModel> | $Enums.FriendRequestStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumFriendRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendRequestStatus | EnumFriendRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendRequestStatus[]
    notIn?: $Enums.FriendRequestStatus[]
    not?: NestedEnumFriendRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendRequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendRequestStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumMatchResultFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[]
    notIn?: $Enums.MatchResult[]
    not?: NestedEnumMatchResultFilter<$PrismaModel> | $Enums.MatchResult
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumMatchResultWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchResult | EnumMatchResultFieldRefInput<$PrismaModel>
    in?: $Enums.MatchResult[]
    notIn?: $Enums.MatchResult[]
    not?: NestedEnumMatchResultWithAggregatesFilter<$PrismaModel> | $Enums.MatchResult
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMatchResultFilter<$PrismaModel>
    _max?: NestedEnumMatchResultFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FriendRequestCreateWithoutSenderInput = {
    id?: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    receiver: UserCreateNestedOneWithoutReceivedRequestsInput
  }

  export type FriendRequestUncheckedCreateWithoutSenderInput = {
    id?: string
    receiverId: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
  }

  export type FriendRequestCreateOrConnectWithoutSenderInput = {
    where: FriendRequestWhereUniqueInput
    create: XOR<FriendRequestCreateWithoutSenderInput, FriendRequestUncheckedCreateWithoutSenderInput>
  }

  export type FriendRequestCreateManySenderInputEnvelope = {
    data: FriendRequestCreateManySenderInput | FriendRequestCreateManySenderInput[]
  }

  export type FriendRequestCreateWithoutReceiverInput = {
    id?: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    sender: UserCreateNestedOneWithoutSentRequestsInput
  }

  export type FriendRequestUncheckedCreateWithoutReceiverInput = {
    id?: string
    senderId: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
  }

  export type FriendRequestCreateOrConnectWithoutReceiverInput = {
    where: FriendRequestWhereUniqueInput
    create: XOR<FriendRequestCreateWithoutReceiverInput, FriendRequestUncheckedCreateWithoutReceiverInput>
  }

  export type FriendRequestCreateManyReceiverInputEnvelope = {
    data: FriendRequestCreateManyReceiverInput | FriendRequestCreateManyReceiverInput[]
  }

  export type Participate_TournamentCreateWithoutPInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    T: TournamentCreateNestedOneWithoutParticipate_TournamentInput
    Winner: UserCreateNestedOneWithoutWin_TournamentInput
  }

  export type Participate_TournamentUncheckedCreateWithoutPInput = {
    id?: string
    T_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type Participate_TournamentCreateOrConnectWithoutPInput = {
    where: Participate_TournamentWhereUniqueInput
    create: XOR<Participate_TournamentCreateWithoutPInput, Participate_TournamentUncheckedCreateWithoutPInput>
  }

  export type Participate_TournamentCreateManyPInputEnvelope = {
    data: Participate_TournamentCreateManyPInput | Participate_TournamentCreateManyPInput[]
  }

  export type Participate_TournamentCreateWithoutWinnerInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P: UserCreateNestedOneWithoutParticipate_TournamentInput
    T: TournamentCreateNestedOneWithoutParticipate_TournamentInput
  }

  export type Participate_TournamentUncheckedCreateWithoutWinnerInput = {
    id?: string
    P_Id: string
    T_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
  }

  export type Participate_TournamentCreateOrConnectWithoutWinnerInput = {
    where: Participate_TournamentWhereUniqueInput
    create: XOR<Participate_TournamentCreateWithoutWinnerInput, Participate_TournamentUncheckedCreateWithoutWinnerInput>
  }

  export type Participate_TournamentCreateManyWinnerInputEnvelope = {
    data: Participate_TournamentCreateManyWinnerInput | Participate_TournamentCreateManyWinnerInput[]
  }

  export type MatchCreateWithoutP1Input = {
    id?: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P2: UserCreateNestedOneWithoutMatch2Input
    Winner: UserCreateNestedOneWithoutMatchwInput
    Tournament?: TournamentCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutP1Input = {
    id?: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
    tournamentId?: string | null
  }

  export type MatchCreateOrConnectWithoutP1Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutP1Input, MatchUncheckedCreateWithoutP1Input>
  }

  export type MatchCreateManyP1InputEnvelope = {
    data: MatchCreateManyP1Input | MatchCreateManyP1Input[]
  }

  export type MatchCreateWithoutP2Input = {
    id?: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P1: UserCreateNestedOneWithoutMatch1Input
    Winner: UserCreateNestedOneWithoutMatchwInput
    Tournament?: TournamentCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutP2Input = {
    id?: string
    P1_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
    tournamentId?: string | null
  }

  export type MatchCreateOrConnectWithoutP2Input = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutP2Input, MatchUncheckedCreateWithoutP2Input>
  }

  export type MatchCreateManyP2InputEnvelope = {
    data: MatchCreateManyP2Input | MatchCreateManyP2Input[]
  }

  export type MatchCreateWithoutWinnerInput = {
    id?: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P1: UserCreateNestedOneWithoutMatch1Input
    P2: UserCreateNestedOneWithoutMatch2Input
    Tournament?: TournamentCreateNestedOneWithoutMatchInput
  }

  export type MatchUncheckedCreateWithoutWinnerInput = {
    id?: string
    P1_Id: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    tournamentId?: string | null
  }

  export type MatchCreateOrConnectWithoutWinnerInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput>
  }

  export type MatchCreateManyWinnerInputEnvelope = {
    data: MatchCreateManyWinnerInput | MatchCreateManyWinnerInput[]
  }

  export type FriendRequestUpsertWithWhereUniqueWithoutSenderInput = {
    where: FriendRequestWhereUniqueInput
    update: XOR<FriendRequestUpdateWithoutSenderInput, FriendRequestUncheckedUpdateWithoutSenderInput>
    create: XOR<FriendRequestCreateWithoutSenderInput, FriendRequestUncheckedCreateWithoutSenderInput>
  }

  export type FriendRequestUpdateWithWhereUniqueWithoutSenderInput = {
    where: FriendRequestWhereUniqueInput
    data: XOR<FriendRequestUpdateWithoutSenderInput, FriendRequestUncheckedUpdateWithoutSenderInput>
  }

  export type FriendRequestUpdateManyWithWhereWithoutSenderInput = {
    where: FriendRequestScalarWhereInput
    data: XOR<FriendRequestUpdateManyMutationInput, FriendRequestUncheckedUpdateManyWithoutSenderInput>
  }

  export type FriendRequestScalarWhereInput = {
    AND?: FriendRequestScalarWhereInput | FriendRequestScalarWhereInput[]
    OR?: FriendRequestScalarWhereInput[]
    NOT?: FriendRequestScalarWhereInput | FriendRequestScalarWhereInput[]
    id?: StringFilter<"FriendRequest"> | string
    senderId?: StringFilter<"FriendRequest"> | string
    receiverId?: StringFilter<"FriendRequest"> | string
    status?: EnumFriendRequestStatusFilter<"FriendRequest"> | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFilter<"FriendRequest"> | Date | string
    UpdatedAt?: DateTimeFilter<"FriendRequest"> | Date | string
  }

  export type FriendRequestUpsertWithWhereUniqueWithoutReceiverInput = {
    where: FriendRequestWhereUniqueInput
    update: XOR<FriendRequestUpdateWithoutReceiverInput, FriendRequestUncheckedUpdateWithoutReceiverInput>
    create: XOR<FriendRequestCreateWithoutReceiverInput, FriendRequestUncheckedCreateWithoutReceiverInput>
  }

  export type FriendRequestUpdateWithWhereUniqueWithoutReceiverInput = {
    where: FriendRequestWhereUniqueInput
    data: XOR<FriendRequestUpdateWithoutReceiverInput, FriendRequestUncheckedUpdateWithoutReceiverInput>
  }

  export type FriendRequestUpdateManyWithWhereWithoutReceiverInput = {
    where: FriendRequestScalarWhereInput
    data: XOR<FriendRequestUpdateManyMutationInput, FriendRequestUncheckedUpdateManyWithoutReceiverInput>
  }

  export type Participate_TournamentUpsertWithWhereUniqueWithoutPInput = {
    where: Participate_TournamentWhereUniqueInput
    update: XOR<Participate_TournamentUpdateWithoutPInput, Participate_TournamentUncheckedUpdateWithoutPInput>
    create: XOR<Participate_TournamentCreateWithoutPInput, Participate_TournamentUncheckedCreateWithoutPInput>
  }

  export type Participate_TournamentUpdateWithWhereUniqueWithoutPInput = {
    where: Participate_TournamentWhereUniqueInput
    data: XOR<Participate_TournamentUpdateWithoutPInput, Participate_TournamentUncheckedUpdateWithoutPInput>
  }

  export type Participate_TournamentUpdateManyWithWhereWithoutPInput = {
    where: Participate_TournamentScalarWhereInput
    data: XOR<Participate_TournamentUpdateManyMutationInput, Participate_TournamentUncheckedUpdateManyWithoutPInput>
  }

  export type Participate_TournamentScalarWhereInput = {
    AND?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
    OR?: Participate_TournamentScalarWhereInput[]
    NOT?: Participate_TournamentScalarWhereInput | Participate_TournamentScalarWhereInput[]
    id?: StringFilter<"Participate_Tournament"> | string
    P_Id?: StringFilter<"Participate_Tournament"> | string
    T_Id?: StringFilter<"Participate_Tournament"> | string
    CreatedAt?: DateTimeFilter<"Participate_Tournament"> | Date | string
    UpdatedAt?: DateTimeFilter<"Participate_Tournament"> | Date | string
    result?: EnumMatchResultFilter<"Participate_Tournament"> | $Enums.MatchResult
    Winner_Id?: StringFilter<"Participate_Tournament"> | string
  }

  export type Participate_TournamentUpsertWithWhereUniqueWithoutWinnerInput = {
    where: Participate_TournamentWhereUniqueInput
    update: XOR<Participate_TournamentUpdateWithoutWinnerInput, Participate_TournamentUncheckedUpdateWithoutWinnerInput>
    create: XOR<Participate_TournamentCreateWithoutWinnerInput, Participate_TournamentUncheckedCreateWithoutWinnerInput>
  }

  export type Participate_TournamentUpdateWithWhereUniqueWithoutWinnerInput = {
    where: Participate_TournamentWhereUniqueInput
    data: XOR<Participate_TournamentUpdateWithoutWinnerInput, Participate_TournamentUncheckedUpdateWithoutWinnerInput>
  }

  export type Participate_TournamentUpdateManyWithWhereWithoutWinnerInput = {
    where: Participate_TournamentScalarWhereInput
    data: XOR<Participate_TournamentUpdateManyMutationInput, Participate_TournamentUncheckedUpdateManyWithoutWinnerInput>
  }

  export type MatchUpsertWithWhereUniqueWithoutP1Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutP1Input, MatchUncheckedUpdateWithoutP1Input>
    create: XOR<MatchCreateWithoutP1Input, MatchUncheckedCreateWithoutP1Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutP1Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutP1Input, MatchUncheckedUpdateWithoutP1Input>
  }

  export type MatchUpdateManyWithWhereWithoutP1Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutP1Input>
  }

  export type MatchScalarWhereInput = {
    AND?: MatchScalarWhereInput | MatchScalarWhereInput[]
    OR?: MatchScalarWhereInput[]
    NOT?: MatchScalarWhereInput | MatchScalarWhereInput[]
    id?: StringFilter<"Match"> | string
    P1_Id?: StringFilter<"Match"> | string
    P2_Id?: StringFilter<"Match"> | string
    Ball_x?: FloatFilter<"Match"> | number
    Ball_y?: FloatFilter<"Match"> | number
    CreatedAt?: DateTimeFilter<"Match"> | Date | string
    UpdatedAt?: DateTimeFilter<"Match"> | Date | string
    result?: EnumMatchResultFilter<"Match"> | $Enums.MatchResult
    Winner_Id?: StringFilter<"Match"> | string
    tournamentId?: StringNullableFilter<"Match"> | string | null
  }

  export type MatchUpsertWithWhereUniqueWithoutP2Input = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutP2Input, MatchUncheckedUpdateWithoutP2Input>
    create: XOR<MatchCreateWithoutP2Input, MatchUncheckedCreateWithoutP2Input>
  }

  export type MatchUpdateWithWhereUniqueWithoutP2Input = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutP2Input, MatchUncheckedUpdateWithoutP2Input>
  }

  export type MatchUpdateManyWithWhereWithoutP2Input = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutP2Input>
  }

  export type MatchUpsertWithWhereUniqueWithoutWinnerInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutWinnerInput, MatchUncheckedUpdateWithoutWinnerInput>
    create: XOR<MatchCreateWithoutWinnerInput, MatchUncheckedCreateWithoutWinnerInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutWinnerInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutWinnerInput, MatchUncheckedUpdateWithoutWinnerInput>
  }

  export type MatchUpdateManyWithWhereWithoutWinnerInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutWinnerInput>
  }

  export type UserCreateWithoutSentRequestsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    receivedRequests?: FriendRequestCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentCreateNestedManyWithoutWinnerInput
    Match1?: MatchCreateNestedManyWithoutP1Input
    Match2?: MatchCreateNestedManyWithoutP2Input
    Matchw?: MatchCreateNestedManyWithoutWinnerInput
  }

  export type UserUncheckedCreateWithoutSentRequestsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    receivedRequests?: FriendRequestUncheckedCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput
    Match1?: MatchUncheckedCreateNestedManyWithoutP1Input
    Match2?: MatchUncheckedCreateNestedManyWithoutP2Input
    Matchw?: MatchUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type UserCreateOrConnectWithoutSentRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentRequestsInput, UserUncheckedCreateWithoutSentRequestsInput>
  }

  export type UserCreateWithoutReceivedRequestsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestCreateNestedManyWithoutSenderInput
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentCreateNestedManyWithoutWinnerInput
    Match1?: MatchCreateNestedManyWithoutP1Input
    Match2?: MatchCreateNestedManyWithoutP2Input
    Matchw?: MatchCreateNestedManyWithoutWinnerInput
  }

  export type UserUncheckedCreateWithoutReceivedRequestsInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestUncheckedCreateNestedManyWithoutSenderInput
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput
    Match1?: MatchUncheckedCreateNestedManyWithoutP1Input
    Match2?: MatchUncheckedCreateNestedManyWithoutP2Input
    Matchw?: MatchUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type UserCreateOrConnectWithoutReceivedRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedRequestsInput, UserUncheckedCreateWithoutReceivedRequestsInput>
  }

  export type UserUpsertWithoutSentRequestsInput = {
    update: XOR<UserUpdateWithoutSentRequestsInput, UserUncheckedUpdateWithoutSentRequestsInput>
    create: XOR<UserCreateWithoutSentRequestsInput, UserUncheckedCreateWithoutSentRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentRequestsInput, UserUncheckedUpdateWithoutSentRequestsInput>
  }

  export type UserUpdateWithoutSentRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    receivedRequests?: FriendRequestUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUpdateManyWithoutP1NestedInput
    Match2?: MatchUpdateManyWithoutP2NestedInput
    Matchw?: MatchUpdateManyWithoutWinnerNestedInput
  }

  export type UserUncheckedUpdateWithoutSentRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    receivedRequests?: FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUncheckedUpdateManyWithoutP1NestedInput
    Match2?: MatchUncheckedUpdateManyWithoutP2NestedInput
    Matchw?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type UserUpsertWithoutReceivedRequestsInput = {
    update: XOR<UserUpdateWithoutReceivedRequestsInput, UserUncheckedUpdateWithoutReceivedRequestsInput>
    create: XOR<UserCreateWithoutReceivedRequestsInput, UserUncheckedCreateWithoutReceivedRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedRequestsInput, UserUncheckedUpdateWithoutReceivedRequestsInput>
  }

  export type UserUpdateWithoutReceivedRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUpdateManyWithoutSenderNestedInput
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUpdateManyWithoutP1NestedInput
    Match2?: MatchUpdateManyWithoutP2NestedInput
    Matchw?: MatchUpdateManyWithoutWinnerNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUncheckedUpdateManyWithoutSenderNestedInput
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUncheckedUpdateManyWithoutP1NestedInput
    Match2?: MatchUncheckedUpdateManyWithoutP2NestedInput
    Matchw?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type Participate_TournamentCreateWithoutTInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P: UserCreateNestedOneWithoutParticipate_TournamentInput
    Winner: UserCreateNestedOneWithoutWin_TournamentInput
  }

  export type Participate_TournamentUncheckedCreateWithoutTInput = {
    id?: string
    P_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type Participate_TournamentCreateOrConnectWithoutTInput = {
    where: Participate_TournamentWhereUniqueInput
    create: XOR<Participate_TournamentCreateWithoutTInput, Participate_TournamentUncheckedCreateWithoutTInput>
  }

  export type Participate_TournamentCreateManyTInputEnvelope = {
    data: Participate_TournamentCreateManyTInput | Participate_TournamentCreateManyTInput[]
  }

  export type MatchCreateWithoutTournamentInput = {
    id?: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    P1: UserCreateNestedOneWithoutMatch1Input
    P2: UserCreateNestedOneWithoutMatch2Input
    Winner: UserCreateNestedOneWithoutMatchwInput
  }

  export type MatchUncheckedCreateWithoutTournamentInput = {
    id?: string
    P1_Id: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type MatchCreateOrConnectWithoutTournamentInput = {
    where: MatchWhereUniqueInput
    create: XOR<MatchCreateWithoutTournamentInput, MatchUncheckedCreateWithoutTournamentInput>
  }

  export type MatchCreateManyTournamentInputEnvelope = {
    data: MatchCreateManyTournamentInput | MatchCreateManyTournamentInput[]
  }

  export type Participate_TournamentUpsertWithWhereUniqueWithoutTInput = {
    where: Participate_TournamentWhereUniqueInput
    update: XOR<Participate_TournamentUpdateWithoutTInput, Participate_TournamentUncheckedUpdateWithoutTInput>
    create: XOR<Participate_TournamentCreateWithoutTInput, Participate_TournamentUncheckedCreateWithoutTInput>
  }

  export type Participate_TournamentUpdateWithWhereUniqueWithoutTInput = {
    where: Participate_TournamentWhereUniqueInput
    data: XOR<Participate_TournamentUpdateWithoutTInput, Participate_TournamentUncheckedUpdateWithoutTInput>
  }

  export type Participate_TournamentUpdateManyWithWhereWithoutTInput = {
    where: Participate_TournamentScalarWhereInput
    data: XOR<Participate_TournamentUpdateManyMutationInput, Participate_TournamentUncheckedUpdateManyWithoutTInput>
  }

  export type MatchUpsertWithWhereUniqueWithoutTournamentInput = {
    where: MatchWhereUniqueInput
    update: XOR<MatchUpdateWithoutTournamentInput, MatchUncheckedUpdateWithoutTournamentInput>
    create: XOR<MatchCreateWithoutTournamentInput, MatchUncheckedCreateWithoutTournamentInput>
  }

  export type MatchUpdateWithWhereUniqueWithoutTournamentInput = {
    where: MatchWhereUniqueInput
    data: XOR<MatchUpdateWithoutTournamentInput, MatchUncheckedUpdateWithoutTournamentInput>
  }

  export type MatchUpdateManyWithWhereWithoutTournamentInput = {
    where: MatchScalarWhereInput
    data: XOR<MatchUpdateManyMutationInput, MatchUncheckedUpdateManyWithoutTournamentInput>
  }

  export type UserCreateWithoutParticipate_TournamentInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestCreateNestedManyWithoutReceiverInput
    Win_Tournament?: Participate_TournamentCreateNestedManyWithoutWinnerInput
    Match1?: MatchCreateNestedManyWithoutP1Input
    Match2?: MatchCreateNestedManyWithoutP2Input
    Matchw?: MatchCreateNestedManyWithoutWinnerInput
  }

  export type UserUncheckedCreateWithoutParticipate_TournamentInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestUncheckedCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestUncheckedCreateNestedManyWithoutReceiverInput
    Win_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput
    Match1?: MatchUncheckedCreateNestedManyWithoutP1Input
    Match2?: MatchUncheckedCreateNestedManyWithoutP2Input
    Matchw?: MatchUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type UserCreateOrConnectWithoutParticipate_TournamentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutParticipate_TournamentInput, UserUncheckedCreateWithoutParticipate_TournamentInput>
  }

  export type TournamentCreateWithoutParticipate_TournamentInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    count_player?: number
    result?: $Enums.MatchResult
    Match?: MatchCreateNestedManyWithoutTournamentInput
  }

  export type TournamentUncheckedCreateWithoutParticipate_TournamentInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    count_player?: number
    result?: $Enums.MatchResult
    Match?: MatchUncheckedCreateNestedManyWithoutTournamentInput
  }

  export type TournamentCreateOrConnectWithoutParticipate_TournamentInput = {
    where: TournamentWhereUniqueInput
    create: XOR<TournamentCreateWithoutParticipate_TournamentInput, TournamentUncheckedCreateWithoutParticipate_TournamentInput>
  }

  export type UserCreateWithoutWin_TournamentInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutPInput
    Match1?: MatchCreateNestedManyWithoutP1Input
    Match2?: MatchCreateNestedManyWithoutP2Input
    Matchw?: MatchCreateNestedManyWithoutWinnerInput
  }

  export type UserUncheckedCreateWithoutWin_TournamentInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestUncheckedCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestUncheckedCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutPInput
    Match1?: MatchUncheckedCreateNestedManyWithoutP1Input
    Match2?: MatchUncheckedCreateNestedManyWithoutP2Input
    Matchw?: MatchUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type UserCreateOrConnectWithoutWin_TournamentInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutWin_TournamentInput, UserUncheckedCreateWithoutWin_TournamentInput>
  }

  export type UserUpsertWithoutParticipate_TournamentInput = {
    update: XOR<UserUpdateWithoutParticipate_TournamentInput, UserUncheckedUpdateWithoutParticipate_TournamentInput>
    create: XOR<UserCreateWithoutParticipate_TournamentInput, UserUncheckedCreateWithoutParticipate_TournamentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutParticipate_TournamentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutParticipate_TournamentInput, UserUncheckedUpdateWithoutParticipate_TournamentInput>
  }

  export type UserUpdateWithoutParticipate_TournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUpdateManyWithoutReceiverNestedInput
    Win_Tournament?: Participate_TournamentUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUpdateManyWithoutP1NestedInput
    Match2?: MatchUpdateManyWithoutP2NestedInput
    Matchw?: MatchUpdateManyWithoutWinnerNestedInput
  }

  export type UserUncheckedUpdateWithoutParticipate_TournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUncheckedUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput
    Win_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUncheckedUpdateManyWithoutP1NestedInput
    Match2?: MatchUncheckedUpdateManyWithoutP2NestedInput
    Matchw?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type TournamentUpsertWithoutParticipate_TournamentInput = {
    update: XOR<TournamentUpdateWithoutParticipate_TournamentInput, TournamentUncheckedUpdateWithoutParticipate_TournamentInput>
    create: XOR<TournamentCreateWithoutParticipate_TournamentInput, TournamentUncheckedCreateWithoutParticipate_TournamentInput>
    where?: TournamentWhereInput
  }

  export type TournamentUpdateToOneWithWhereWithoutParticipate_TournamentInput = {
    where?: TournamentWhereInput
    data: XOR<TournamentUpdateWithoutParticipate_TournamentInput, TournamentUncheckedUpdateWithoutParticipate_TournamentInput>
  }

  export type TournamentUpdateWithoutParticipate_TournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Match?: MatchUpdateManyWithoutTournamentNestedInput
  }

  export type TournamentUncheckedUpdateWithoutParticipate_TournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Match?: MatchUncheckedUpdateManyWithoutTournamentNestedInput
  }

  export type UserUpsertWithoutWin_TournamentInput = {
    update: XOR<UserUpdateWithoutWin_TournamentInput, UserUncheckedUpdateWithoutWin_TournamentInput>
    create: XOR<UserCreateWithoutWin_TournamentInput, UserUncheckedCreateWithoutWin_TournamentInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutWin_TournamentInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutWin_TournamentInput, UserUncheckedUpdateWithoutWin_TournamentInput>
  }

  export type UserUpdateWithoutWin_TournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutPNestedInput
    Match1?: MatchUpdateManyWithoutP1NestedInput
    Match2?: MatchUpdateManyWithoutP2NestedInput
    Matchw?: MatchUpdateManyWithoutWinnerNestedInput
  }

  export type UserUncheckedUpdateWithoutWin_TournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUncheckedUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutPNestedInput
    Match1?: MatchUncheckedUpdateManyWithoutP1NestedInput
    Match2?: MatchUncheckedUpdateManyWithoutP2NestedInput
    Matchw?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type UserCreateWithoutMatch1Input = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentCreateNestedManyWithoutWinnerInput
    Match2?: MatchCreateNestedManyWithoutP2Input
    Matchw?: MatchCreateNestedManyWithoutWinnerInput
  }

  export type UserUncheckedCreateWithoutMatch1Input = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestUncheckedCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestUncheckedCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput
    Match2?: MatchUncheckedCreateNestedManyWithoutP2Input
    Matchw?: MatchUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type UserCreateOrConnectWithoutMatch1Input = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMatch1Input, UserUncheckedCreateWithoutMatch1Input>
  }

  export type UserCreateWithoutMatch2Input = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentCreateNestedManyWithoutWinnerInput
    Match1?: MatchCreateNestedManyWithoutP1Input
    Matchw?: MatchCreateNestedManyWithoutWinnerInput
  }

  export type UserUncheckedCreateWithoutMatch2Input = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestUncheckedCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestUncheckedCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput
    Match1?: MatchUncheckedCreateNestedManyWithoutP1Input
    Matchw?: MatchUncheckedCreateNestedManyWithoutWinnerInput
  }

  export type UserCreateOrConnectWithoutMatch2Input = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMatch2Input, UserUncheckedCreateWithoutMatch2Input>
  }

  export type UserCreateWithoutMatchwInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentCreateNestedManyWithoutWinnerInput
    Match1?: MatchCreateNestedManyWithoutP1Input
    Match2?: MatchCreateNestedManyWithoutP2Input
  }

  export type UserUncheckedCreateWithoutMatchwInput = {
    id?: string
    email: string
    name?: string | null
    password: string
    loggedIn?: boolean
    isOnline?: boolean
    avatar?: string | null
    sentRequests?: FriendRequestUncheckedCreateNestedManyWithoutSenderInput
    receivedRequests?: FriendRequestUncheckedCreateNestedManyWithoutReceiverInput
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutPInput
    Win_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutWinnerInput
    Match1?: MatchUncheckedCreateNestedManyWithoutP1Input
    Match2?: MatchUncheckedCreateNestedManyWithoutP2Input
  }

  export type UserCreateOrConnectWithoutMatchwInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMatchwInput, UserUncheckedCreateWithoutMatchwInput>
  }

  export type TournamentCreateWithoutMatchInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    count_player?: number
    result?: $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentCreateNestedManyWithoutTInput
  }

  export type TournamentUncheckedCreateWithoutMatchInput = {
    id?: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    count_player?: number
    result?: $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentUncheckedCreateNestedManyWithoutTInput
  }

  export type TournamentCreateOrConnectWithoutMatchInput = {
    where: TournamentWhereUniqueInput
    create: XOR<TournamentCreateWithoutMatchInput, TournamentUncheckedCreateWithoutMatchInput>
  }

  export type UserUpsertWithoutMatch1Input = {
    update: XOR<UserUpdateWithoutMatch1Input, UserUncheckedUpdateWithoutMatch1Input>
    create: XOR<UserCreateWithoutMatch1Input, UserUncheckedCreateWithoutMatch1Input>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMatch1Input = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMatch1Input, UserUncheckedUpdateWithoutMatch1Input>
  }

  export type UserUpdateWithoutMatch1Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUpdateManyWithoutWinnerNestedInput
    Match2?: MatchUpdateManyWithoutP2NestedInput
    Matchw?: MatchUpdateManyWithoutWinnerNestedInput
  }

  export type UserUncheckedUpdateWithoutMatch1Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUncheckedUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput
    Match2?: MatchUncheckedUpdateManyWithoutP2NestedInput
    Matchw?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type UserUpsertWithoutMatch2Input = {
    update: XOR<UserUpdateWithoutMatch2Input, UserUncheckedUpdateWithoutMatch2Input>
    create: XOR<UserCreateWithoutMatch2Input, UserUncheckedCreateWithoutMatch2Input>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMatch2Input = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMatch2Input, UserUncheckedUpdateWithoutMatch2Input>
  }

  export type UserUpdateWithoutMatch2Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUpdateManyWithoutP1NestedInput
    Matchw?: MatchUpdateManyWithoutWinnerNestedInput
  }

  export type UserUncheckedUpdateWithoutMatch2Input = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUncheckedUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUncheckedUpdateManyWithoutP1NestedInput
    Matchw?: MatchUncheckedUpdateManyWithoutWinnerNestedInput
  }

  export type UserUpsertWithoutMatchwInput = {
    update: XOR<UserUpdateWithoutMatchwInput, UserUncheckedUpdateWithoutMatchwInput>
    create: XOR<UserCreateWithoutMatchwInput, UserUncheckedCreateWithoutMatchwInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMatchwInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMatchwInput, UserUncheckedUpdateWithoutMatchwInput>
  }

  export type UserUpdateWithoutMatchwInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUpdateManyWithoutP1NestedInput
    Match2?: MatchUpdateManyWithoutP2NestedInput
  }

  export type UserUncheckedUpdateWithoutMatchwInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    password?: StringFieldUpdateOperationsInput | string
    loggedIn?: BoolFieldUpdateOperationsInput | boolean
    isOnline?: BoolFieldUpdateOperationsInput | boolean
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    sentRequests?: FriendRequestUncheckedUpdateManyWithoutSenderNestedInput
    receivedRequests?: FriendRequestUncheckedUpdateManyWithoutReceiverNestedInput
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutPNestedInput
    Win_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutWinnerNestedInput
    Match1?: MatchUncheckedUpdateManyWithoutP1NestedInput
    Match2?: MatchUncheckedUpdateManyWithoutP2NestedInput
  }

  export type TournamentUpsertWithoutMatchInput = {
    update: XOR<TournamentUpdateWithoutMatchInput, TournamentUncheckedUpdateWithoutMatchInput>
    create: XOR<TournamentCreateWithoutMatchInput, TournamentUncheckedCreateWithoutMatchInput>
    where?: TournamentWhereInput
  }

  export type TournamentUpdateToOneWithWhereWithoutMatchInput = {
    where?: TournamentWhereInput
    data: XOR<TournamentUpdateWithoutMatchInput, TournamentUncheckedUpdateWithoutMatchInput>
  }

  export type TournamentUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentUpdateManyWithoutTNestedInput
  }

  export type TournamentUncheckedUpdateWithoutMatchInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    count_player?: IntFieldUpdateOperationsInput | number
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Participate_Tournament?: Participate_TournamentUncheckedUpdateManyWithoutTNestedInput
  }

  export type FriendRequestCreateManySenderInput = {
    id?: string
    receiverId: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
  }

  export type FriendRequestCreateManyReceiverInput = {
    id?: string
    senderId: string
    status?: $Enums.FriendRequestStatus
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
  }

  export type Participate_TournamentCreateManyPInput = {
    id?: string
    T_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type Participate_TournamentCreateManyWinnerInput = {
    id?: string
    P_Id: string
    T_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
  }

  export type MatchCreateManyP1Input = {
    id?: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
    tournamentId?: string | null
  }

  export type MatchCreateManyP2Input = {
    id?: string
    P1_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
    tournamentId?: string | null
  }

  export type MatchCreateManyWinnerInput = {
    id?: string
    P1_Id: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    tournamentId?: string | null
  }

  export type FriendRequestUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiver?: UserUpdateOneRequiredWithoutReceivedRequestsNestedInput
  }

  export type FriendRequestUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendRequestUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendRequestUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sender?: UserUpdateOneRequiredWithoutSentRequestsNestedInput
  }

  export type FriendRequestUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendRequestUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    senderId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendRequestStatusFieldUpdateOperationsInput | $Enums.FriendRequestStatus
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type Participate_TournamentUpdateWithoutPInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    T?: TournamentUpdateOneRequiredWithoutParticipate_TournamentNestedInput
    Winner?: UserUpdateOneRequiredWithoutWin_TournamentNestedInput
  }

  export type Participate_TournamentUncheckedUpdateWithoutPInput = {
    id?: StringFieldUpdateOperationsInput | string
    T_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }

  export type Participate_TournamentUncheckedUpdateManyWithoutPInput = {
    id?: StringFieldUpdateOperationsInput | string
    T_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }

  export type Participate_TournamentUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P?: UserUpdateOneRequiredWithoutParticipate_TournamentNestedInput
    T?: TournamentUpdateOneRequiredWithoutParticipate_TournamentNestedInput
  }

  export type Participate_TournamentUncheckedUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    P_Id?: StringFieldUpdateOperationsInput | string
    T_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
  }

  export type Participate_TournamentUncheckedUpdateManyWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    P_Id?: StringFieldUpdateOperationsInput | string
    T_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
  }

  export type MatchUpdateWithoutP1Input = {
    id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P2?: UserUpdateOneRequiredWithoutMatch2NestedInput
    Winner?: UserUpdateOneRequiredWithoutMatchwNestedInput
    Tournament?: TournamentUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutP1Input = {
    id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchUncheckedUpdateManyWithoutP1Input = {
    id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchUpdateWithoutP2Input = {
    id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P1?: UserUpdateOneRequiredWithoutMatch1NestedInput
    Winner?: UserUpdateOneRequiredWithoutMatchwNestedInput
    Tournament?: TournamentUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutP2Input = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchUncheckedUpdateManyWithoutP2Input = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P1?: UserUpdateOneRequiredWithoutMatch1NestedInput
    P2?: UserUpdateOneRequiredWithoutMatch2NestedInput
    Tournament?: TournamentUpdateOneWithoutMatchNestedInput
  }

  export type MatchUncheckedUpdateWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MatchUncheckedUpdateManyWithoutWinnerInput = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    tournamentId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type Participate_TournamentCreateManyTInput = {
    id?: string
    P_Id: string
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type MatchCreateManyTournamentInput = {
    id?: string
    P1_Id: string
    P2_Id: string
    Ball_x: number
    Ball_y: number
    CreatedAt?: Date | string
    UpdatedAt?: Date | string
    result?: $Enums.MatchResult
    Winner_Id: string
  }

  export type Participate_TournamentUpdateWithoutTInput = {
    id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P?: UserUpdateOneRequiredWithoutParticipate_TournamentNestedInput
    Winner?: UserUpdateOneRequiredWithoutWin_TournamentNestedInput
  }

  export type Participate_TournamentUncheckedUpdateWithoutTInput = {
    id?: StringFieldUpdateOperationsInput | string
    P_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }

  export type Participate_TournamentUncheckedUpdateManyWithoutTInput = {
    id?: StringFieldUpdateOperationsInput | string
    P_Id?: StringFieldUpdateOperationsInput | string
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }

  export type MatchUpdateWithoutTournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    P1?: UserUpdateOneRequiredWithoutMatch1NestedInput
    P2?: UserUpdateOneRequiredWithoutMatch2NestedInput
    Winner?: UserUpdateOneRequiredWithoutMatchwNestedInput
  }

  export type MatchUncheckedUpdateWithoutTournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }

  export type MatchUncheckedUpdateManyWithoutTournamentInput = {
    id?: StringFieldUpdateOperationsInput | string
    P1_Id?: StringFieldUpdateOperationsInput | string
    P2_Id?: StringFieldUpdateOperationsInput | string
    Ball_x?: FloatFieldUpdateOperationsInput | number
    Ball_y?: FloatFieldUpdateOperationsInput | number
    CreatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    UpdatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    result?: EnumMatchResultFieldUpdateOperationsInput | $Enums.MatchResult
    Winner_Id?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}