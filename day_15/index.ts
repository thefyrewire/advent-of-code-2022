export module Day_15 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_15/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  type Coord = [number, number]

  interface Pair {
    sensor: Coord
    beacon: Coord
    manhatDist: number
  }

  const getManhattanDistance = ([x1, y1]: Coord, [x2, y2]: Coord): number => {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
  }

  const pairs = lines.reduce<Pair[]>((acc, line) => {
    const matched = line.match(
      /^Sensor at x=(?<sx>-?\d+), y=(?<sy>-?\d+): closest beacon is at x=(?<bx>-?\d+), y=(?<by>-?\d+)$/
    )
    if (!matched) return acc
    const { groups } = matched
    if (!groups) return acc
    const sensor = [parseInt(groups.sx), parseInt(groups.sy)] as Coord
    const beacon = [parseInt(groups.bx), parseInt(groups.by)] as Coord
    return [
      ...acc,
      {
        sensor,
        beacon,
        manhatDist: getManhattanDistance(sensor, beacon),
      },
    ]
  }, [] as Pair[])

  /**
   * PART 1
   */
  const part1 = () => {
    const targetY = 2000000
    const grid = new Set<number>()

    pairs.forEach(({ sensor: [sx, sy], manhatDist }) => {
      const md = getManhattanDistance([sx, sy], [sx, targetY])
      const dist = manhatDist - md
      for (let i = sx - dist; i <= sx + dist; i += 1) {
        grid.add(i)
      }
    })

    const positions = grid.size - 1

    console.log(
      `In the row 2,000,000, ${positions} positions cannot contain a beacon.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const getRanges = (y: number) => {
      const ranges: number[][] = []

      pairs.forEach(({ sensor: [sx, sy], manhatDist }) => {
        const md = getManhattanDistance([sx, sy], [sx, y])
        const dist = manhatDist - md
        ranges.push([sx - dist, sx + dist])
      })

      return ranges
    }

    const mergeRanges = (ranges: number[][]) => {
      ranges.sort(([sx1], [sx2]) => sx1 - sx2)

      for (let i = 1; i < ranges.length; i += 1) {
        const [rangeStart, rangeEnd] = ranges[i]
        let [_, prevEnd] = ranges[i - 1]
        if (prevEnd >= rangeStart) {
          ranges[i - 1][1] = Math.max(prevEnd, rangeEnd)
          ranges.splice(i, 1)
          i -= 1
        }
      }

      return ranges
    }

    const getTuningFrequency = (): number => {
      for (let y = 0; y < maxSize; y += 1) {
        const ranges = getRanges(y)
        const mergedRanges = mergeRanges(ranges)

        let positions: Coord[] = []
        for (const range of mergedRanges) {
          if (range[0] > maxSize || range[1] < 0) continue
          positions.push([Math.max(range[0], 0), Math.min(range[1], maxSize)])
        }

        if (positions.length > 1) {
          const x = positions[0][1] + 1
          return x * 4e6 + y
        }
      }

      return 0
    }

    const maxSize = 4000000
    const tuningFrequency = getTuningFrequency()

    console.log(
      `The tuning frequency fr the distress beacon is ${tuningFrequency}.`
    )
  }

  part2()
}
