export module Day_11 {
  const fs = require('fs')
  const input = fs.readFileSync('./day_11/input.txt', 'utf8')
  const lines: string[] = input.split('\r\n')

  interface MonkeyProps {
    id: MonkeyId
    items: Items
    op: MonkeyOp
    test: MonkeyTest
    inspectFn: (item: Item, op: MonkeyOp) => Item
    throwFn: (item: Item, test: MonkeyTest) => ItemThrow
  }

  type MonkeyId = number

  interface MonkeyOp {
    type: '+' | '-' | '*' | '/'
    amount: number | 'old'
  }

  interface MonkeyTest {
    divisible: number
    true: number
    false: number
  }

  type Item = number
  type Items = Item[]

  type ItemThrow = [MonkeyId, Item]

  class Monkey {
    id: MonkeyId
    private items: Items
    private op: MonkeyOp
    private test: MonkeyTest
    inspected = 0
    inspectFn: (item: Item, op: MonkeyOp) => Item
    throwFn: (item: Item, test: MonkeyTest) => ItemThrow

    constructor({ id, items, op, test, inspectFn, throwFn }: MonkeyProps) {
      this.id = id
      this.items = items
      this.op = op
      this.test = test
      this.inspectFn = inspectFn
      this.throwFn = throwFn
    }

    private inspect(item: Item): Item {
      this.inspected += 1
      return this.inspectFn(item, this.op)
    }

    private throw(item: Item): ItemThrow {
      return this.throwFn(item, this.test)
    }

    tick(): ItemThrow[] {
      const throws = this.items.map((item) => this.throw(this.inspect(item)))
      this.items = []
      return throws
    }

    addItem(item: Item) {
      this.items = [...this.items, item]
    }
  }

  const monkeyData = lines
    .map((line) => line.trim())
    .reduce<MonkeyProps[]>((acc, val) => {
      const rest = acc.slice(0, -1)
      const last = (acc.at(-1) as unknown) as MonkeyProps

      if (val.startsWith('Monkey '))
        return [
          ...acc,
          { id: parseInt(val.slice(7).slice(0, -1)) } as MonkeyProps,
        ]
      else if (val.startsWith('Starting items: '))
        return [
          ...rest,
          {
            ...last,
            items: val
              .slice(16)
              .split(',')
              .map((n) => parseInt(n.trim())),
          },
        ]
      else if (val.startsWith('Operation: new = old ')) {
        const [type, amount] = val.slice(21).split(' ')
        return [
          ...rest,
          {
            ...last,
            op: {
              type,
              amount: amount === 'old' ? 'old' : parseInt(amount),
            } as MonkeyOp,
          },
        ]
      } else if (val.startsWith('Test: divisible by '))
        return [
          ...rest,
          {
            ...last,
            test: {
              ...last.test,
              divisible: parseInt(val.slice(19)),
            },
          },
        ]
      else if (val.startsWith('If true: throw to monkey '))
        return [
          ...rest,
          {
            ...last,
            test: {
              ...last.test,
              true: parseInt(val.slice(25)),
            },
          },
        ]
      else if (val.startsWith('If false: throw to monkey '))
        return [
          ...rest,
          {
            ...last,
            test: {
              ...last.test,
              false: parseInt(val.slice(26)),
            },
          },
        ]

      return acc
    }, [])

  /**
   * PART 1
   */
  const part1 = () => {
    const monkeys = monkeyData.map(
      (monkey) =>
        new Monkey({
          ...monkey,
          inspectFn: (item, op) => {
            const amount = op.amount === 'old' ? item : op.amount
            switch (op.type) {
              case '+':
                return Math.floor((item + amount) / 3)
              case '-':
                return Math.floor((item - amount) / 3)
              case '*':
                return Math.floor((item * amount) / 3)
              case '/':
                return Math.floor(item / amount / 3)
            }
          },
          throwFn: (item, test) => {
            return item % test.divisible === 0
              ? [test.true, item]
              : [test.false, item]
          },
        })
    )

    for (let i = 0; i < 20; i += 1) {
      for (const monkey of monkeys) {
        const throws = monkey.tick()
        throws.forEach(([id, item]) => monkeys[id].addItem(item))
      }
    }

    const monkeyBusiness = monkeys
      .map((monkey) => monkey.inspected)
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((a, v) => a * v, 1)

    console.log(
      `The level of monkey business after 20 rounds is ${monkeyBusiness}.`
    )
  }

  part1()

  /**
   * PART 2
   */
  const part2 = () => {
    const mod = monkeyData
      .map((monkey) => monkey.test.divisible)
      .reduce((a, v) => a * v, 1)

    const monkeys = monkeyData.map(
      (monkey) =>
        new Monkey({
          ...monkey,
          inspectFn: (item, op) => {
            const amount = op.amount === 'old' ? item : op.amount
            switch (op.type) {
              case '+':
                return item + amount
              case '-':
                return item - amount
              case '*':
                return item * amount
              case '/':
                return item / amount
            }
          },
          throwFn: (item, test) => {
            item = item % mod
            return item % test.divisible === 0
              ? [test.true, item]
              : [test.false, item]
          },
        })
    )

    for (let i = 0; i < 10000; i += 1) {
      for (const monkey of monkeys) {
        const throws = monkey.tick()
        throws.forEach(([id, item]) => monkeys[id].addItem(item))
      }
    }

    const monkeyBusiness = monkeys
      .map((monkey) => monkey.inspected)
      .sort((a, b) => b - a)
      .slice(0, 2)
      .reduce((a, v) => a * v, 1)

    console.log(
      `The level of monkey business after 10,000 rounds with ridiculous but manageable worry levels is ${monkeyBusiness}.`
    )
  }

  part2()
}
