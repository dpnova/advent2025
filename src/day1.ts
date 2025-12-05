import { Array, Effect, Match, Ref } from 'effect'
import { readFileSync } from 'node:fs'

// load file from input.txt
//
const input = readFileSync('src/input.txt', 'utf-8')
  .split('\n')
  .filter((line) => line.length > 0)

class Dial {
  left: (count: number) => Effect.Effect<void>
  right: (count: number) => Effect.Effect<void>
  currentPosition: Effect.Effect<number>

  constructor(private value: Ref.Ref<number>) {
    this.left = (count) =>
      Ref.update(this.value, (v) => (v - count + 100) % 100)
    this.right = (count) => Ref.update(this.value, (v) => (v + count) % 100)
    this.currentPosition = Ref.get(this.value)
  }
}
const makeDial = Effect.andThen(Ref.make(50), (value) => new Dial(value))

function isRight(c: string): boolean {
  return c === 'R'
}

function isLeft(c: string): boolean {
  return c === 'L'
}

export const day1 = Effect.gen(function* () {
  const dial = yield* makeDial
  const result = yield* Effect.forEach(input, (line) =>
    Array.matchLeft(line.split(''), {
      onEmpty: () => Effect.fail(new Error('Empty line')),
      onNonEmpty: (head, tail) =>
        Match.value(head).pipe(
          Match.when(isLeft, () =>
            dial
              .left(Number(tail.join('')))
              .pipe(Effect.flatMap(() => dial.currentPosition)),
          ),
          Match.when(isRight, () =>
            dial
              .right(Number(tail.join('')))
              .pipe(Effect.flatMap(() => dial.currentPosition)),
          ),
          Match.orElse(() =>
            Effect.fail(new Error(`Invalid direction: ${head}`)),
          ),
        ),
    }),
  )
  const zeroCount = Array.countBy(result, (pos) => pos === 0)
  console.log(`Number of times dial at position 0: ${zeroCount}`)
}).pipe(Effect.runPromise)
