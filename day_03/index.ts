export module Day_03 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_03/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const letters = 'abcdefghijklmnopqrstuvwxyz'
  const priorities = `${letters}${letters.toUpperCase()}`.split('')

  /**
   * PART 1
   */
  const part1 = () => {
    const scores = lines.map((item) => {
      const item1 = item.substring(0, item.length / 2).split('')
      const item2 = item.substring(item.length / 2).split('')
      const duped = item1.find((l) => item2.includes(l))
      if (!duped) return 0
      return priorities.indexOf(duped) + 1
    })

    const sum = scores.reduce((a, v) => a + v, 0)

    console.log(`The sum of the properties of the item types is ${sum}.`)
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const groups = lines.reduce((acc, val, i) => {
      if (i % 3 === 0) return [...acc, [val]]
      return [...acc.slice(0, acc.length - 1), [...acc[acc.length - 1], val]]
    }, [] as string[][])
    
    const scores = groups.map(group => {
      const [g1, g2, g3] = group.map(g => g.split(''))
      const badge = g1.find(l => g2.includes(l) && g3.includes(l))
      if (!badge) return 0
      return priorities.indexOf(badge) + 1
    })

    const sum = scores.reduce((a, v) => a + v, 0)

    console.log(`The sum of the properties of the item types for each three-Elf group is ${sum}.`)
  }

  part2()
}
