export module Day_01 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_01/input.txt', 'utf8')
  const lines: number[] = input.split('\r\n').map((n: string) => parseInt(n))

  const sums = lines.reduce((acc, val, i) => {
    if (i === 0) return [val]
    if (isNaN(val)) return [...acc, 0]
    const lastGroup = acc[acc.length - 1]
    if (lastGroup === 0) return [...acc.slice(0, acc.length - 1), val]
    return [...acc.slice(0, acc.length - 1), lastGroup + val]
  }, [] as number[])

  /**
   * PART 1
   */
  const part1 = () => {
    const mostCalories = Math.max(...sums)
    console.log(
      `The elf with the most calories is carrying ${mostCalories} calories.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    sums.sort((a, b) => b - a)
    const top3Summed = sums.slice(0, 3).reduce((a, v) => a + v, 0)
    console.log(
      `The total calories carried by the top three elves is ${top3Summed} calories.`
    )
  }

  part2()
}
