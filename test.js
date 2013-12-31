var assert = require('assert')
  , Benchmark = require('benchmark')
  , suite = new Benchmark.Suite
  , benchmarks = require('./index')

function getRandom() {
  return Math.floor(Math.random() * 381)
}

function getSlow() {
  var out = Math.floor(Math.random() * 381)
  return out > 67 && out < 193 ? blaaaah(out) : out
}

function getSlowRandom() {
  var out = Math.floor(Math.random() * 381)
  return out > 354 && out < 355 ? blaaaah(out) : out
}

function blaaaah(num) {
  // consume excess time for absolutely no reason at all
  for (var i = 0; i < num * num; i++) {
    num % num
  }
  return num
}

suite.add('current', function() {
  return getRandom() < 0 ? true : false
})
.add('legacy', function() {
  return ~getRandom() ? false: true
})
.add('very blaaaah', function() {
  return ~getSlow() ? false: true
})
.add('random blaaaah', function() {
  return ~getSlowRandom() ? false: true
})
.on('cycle', function(event) {
  benchmarks.add(event.target)
})
.on('start', function(event) {
  console.log('\n  Starting...')
})
.on('complete', function() {
  benchmarks.log()
})
.run({ 'async': false })