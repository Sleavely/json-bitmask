
exports.from = (FLAGS = {}) => (mask = 0b0000000000000000) => {
  const compiledFlags = {}
  for (const key in FLAGS) {
    compiledFlags[key] = !!(FLAGS[key] & mask)
  }
  return new Proxy(compiledFlags, {
    get (target, prop, receiver) {
      // These methods should return the serialized mask
      if (['toJSON', 'valueOf'].includes(prop)) {
        return () => {
          return Object.entries(FLAGS).reduce((output, [key, value]) => {
            if (target[key]) return output + value
            return output
          }, 0)
        }
      }

      return Reflect.get(target, prop, receiver)
    },
    set (target, prop, value, receiver) {
      if (!Reflect.has(target, prop)) {
        throw new Error(`'${prop}' is not a valid FLAGS key.`)
      }

      return Reflect.set(target, prop, !!value, receiver)
    },
  })
}
