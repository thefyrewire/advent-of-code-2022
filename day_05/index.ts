export module Day_05 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_05/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const breakpoint = lines.findIndex((e) => e.length === 0)
  const stacks = lines.slice(0, breakpoint - 1)
  const moves = lines.slice(breakpoint + 1, lines.length)

  const parsedStacks = stacks.map((l) =>
    l
      .split('')
      .map((c) => (c === '[' || c === ']' ? ' ' : c))
      .slice(1, -1)
  )

  const transposed = parsedStacks
    .reduce((cols, row) => {
      row.forEach((col, i) => (cols[i] = cols[i] || []).unshift(col))
      return cols
    }, [] as string[][])
    .filter((col) => !col.every((e) => e === ' '))
    .map((col) => col.filter((e) => e !== ' '))

  /**
   * PART 1
   */
  const part1 = () => {
    const rearranged = moves.reduce((result, move) => {
      const [, qty, , _from, , _to] = move.split(' ')
      const [from, to] = [_from, _to].map((n) => parseInt(n) - 1)
      for (let i = 0; i < parseInt(qty); i += 1) {
        result[to].push(...result[from].splice(-1, 1))
      }
      return result
    }, JSON.parse(JSON.stringify(transposed)) as string[][])

    const message = rearranged.map((col) => col.at(-1)).join('')

    console.log(
      `After the rearrangement procedure, the crates that end up on the top of each stack are ${message}.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const rearranged = moves.reduce((result, move) => {
      const [, _qty, , _from, , _to] = move.split(' ')
      const [from, to] = [_from, _to].map((n) => parseInt(n) - 1)
      const qty = parseInt(_qty)
      result[to].push(...result[from].splice(-1 * qty, qty))
      return result
    }, JSON.parse(JSON.stringify(transposed)) as string[][])

    const message = rearranged.map((col) => col.at(-1)).join('')

    console.log(
      `After the rearrangement procedure using the CrateMover 9001, the crates that end up on the top of each stack are ${message}.`
    )
  }

  part2()
}
