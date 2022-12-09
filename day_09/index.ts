export module Day_09 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_09/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  interface Coord {
    x: number
    y: number
  }

  type Direction = 'U' | 'D' | 'L' | 'R'

  const moves = lines
    .map((line) => line.split(' '))
    .map(([d, a]) => [d, parseInt(a)])

  const moveHeads = (heads: Coord, dir: Direction) => {
    return {
      x: dir === 'L' ? heads.x - 1 : dir === 'R' ? heads.x + 1 : heads.x,
      y: dir === 'D' ? heads.y - 1 : dir === 'U' ? heads.y + 1 : heads.y,
    }
  }

  /**
   * PART 1
   */
  const part1 = () => {
    const moveTails = (nextHeads: Coord, heads: Coord, tails: Coord): Coord => {
      const x = nextHeads.x - tails.x
      const y = nextHeads.y - tails.y
      const doMove = Math.abs(x) > 1 || Math.abs(y) > 1
      return doMove ? heads : tails
    }

    const grid = moves.reduce<{
      coords: Coord[]
      heads: Coord
      tails: Coord
    }>(
      ({ coords, heads, tails }, move) => {
        const [dir, amount] = move as [Direction, number]

        for (let i = 0; i < amount; i += 1) {
          const nextHeads = moveHeads(heads, dir)
          const nextTails = moveTails(nextHeads, heads, tails)
          coords.push(nextTails)
          tails = nextTails
          heads = nextHeads
        }

        return { coords, heads, tails }
      },
      { coords: [], heads: { x: 0, y: 0 }, tails: { x: 0, y: 0 } }
    )

    const positions: number = Array.from(
      new Set(grid.coords.map((c) => `${c.x},${c.y}`))
    ).length

    console.log(
      `The tail of the rope visits ${positions} positions at least once.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const moveKnot = (nextKnot: Coord, knot: Coord): Coord => {
      const x = nextKnot.x - knot.x
      const y = nextKnot.y - knot.y
      if (Math.abs(x) >= 2) {
        knot.x += Math.sign(x)
        if (Math.abs(y) !== 0) knot.y += Math.sign(y)
      } else if (Math.abs(y) >= 2) {
        knot.y += Math.sign(y)
        if (Math.abs(x) !== 0) knot.x += Math.sign(x)
      }
      return knot
    }

    const simulateRope = (nKnots = 2) => {
      const knots = Array.from({ length: nKnots })
        .fill(0)
        .map((_) => ({ x: 0, y: 0 }))
      const coords: string[] = []
      moves.forEach((move) => {
        const [dir, amount] = move as [Direction, number]

        for (let i = 0; i < amount; i += 1) {
          knots[0] = moveHeads(knots[0], dir)

          for (let k = 1; k < knots.length; k += 1) {
            knots[k] = moveKnot(knots[k - 1], knots[k])
          }

          coords.push(
            `${knots[knots.length - 1].x},${knots[knots.length - 1].y}`
          )
        }
      })
      return coords
    }

    const coords = simulateRope(10)
    const positions = Array.from(new Set(coords)).length

    console.log(
      `The tail of the longer rope visits ${positions} positions at least once.`
    )
  }

  part2()
}
