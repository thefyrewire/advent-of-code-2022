export module Day_02 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_02/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  type Shape = 'rock' | 'paper' | 'scissors'
  type Outcome = 'lose' | 'draw' | 'win'

  const score: Record<Shape, number> = {
    rock: 1,
    paper: 2,
    scissors: 3,
  }

  const points: Record<Outcome, number> = {
    lose: 0,
    draw: 3,
    win: 6,
  }

  /**
   * PART 1
   */
  const part1 = () => {
    const shape: Record<string, Shape> = {
      A: 'rock',
      B: 'paper',
      C: 'scissors',
      X: 'rock',
      Y: 'paper',
      Z: 'scissors',
    }

    const determineOutcome = (opp: string, you: string): Outcome => {
      const oppInd = shape[opp]
      const youInd = shape[you]

      const diff = score[youInd] - score[oppInd]
      switch (diff) {
        case 1:
        case -2:
          return 'win'
        case 0:
          return 'draw'
        default:
          return 'lose'
      }
    }

    const calculateScore = (pair: string): number => {
      const [opp, you] = pair.split(' ')
      const shapeScore = score[shape[you]]
      const outcomeScore = points[determineOutcome(opp, you)]
      return shapeScore + outcomeScore
    }

    const total = lines.map(calculateScore).reduce((a, v) => a + v, 0)
    console.log(
      `The total score if everything goes exactly according to the strategy guide is ${total}.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const shape: Record<string, Shape> = {
      A: 'rock',
      B: 'paper',
      C: 'scissors',
    }

    const outcome: Record<string, Outcome> = {
      X: 'lose',
      Y: 'draw',
      Z: 'win',
    }

    const rule: Shape[] = ['rock', 'paper', 'scissors']

    const determinePlay = (opp: string, out: string): Shape => {
      const oppShape = shape[opp]
      const outOutcome = outcome[out]

      switch (outOutcome) {
        case 'draw':
          return oppShape
        case 'lose': {
          const oppInd = rule.indexOf(oppShape)
          const youInd = oppInd - 1 < 0 ? rule.length - 1 : oppInd - 1
          return rule[youInd]
        }
        case 'win': {
          const oppInd = rule.indexOf(oppShape)
          const youInd = oppInd + 1 >= rule.length ? 0 : oppInd + 1
          return rule[youInd]
        }
      }
    }

    const calculateScore = (pair: string): number => {
      const [opp, out] = pair.split(' ')
      const shapeScore = score[determinePlay(opp, out)]
      const outcomeScore = points[outcome[out]]
      return shapeScore + outcomeScore
    }

    const total = lines.map(calculateScore).reduce((a, v) => a + v, 0)
    console.log(
      `Using the Elf's instructions, the total score if everything goes exactly according to the strategy guide is ${total}.`
    )
  }

  part2()
}
