export module Day_16 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_16/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  interface Valve {
    rate: number
    valves: string[]
    dists: Dists
  }

  type Dists = Record<string, number>

  interface Path {
    done: boolean
    where: string
    path: string[]
    active: string[]
    mins: number
    pressure: number
  }

  type KeyedPath = Path & { key: string }

  const valves = lines.reduce((acc, val) => {
    const match = val.match(
      /^Valve (?<valve>.+) has flow rate=(?<rate>\d+); tunnels? leads? to valves? (?<valves>.+)$/
    )
    if (!match) return acc
    const { groups } = match
    if (!groups) return acc
    return {
      ...acc,
      [groups.valve]: {
        rate: parseInt(groups.rate),
        valves: groups.valves.split(',').map((v) => v.trim()),
        dists: {},
      },
    }
  }, {} as Record<string, Valve>)

  const workingValves = Object.entries(valves)
    .filter(([_, { rate }]) => rate > 0)
    .map(([id]) => id)
    .sort()

  const getDistances = (valve: string, dists: Dists = {}) => {
    if (Object.keys(valves[valve].dists).length > 0) return valves[valve].dists

    const search = (id: string, steps: number) => {
      if (typeof dists[id] !== 'undefined' && dists[id] <= steps) return
      dists[id] = steps
      valves[id].valves.forEach((v) => search(v, steps + 1))
    }
    search(valve, 0)
    valves[valve].dists = dists

    return dists
  }

  const calculatePaths = (mins: number) => {
    const paths: Path[] = [
      {
        where: 'AA',
        path: [],
        active: workingValves,
        mins,
        done: false,
        pressure: 0,
      },
    ]

    for (let i = 0; i < paths.length; i += 1) {
      const path = paths[i]

      const dists = getDistances(path.where)

      for (const valve of path.active) {
        if (valve === path.where) continue
        if (path.mins - dists[valve] <= 1) continue

        const mins = path.mins - dists[valve] - 1

        paths.push({
          ...path,
          where: valve,
          path: [...path.path, valve].sort(),
          active: path.active.filter((a) => a !== valve),
          mins,
          pressure: path.pressure + mins * valves[valve].rate,
        })
      }
    }

    return paths
  }

  /**
   * PART 1
   */
  const part1 = () => {
    const paths = calculatePaths(30)
    const [{ pressure }] = paths.sort((a, b) => b.pressure - a.pressure)

    console.log(
      `The most pressure you can release within 30 minutes is ${pressure}.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const paths = calculatePaths(26)

    let bestPaths = paths.reduce((acc, path, _, arr) => {
      const key = path.path.join('')
      if (acc.findIndex((p) => p.key === key) !== -1) return acc
      const pressures = arr
        .filter((p) => p.path.join('') === key)
        .map((p) => p.pressure)
      return [...acc, { ...path, key, pressure: Math.max(...pressures) }]
    }, [] as KeyedPath[])

    const bestPathMap: Record<string, number> = bestPaths.reduce(
      (acc, path) => ({ ...acc, [path.path.sort().join('')]: path.pressure }),
      {}
    )

    const updateBestPathMap = (valveData: string[]) => {
      const key = valveData.join('')
      if (bestPathMap[key] === undefined) {
        let pressure = 0
        for (const valve of valveData) {
          const rest = valveData.filter((v) => v !== valve)
          pressure = Math.max(updateBestPathMap(rest), pressure)
        }
        bestPathMap[key] = pressure
      }
      return bestPathMap[key]
    }

    updateBestPathMap(workingValves)

    const pressure = Object.keys(bestPathMap).reduce((bestPressure, key) => {
      const humanPath = key
      const elephantPath = workingValves
        .filter((valve) => !humanPath.includes(valve))
        .sort()
        .join('')

      const humanPressure = bestPathMap[humanPath]
      const elephantPressure = bestPathMap[elephantPath]

      return Math.max(bestPressure, humanPressure + elephantPressure)
    }, 0)

    console.log(
      `Working together with the elephant for 26 minutes, ${pressure} pressure could be released.`
    )
  }

  part2()
}
