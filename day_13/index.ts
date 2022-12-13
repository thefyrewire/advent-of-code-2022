export module Day_13 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_13/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const data = lines.reduce((acc, val) => {
    if (!val) return [...acc, []]
    return [...acc.slice(0, -1), [...acc.slice(-1).flat(), JSON.parse(val)]]
  }, [] as number[][])

  const pairs = data.map((pair, i) => ({ id: i + 1, pair }))

  const checkPair = (a: number | number[], b: number | number[]): number => {
    if (typeof a === 'number' && typeof b === 'number') return Math.sign(a - b)

    if (typeof a === 'undefined') return -1
    if (typeof b === 'undefined') return 1

    if (typeof a === 'number') a = [a]
    if (typeof b === 'number') b = [b]

    for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
      const ok = checkPair(a[i], b[i])
      if (ok !== 0) return ok
    }

    return 0
  }

  /**
   * PART 1
   */
  const part1 = () => {
    const filteredPairs = pairs
      .filter(({ pair: [a, b] }) => checkPair(a, b) === -1)
      .map((pair) => pair.id)

    const sum = filteredPairs.reduce((a, v) => a + v, 0)

    console.log(`The sum of indices of correctly ordered pairs is ${sum}.`)
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const packets = [...lines, '[[2]]', '[[6]]']
      .filter((n) => n)
      .map((l) => JSON.parse(l))

    packets.sort((a, b) => checkPair(a, b))

    const decoderKey = packets
      .reduce<number[]>(
        (decoders, packet, i) =>
          JSON.stringify(packet) === '[[2]]' ||
          JSON.stringify(packet) === '[[6]]'
            ? [...decoders, i + 1]
            : decoders,
        []
      )
      .reduce((a, v) => a * v, 1)

    console.log(`The decoder key for the distress signal is ${decoderKey}.`)
  }

  part2()
}
