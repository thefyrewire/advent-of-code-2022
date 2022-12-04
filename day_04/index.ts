export module Day_04 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_04/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const pairs = lines.map((line) =>
    line.split(',').map((pair) => pair.split('-').map((n) => parseInt(n)))
  )

  /**
   * PART 1
   */
  const part1 = () => {
    const contained = pairs.filter(
      ([[a1, a2], [b1, b2]]) => (a1 >= b1 && a2 <= b2) || (a1 <= b1 && a2 >= b2)
    ).length
    console.log(
      `There are ${contained} assignment pairs in which a range fully contains the other.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const overlapped = pairs.filter(
      ([[a1, a2], [b1, b2]]) => (a1 >= b2 && a2 <= b1) || (a1 <= b2 && a2 >= b1)
    ).length
    console.log(`There are ${overlapped} assignment pairs in which a range overlaps.`)
  }

  part2()
}
