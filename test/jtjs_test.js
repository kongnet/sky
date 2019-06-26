/* global describe */
/* global it */
/* global $ */
'use strict'
let should = chai.should()

describe('Array原型扩展的单元测试', function () {
  it('copy', function () {
    should.equal([1].copy()[0], 1)
    let a = [0, 1]
    let b = a.copy()
    a[0] = 1
    should.equal(a[0] !== b[0], true)
  })
  it('count', function () {
    should.equal(JSON.stringify(['A', 'B', 'B', 'C', 'A', 'D'].count()), '{"A":2,"B":2,"C":1,"D":1}')
  })
  it('flatten', function () {
    should.equal([1, [2, [3, [4, 5], 6], 7], 8].flatten().join(''), '12345678')
  })
  it('orderBy', function () {
    should.equal(JSON.stringify([{ name: 'A', age: 48 }, { name: 'B', age: 36 }, { name: 'C', age: 26 }].orderBy(['age'], ['asc', 'desc'])), '[{"name":"C","age":26},{"name":"B","age":36},{"name":"A","age":48}]')
    should.equal(JSON.stringify([{ name: 'A', age: 48 }, { name: 'B', age: 36 }, { name: 'C', age: 26 }].orderBy(['age'], ['desc'])), '[{"name":"A","age":48},{"name":"B","age":36},{"name":"C","age":26}]')
    should.equal(JSON.stringify([{ name: 'A', age: 48 }, { name: 'B', age: 36 }, { name: 'C', age: 26 }].orderBy(['age'])), '[{"name":"C","age":26},{"name":"B","age":36},{"name":"A","age":48}]')
    should.equal(JSON.stringify([{ name: 'A', age: 48 }, { name: 'B', age: 36 }, { name: 'C', age: 26 }].orderBy(['name'])), '[{"name":"A","age":48},{"name":"B","age":36},{"name":"C","age":26}]')
  })
  it('equals', function () {
    let r = [].equals()
    should.equal(r, false)
    r = [].equals([])
    should.equal(r, true)
    r = [].equals([1])
    should.equal(r, false)
    r = [[2]].equals([[1]])
    should.equal(r, false)
    r = [[{ a: 1 }]].equals([[{ a: 2 }]]) // 对象是相等的
    should.equal(r, true)
    r = [[NaN]].equals([[NaN]])
    should.equal(r, true)
  })
  it('unique', function () {
    let r = [undefined, null, 1, 1, '1', '1', null, undefined, NaN, NaN].unique()
    should.equal(r.equals([ undefined, null, 1, '1', NaN ]), true) // 用JSON.stringify 会错误
  })
  it('intersect', function () {
    let r = [undefined, true, null, 1, 1, false, '1', '1', null, 'undefined', NaN, NaN].intersect([1, '1', 'undefined', undefined, 2, '5', true, null, false, NaN])
    should.equal(r.equals([ undefined, true, null, 1, false, '1', 'undefined', NaN ]), true)
    r = [undefined, true, null, 1, 1, false, '1', '1', null, 'undefined', NaN, NaN].intersect()
    should.equal(r.equals([]), true)
    r = [1, 2, 3].intersect([3, 4, 5])
    should.equal(r.equals([3]), true)
  })
  it('union', function () {
    let r = [undefined, true, null, 1, 1, '1', '1', null, 'undefined', NaN, NaN].union([1, '1', 'undefined', undefined, 2, '5', true, null])
    should.equal(r.equals([ undefined, true, null, 1, '1', 'undefined', NaN, 2, '5' ]), true)
    r = [undefined, true, null, 1, 1, '1', '1', null, 'undefined', NaN, NaN].union()
    should.equal(r.equals([undefined, true, null, 1, '1', 'undefined', NaN]), true)
    r = [1, 2, 3].union([3, 4, 5])
    should.equal(r.equals([1, 2, 3, 4, 5]), true)
  })
  it('except', function () {
    let r = [1, 2, 3, 4].except([2, 3, 5])
    should.equal(r.equals([1, 4]), true)
    r = [2, 3, 5].except([1, 2, 3, 4])
    should.equal(r.equals([5]), true)
    r = [2, 3, 5].except()
    should.equal(r.equals([2, 3, 5]), true)
    r = [undefined, true, null, 1, 1, '1', '1', null, 'undefined', NaN, NaN].except([1, '1', 'undefined', undefined, 2, '5', true, null])
    should.equal(r.equals([NaN]), true)
  })
  it('subset', function () {
    let r = ['1', undefined, NaN, NaN].subset([undefined, null, 1, 1, '1', '1', null, undefined, NaN, NaN])
    should.equal(r, true)
    r = ['2', 2].subset([undefined, null, 1, 1, '1', '1', null, undefined, NaN, NaN])
    should.equal(r, false)
    r = ['1', null, 3, NaN].subset([undefined, null, 1, 1, '1', '1', null, undefined, NaN, NaN])
    should.equal(r, false)
    r = [undefined, null, NaN, undefined, undefined].subset([undefined, null, 1, 1, '1', '1', null, undefined, NaN, NaN])
    should.equal(r, true)
  })
  it('mean', function () {
    should.equal([1, 2, 3, 4, 5].mean(), 3)
  })
  it('median', function () {
    should.equal([1, 2, 3, 4, 5, 6].median(), 3.5)
    should.equal([1, 2, 3, 4, 5].median(), 3)
    should.equal([].median(), 0)
  })
  it('remove', function () {
    should.equal([1, 2, 3, 4, 5].remove()[0], 2)
    should.equal([1, 2, 3, 4, 5].remove(1, 2)[1], 4)
  })
})
describe('Date原型扩展的单元测试', function () {
  var d1 = new Date('2015-12-29 01:11:01')
  var d2 = new Date('2016-01-02 20:09:31')
  var d3 = new Date('2018-01-01 20:09:31')
  it('getWeek', function () {
    should.equal(52, d1.getWeek())
    should.equal(52, d2.getWeek())
    should.equal(1, d3.getWeek())
  })
  it('format', function () {
    should.equal('2015-12-29 01:11:01', d1.format())
    should.equal(+new Date('2015-12-29 01:11:01') / 1000 | 0, +d1.format('X'))
    should.equal('2015/12/29', d1.format('yyyy/MM/dd'))
    should.equal('2015/12/29/011101', d1.format('YYYY/MM/DD/HHmmss'))
    should.equal('20151229011101', d1.format('YYYYMMDDHHmmss'))
    should.equal('2015-12-29 01:11:01', d1.format('YYYY-MM-DD HH:mm:ss'))
    should.equal('2015-12-29 01:11:01', d1.format('yyyy-MM-dd hh:mm:ss'))
    should.equal('2015-12-29 01:11:01 52 4', d1.format('yyyy-MM-dd hh:mm:ss ww q'))
  })
  it('date2Str', function () {
    should.equal('2015-12-29 01:11:01', d1.date2Str())
    should.equal('2016-01-02 20:09:31', d2.date2Str())
  })
  it('date8', function () {
    should.equal('20151229', d1.date8())
    should.equal('20160102', d2.date8())
    should.equal('2016-01-02', d2.date8('-'))
  })
  it('dateAdd年', function () {
    should.equal('2016-12-29 01:11:01', d1.dateAdd('y', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('y', -1).date2Str())
  })
  it('dateAdd季度', function () {
    should.equal('2016-03-29 01:11:01', d1.dateAdd('q', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('q', -1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('q', 0).date2Str())
  })
  it('dateAdd月', function () {
    should.equal('2016-01-29 01:11:01', d1.dateAdd('M', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('M', -1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('M', 0).date2Str())
    should.equal('2015-12-29 01:11:01', d1.offset('M', 0).date2Str())
  })
  it('dateAdd周', function () {
    should.equal('2016-01-05 01:11:01', d1.dateAdd('w', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('w', -1).date2Str())
  })
  it('dateAdd日', function () {
    should.equal('2015-12-30 01:11:01', d1.dateAdd('d', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('d', -1).date2Str())
  })
  it('dateAdd时', function () {
    should.equal('2015-12-29 02:11:01', d1.dateAdd('h', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('h', -1).date2Str())
  })
  it('dateAdd分', function () {
    should.equal('2015-12-29 01:12:01', d1.dateAdd('m', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('m', -1).date2Str())
  })
  it('dateAdd秒', function () {
    should.equal('2015-12-29 01:11:02', d1.dateAdd('s', 1).date2Str())
    should.equal('2015-12-29 01:11:01', d1.dateAdd('s', -1).date2Str())
  })

  it('dateDiff', function () {
    // should.equal(0,d1.dateDiff('y',d2));
  })
})
describe('Number原型扩展的单元测试', function () {
  it('round', function () {
    should.equal(1.123457, 1.123456789.round(6))
    should.equal(1, 1.123456789.round(0))
    should.equal(1, (1.123456789).round(0))
    should.equal(1, (1).round(0))
  })
  it('isPrime', function () {
    should.equal(true, (2).isPrime()) // 9007199254740881 安全数中最大的质数
    should.equal(false, (4).isPrime())
    should.equal(true, (13).isPrime())
    should.equal(false, (15).isPrime())
  })
})
describe('String原型扩展的单元测试', function () {
  it('upperFirst', function () {
    should.equal('Ab', 'ab'.upperFirst())
    should.equal('Ab', 'AB'.upperFirst())
  })
  it('fillStr', function () {
    should.equal('abaaaa', 'ab'.fillStr('a', 6))
    should.equal('ab    ', 'ab'.fillStr(' ', 6))
    should.equal('ababab', 'ababab'.fillStr(' ', 6))
    should.equal('ababab', 'ababab'.fillStr(' ', 6, 1))
    should.equal('ababab', 'ababab'.fillStr(' ', 6, -1))
    should.equal('00000008', '8'.fillStr('0', 8, -1))
  })
  it('toMoney', function () {
    should.equal('-9,812,345,678.45678901', '-9812345678.45678901'.toMoney())
    should.equal('9,812,345,678.45678901', '9812345678.45678901'.toMoney())
    should.equal('-9,812,345,678.45', '-9812345678.45678901'.toMoney(2))
    should.equal('-9,812,345,678', '-9812345678.45678901'.toMoney(0))
    should.equal('0.45', '.45678901'.toMoney(2))
    should.equal('-0.45', '-.45678901'.toMoney(2))
    should.equal(2, 'abc'.toMoney(2))
  })
  it('replaceAll', function () {
    should.equal('aaaxxxccc', 'aaabbbccc'.replaceAll('b', 'x'))
  })
  it('times', function () {
    should.equal('xxx', 'x'.times(3))
    should.equal('', 'x'.times(0))
  })
  it('trim', function () {
    should.equal('xxx', ' xxx   '.trim())
    should.equal('x x x', ' x x x   '.trim())
  })
  it('toLow', function () {
    should.equal('abc1', 'ABC1'.toLow())
  })
  it('toUp', function () {
    should.equal('ABC1', 'abc1'.toUp())
  })
  it('format', function () {
    should.equal('abcdefg1', 'a{0}c{1}e{2}g{3}'.format('b', 'd', 'f', 1))
  })
  it('len', function () {
    should.equal(5, '我们a'.len())
  })
  it('toInt', function () {
    should.equal(12, '12.3'.toInt())
  })
  it('esHtml', function () {
    should.equal('&amp;&lt;&gt;', '&<>'.esHtml())
  })
  it('toHtml', function () {
    should.equal('&<>', '&amp;&lt;&gt;'.toHtml())
  })
  it('reHtml', function () {
    should.equal('xxyy', '<div><a>xx</a><div><div>yy</div>'.reHtml())
  })
  it('camelize', function () {
    should.equal('aBC', 'a-b-c'.camelize())
  })
  it('ac', function () {
    should.equal('ab c', 'ab'.ac('c'))
  })
  it('dc', function () {
    should.equal('ab', 'ab c'.dc('c'))
  })
  it('tc', function () {
    should.equal('ab c', 'ab'.tc('c'))
    should.equal('ab', 'ab c'.tc('c'))
  })
})
