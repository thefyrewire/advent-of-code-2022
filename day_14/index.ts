export module Day_14 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_14/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  type Coord = [number, number]
  type Row = Coord[]
  type Grid = Row[]

  const points = lines.map((line) =>
    line.split('->').map((point) => point.split(',').map((n) => parseInt(n)))
  )

  const maxY = points.flat().sort((a, b) => b[1] - a[1])[0][1]

  const rocks = points.reduce((grid, rock) => {
    const rockPoints = rock.reduce((rockArr, [x1, y1], i, arr) => {
      if (i + 1 >= arr.length) return rockArr
      const [x2, y2] = arr[i + 1]
      if (x1 !== x2) {
        const p = Array.from({
          length: Math.abs(x2 - x1) + 1,
        }).map((_, i) => [Math.min(x1, x2) + i, y1])
        return [...rockArr, ...p] as Coord[]
      } else {
        const p = Array.from({
          length: Math.abs(y2 - y1) + 1,
        }).map((_, i) => [x1, Math.min(y1, y2) + i])
        return [...rockArr, ...p] as Coord[]
      }
    }, [] as Coord[])

    return [...grid, ...rockPoints] as Grid
  }, [] as Grid)

  /**
   * PART 1
   */
  const part1 = () => {
    const grid = new Map()

    rocks.forEach(([x, y]) => {
      grid.set(`${x},${y}`, '#')
    })

    const dropSand = ([x, y]: Coord): Coord | null => {
      if (y > maxY) return null

      const [d, dl, dr] = [
        `${x},${y + 1}`,
        `${x - 1},${y + 1}`,
        `${x + 1},${y + 1}`,
      ]

      if (!grid.get(d)) {
        return dropSand([x, y + 1])
      } else if (!grid.get(dl)) {
        return dropSand([x - 1, y + 1])
      } else if (!grid.get(dr)) {
        return dropSand([x + 1, y + 1])
      } else {
        grid.set(`${x},${y}`, 'o')
      }

      return [x, y]
    }

    let count = 0
    while (dropSand([500, 0])) {
      count += 1
    }

    console.log(
      `There are ${count} units of sand that come to rest before sand starts flowing into the abyss below.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const grid = new Map()

    rocks.forEach(([x, y]) => {
      grid.set(`${x},${y}`, '#')
    })

    const dropSand = ([x, y]: Coord): Coord | null => {
      if (grid.has('500,0')) return null

      const [d, dl, dr] = [
        `${x},${y + 1}`,
        `${x - 1},${y + 1}`,
        `${x + 1},${y + 1}`,
      ]

      const aboveFloor = y + 1 < maxY + 2

      if (!grid.get(d) && aboveFloor) {
        return dropSand([x, y + 1])
      } else if (!grid.get(dl) && aboveFloor) {
        return dropSand([x - 1, y + 1])
      } else if (!grid.get(dr) && aboveFloor) {
        return dropSand([x + 1, y + 1])
      } else {
        grid.set(`${x},${y}`, 'o')
      }

      return [x, y]
    }

    let count = 0
    while (dropSand([500, 0])) {
      count += 1
    }

    console.log(
      `There are ${count} units of sand that come to rest when the source of the sand becomes blocked.`
    )
  }

  part2()
}
