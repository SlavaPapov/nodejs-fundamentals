const Watchtower = require('./watchtower')

class Counter {
  constructor(timestamp) {
    const [hours, day, monthIndex, year] = timestamp.split('-')
    this.start_at = new Date()
    this.end_at = new Date(year, monthIndex - 1, day, hours)
    this.remainigCounts = this.end_at.getTime() - this.start_at.getTime()
    this.intervalIndex = undefined
    this.watchtower = Watchtower.getInstance()
  }
  isActive = () => this.remainigCounts > 0
  say = (message) => console.log(`Counter ${this.intervalIndex}: ${message};`)
  countdown = () => {
    this.remainigCounts--
    this.say(`${this.remainigCounts} counts remaining`)
  }
  stop = () => {
    clearInterval(this.intervalIndex)
    this.say(`stopped`)
  }
  start = () => {
    this.intervalIndex = setInterval(() => {
      if (this.isActive()) {
        this.watchtower.emit('countdown', this)
      } else {
        this.watchtower.emit('stop', this)
      }
    }, 1000)
    this.say(`started`)
    this.say(`\tstart_at ${this.start_at}`)
    this.say(`\tend_at   ${this.end_at}`)
  }
}

module.exports = Counter
