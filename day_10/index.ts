export module Day_10 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_10/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  /**
   * PART 1
   */
  const part1 = () => {
    const signal = lines.reduce(
      ({ cycles, x }, instruction) => {
        if (instruction === 'noop') return { cycles: [...cycles, x], x }
        const [, n] = instruction.split(' ')
        const amount = parseInt(n)
        return { cycles: [...cycles, x, x + amount], x: x + amount }
      },
      { cycles: [] as number[], x: 1 }
    )

    const strength = [20, 60, 100, 140, 180, 220]
      .map((n) => signal.cycles[n - 2] * n)
      .reduce((a, v) => a + v, 0)

    console.log(strength)
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const signal = lines.reduce(
      ({ cycles, x, pixels }, instruction) => {
        const i = cycles.length % 40
        if (instruction === 'noop')
          return {
            cycles: [...cycles, x],
            x,
            pixels: [
              ...pixels,
              x - 1 === i || x === i || x + 1 === i ? '#' : '.',
            ],
          }
        const [, n] = instruction.split(' ')
        const amount = parseInt(n)
        const j = (cycles.length + 1) % 40
        return {
          cycles: [...cycles, x, x + amount],
          x: x + amount,
          pixels: [
            ...pixels,
            x - 1 === i || x === i || x + 1 === i ? '#' : '.',
            x - 1 === j || x === j || x + 1 === j ? '#' : '.',
          ],
        }
      },
      { cycles: [] as number[], x: 1, pixels: [] as string[] }
    )

    const screen = signal.pixels.reduce(
      (a, v, i) =>
        i % 40 === 0 ? [...a, v] : [...a.slice(0, -1), `${a.slice(-1)} ${v}`],
      [] as string[]
    )

    console.log(screen)
  }

  part2()
}
