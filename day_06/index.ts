export module Day_06 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_06/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const letters = lines[0].split('')

  const findUniqueWindow = (window: number) => {
    return letters.reduce(
      ({ pos, found }, _, index, arr) => {
        if (found) return { pos, found }
        const slice = arr.slice(index, index + window)
        const unique = Array.from(new Set(slice)).length === slice.length
        return { pos: unique ? pos : pos + 1, found: unique }
      },
      { pos: window, found: false }
    ).pos
  }

  /**
   * PART 1
   */
  const part1 = () => {
    const position = findUniqueWindow(4)

    console.log(
      `The number of characters that need to be processsed before the first start-of-packet marker is detected is ${position}.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const position = findUniqueWindow(14)

    console.log(
      `The number of characters that need to be processsed before the first start-of-packet marker is detected is ${position}.`
    )
  }

  part2()
}
