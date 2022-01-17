
const { from } = require('./index')

describe('from()', () => {
  it('takes key-int enum as an argument', () => {
    const flags = {
      GUESTROOM: 1,
      KITCHEN: 2,
    }

    expect(() => from(flags)).not.toThrow()
  })

  it('returns a (parser) function', () => {
    const permissions = { BILLING: 1, LOGS: 2 }

    const parseMask = from(permissions)

    expect(parseMask).toBeInstanceOf(Function)
  })
})

describe('parser', () => {
  it('parses a value that corresponds to exactly one flag', () => {
    const permissions = { BILLING: 1, LOGS: 2 }
    const parseMask = from(permissions)

    expect(parseMask(1)).toEqual({ BILLING: true, LOGS: false })
    expect(parseMask(2)).toEqual({ BILLING: false, LOGS: true })
  })

  it('parses a mask that contains two flags', () => {
    const permissions = { BILLING: 1, LOGS: 2, MEMBERS: 4 }
    const parseMask = from(permissions)

    const userPermissions = parseMask(5)

    expect(userPermissions.BILLING).toBe(true)
    expect(userPermissions.LOGS).toBe(false)
    expect(userPermissions.MEMBERS).toBe(true)
  })

  it('ignores out of bounds values in masks', () => {
    const permissions = { BILLING: 1, LOGS: 2 }
    const parseMask = from(permissions)

    expect(parseMask(4)).toEqual({ BILLING: false, LOGS: false })
    expect(parseMask(5)).toEqual({ BILLING: true, LOGS: false })
  })
})

describe('proxy', () => {
  it('polyfills a toJSON() prototype', () => {
    const permissions = { BILLING: 1, LOGS: 2 }
    const parseMask = from(permissions)

    const mask = parseMask(2)

    expect(mask.toJSON()).toEqual(2)

    const jsonOutput = { user: 'Sleavely', permissions: mask }
    expect(JSON.stringify(jsonOutput)).toEqual('{"user":"Sleavely","permissions":2}')
  })

  it('polyfills a valueOf() prototype', () => {
    const permissions = { BILLING: 1, LOGS: 2 }
    const parseMask = from(permissions)

    const mask = parseMask(2)

    expect(mask.valueOf()).toEqual(2)
    expect(mask - 1).toEqual(1)
  })

  it('changing the value of a key is reflected on serialized object', () => {
    const permissions = { BILLING: 1, LOGS: 2 }
    const parseMask = from(permissions)
    const mask = parseMask(2)

    expect(mask.BILLING).toBe(false)
    expect(mask.LOGS).toBe(true)

    mask.BILLING = true

    expect(mask.BILLING).toBe(true)
    expect(mask.LOGS).toBe(true)

    expect(mask.toJSON()).toEqual(3)
  })
})
