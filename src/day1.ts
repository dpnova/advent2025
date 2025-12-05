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

const isRight = (c: string) => c.startsWith('R')

const isLeft = (c: string) => c.startsWith('L')

export const day1 = Effect.gen(function* () {
  const dial = yield* makeDial
  const result = yield* Effect.forEach(input, (line) =>
    Match.value(line).pipe(
      Match.when(isLeft, (l) =>
        dial
          .left(Number(l.slice(1)))
          .pipe(Effect.flatMap(() => dial.currentPosition)),
      ),
      Match.when(isRight, (r) =>
        dial
          .right(Number(r.slice(1)))
          .pipe(Effect.flatMap(() => dial.currentPosition)),
      ),
      Match.orElse(() => Effect.fail(new Error(`Invalid direction: ${line}`))),
    ),
  )
  const zeroCount = Array.countBy(result, (pos) => pos === 0)
  console.log(`Number of times dial at position 0: ${zeroCount}`)
}).pipe(Effect.runPromise)
