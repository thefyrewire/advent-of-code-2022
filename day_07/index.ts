export module Day_07 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_07/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const readFileSystem = ({ total = 0, i = 0, dirSizes = [] as number[] }) => {
    let sum = 0
    for (i; i < lines.length; i += 1) {
      const line = lines[i]
      const filesize = Number(line.split(' ')[0])
      if (line.startsWith('$ cd')) {
        const dir = line.slice(5)
        if (dir === '..') break
        const updated = readFileSystem({ total, i: (i += 1), dirSizes })
        sum += updated.sum
        total = updated.total
        i = updated.i
        dirSizes = updated.dirSizes
      } else if (!isNaN(filesize)) {
        sum += filesize
      }
    }
    if (sum <= 100000) total += sum
    dirSizes.push(sum)
    return { sum, total, i, dirSizes }
  }

  /**
   * PART 1
   */
  const part1 = () => {
    const { total } = readFileSystem({})

    console.log(
      `The sum of the total sizes of directories less than 100,000 in size is ${total}.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const TOTAL_SPACE = 70000000
    const MIN_SPACE = 30000000

    const { sum, dirSizes } = readFileSystem({})

    const goal = MIN_SPACE - (TOTAL_SPACE - sum)
    const dirDelete = Math.min(...dirSizes.sort().filter((n) => n > goal))

    console.log(
      `The total size of the directory that should be deleted to free enough room for the update is ${dirDelete}.`
    )
  }

  part2()
}
