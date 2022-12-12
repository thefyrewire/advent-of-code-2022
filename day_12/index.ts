export module Day_12 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_12/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const map = lines.map((line) => line.split(''))

  interface Coord {
    x: number
    y: number
  }

  type Grid = number[][]

  type CompareFn = (a: number, b: number) => boolean
  type SuccessFn = (key: string) => boolean

  interface FindRoutesProps {
    grid: Grid
    start: Coord
    compareFn: CompareFn
    successFn: SuccessFn
  }

  const elevations = 'abcdefghijklmnopqrstuvwxyz'.split('')

  const inBounds = (grid: Grid, coord: Coord): boolean => {
    const rows = grid.length
    const cols = rows > 0 ? grid[0].length : 0
    return coord.y >= 0 && coord.y < rows && coord.x >= 0 && coord.x < cols
  }

  const getClosest = (
    queue: Set<string>,
    steps: Record<string, number>
  ): string => {
    let nearest = ''
    for (const path of Array.from(queue)) {
      if (!nearest || steps[path] < steps[nearest]) nearest = path
    }
    return nearest
  }

  const getSteps = ({
    grid,
    start,
    compareFn,
    successFn,
  }: FindRoutesProps): number => {
    const queue = new Set<string>()
    const steps: Record<string, number> = {}

    grid.forEach((row, y) => {
      row.forEach((_, x) => {
        const key = `${x},${y}`
        steps[key] = Infinity
        queue.add(key)
      })
    })

    const getPaths = (
      grid: Grid,
      compareFn: CompareFn,
      location: string
    ): Coord[] => {
      const [x, y] = location.split(',').map((n) => parseInt(n))
      const neighbours: Coord[] = [
        { x, y: y - 1 },
        { x: x + 1, y },
        { x, y: y + 1 },
        { x: x - 1, y },
      ]
      return neighbours.filter(
        (coord) =>
          inBounds(grid, coord) && compareFn(grid[y][x], grid[coord.y][coord.x])
      )
    }

    steps[`${start.x},${start.y}`] = 0

    while (queue.size) {
      const closest = getClosest(queue, steps)
      if (successFn(closest)) return steps[closest]

      queue.delete(closest)

      for (const path of getPaths(grid, compareFn, closest)) {
        const key = `${path.x},${path.y}`
        if (queue.has(key)) {
          const n = steps[closest] + 1
          if (n < steps[key]) steps[key] = n
        }
      }
    }

    return 0
  }

  let start = { x: 0, y: 0 }
  let end = { x: 0, y: 0 }

  const grid: Grid = map.map((row, y) => {
    return row.map((col, x) => {
      if (col === 'S') {
        start = { x, y }
        return 0
      } else if (col === 'E') {
        end = { x, y }
        return 25
      }
      return elevations.indexOf(col)
    })
  })

  /**
   * PART 1
   */
  const part1 = () => {
    const steps = getSteps({
      grid,
      start,
      compareFn: (a, b) => b <= a + 1,
      successFn: (key) => key === `${end.x},${end.y}`,
    })

    console.log(
      `There are a minimum of ${steps} steps required to move from the current position to the location that gets the best signal.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const steps = getSteps({
      grid,
      start: end,
      compareFn: (a, b) => b >= a - 1,
      successFn: (key) => {
        const [x, y] = key.split(',').map((n) => parseInt(n))
        return grid[y][x] === 0
      },
    })

    console.log(
      `There are a minimum of ${steps} steps required to move from any square with elevation a to the location that gets the best signal.`
    )
  }

  part2()
}
