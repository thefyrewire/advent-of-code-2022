export module Day_08 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_08/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  const forest = lines.map((row) => row.split('').map((n) => parseInt(n)))

  /**
   * PART 1
   */
  const part1 = () => {
    const visible = forest.reduce((count, row, rowIdx, rowArr) => {
      const rowCount = row.reduce((colCount, col, colIdx, colArr) => {
        const rows = rowArr.length - 1
        const cols = colArr.length - 1
        if (rowIdx === 0 || rowIdx >= rows || colIdx === 0 || colIdx >= cols)
          return colCount + 1
        const t = rowArr
          .slice(0, rowIdx)
          .map((row) => row[colIdx])
          .every((n) => n < col)
        const b = rowArr
          .slice(rowIdx + 1)
          .map((row) => row[colIdx])
          .every((n) => n < col)
        const l = row.slice(0, colIdx).every((n) => n < col)
        const r = row.slice(colIdx + 1).every((n) => n < col)
        return t || b || l || r ? colCount + 1 : colCount
      }, 0)
      return count + rowCount
    }, 0)

    console.log(`There are ${visible} visible trees from outside the grid.`)
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const forestScores = forest.reduce((scores, row, rowIdx, rowArr) => {
      const rowScores = row.reduce((colScores, col, colIdx, colArr) => {
        const rows = rowArr.length - 1
        const cols = colArr.length - 1
        if (rowIdx === 0 || rowIdx >= rows || colIdx === 0 || colIdx >= cols)
          return colScores
        const t = rowArr
          .slice(0, rowIdx)
          .map((row) => row[colIdx])
          .reverse()
        const b = rowArr.slice(rowIdx + 1).map((row) => row[colIdx])
        const l = row.slice(0, colIdx).reverse()
        const r = row.slice(colIdx + 1)

        const treeScores = [t, b, l, r].map(
          (arr) =>
            arr.reduce(
              ({ score, stop }, height) =>
                stop
                  ? { score, stop }
                  : {
                      score: score + 1,
                      stop: height >= col,
                    },
              { score: 0, stop: false }
            ).score
        )
        const score = treeScores.reduce((a, v) => a * v, 1)
        return [...colScores, score]
      }, [] as number[])
      return [...scores, ...rowScores]
    }, [] as number[])

    const score = Math.max(...forestScores)

    console.log(`The highest possible scenic score for any tree is ${score}.`)
  }

  part2()
}
