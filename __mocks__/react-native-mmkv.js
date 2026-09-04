const store = new Map();

function createMMKV() {
  return {
    set: (key, value) => {
      store.set(key, String(value));
    },
    getString: (key) => store.get(key),
    remove: (key) => store.delete(key),
    clearAll: () => {
      store.clear();
    },
  };
}

module.exports = {
  createMMKV,
};
