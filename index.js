exports.add = add
exports.log = log
exports.store = []
exports.numCompleted = 0

var l_name = 0
  , l_ops = 0
  , ops_arr = []
  , ops_top
  // Using Mocha's coloring
  // https://github.com/visionmedia/mocha/blob/master/lib/reporters/base.js#L100
  , colors = {
      'pass': 90
    , 'fail': 31
    , 'pending': 36
    , 'suite': 0
    , 'fast': 90
    , 'medium': 33
    , 'slow': 31
    , 'green': 32
  }

console.log('')

function add(bench) {
  exports.store.push(bench)
  process.stdout.write('  '
    + color('pending', (++exports.numCompleted))
    + ' tests completed.\u000D')
}

function log() {
  exports.numCompleted = 0

  console.log('\n')

  exports.store.forEach(function(bench) {
    var len = (bench.name || (Number.isNaN(id) ? id : '<Test #' + id + '>')).length
    l_name = len > l_name ? len : l_name
    var ops = bench.hz.toFixed(bench.hz < 100 ? 2 : 0)
    l_ops = formatNumber(ops).length > l_ops ? formatNumber(ops).length : l_ops
    ops_arr.push(ops)
  });
  ops_top = Math.max.apply(Math, ops_arr);
  ops_arr = []

  exports.store.forEach(logBench);
  console.log('')
}

function logBench(bench) {
  var error = bench.error
    , hz = bench.hz
    , id = bench.id
    , stats = bench.stats
    , size = stats.sample.length
    , result = bench.name || (Number.isNaN(id) ? id : '<Test #' + id + '>')
    , ops = hz.toFixed(hz < 100 ? 2 : 0)
    , deviation = stats.rme.toFixed(2)
    , percent = ops / ops_top

  if (error) {
    result += ': ' + color('fail', join(error))
  } else {
    result += makeSpace(l_name - result.length)
      + color('pass', ' x ')
      + makeSpace(l_ops - formatNumber(ops).length)
      + color(
          percent > .95  ? 'green'
        : percent > .8   ? 'medium'
        : 'slow', formatNumber(ops))
      + ' ops/sec '
      + color('pass', '\xb1')
      + color(
          deviation > 5 ? 'slow'
        : deviation > 2 ? 'medium'
        : 'green', deviation)
      + color('pending', '% ')
      + '\u001b[' + colors['pass'] + 'm('
        + size
        + ' run' + (size == 1 ? '' : 's')
        + ' sampled)'
      + '\u001b[0m'
  }
  console.log('  ' + result)
}

function makeSpace(len) {
  var out = ''
  for (var i = len - 1; i >= 0; i--) out += ' '
  return out
}

function color(type, str) {
  return '\u001b[' + colors[type] + 'm' + str + '\u001b[0m'
}

function formatNumber(number) {
  number = String(number).split('.')
  return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',')
    + (number[1] ? '.' + number[1] : '')
}

function join(object) {
  var result = []
    , length = (object = Object(object)).length
    , arrayLike = length === length >>> 0

  for (key in object) {
    var value = object[key]
    result.push(arrayLike ? value : key + ': ' + value)
  }
  return result.join(',')
}