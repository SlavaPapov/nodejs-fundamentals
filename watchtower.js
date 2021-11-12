const EventEmitter = require("events");

class eventEmitterForCounters extends EventEmitter {
  constructor() {
    super();
    this.on("stop", (counter) => counter.stop());
    this.on("countdown", (counter) => counter.countdown());
  }
}

const Watchtower = (function () {
  let instance;

  function createInstance() {
    return new eventEmitterForCounters();
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance()
      }
      return instance;
    }
  }
})();

module.exports = Watchtower;