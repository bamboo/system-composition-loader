#metaimport masakari
#metaimport hash-require

#external (describe, it)

#require
  '../index'
    check-for-duplicates
    components-from-dirs
  chai expect

describe
  '#components-from-dirs'
  #->
    it
      'returns single map holding all components from all dirs'
      #->
        var dirs = ['f1', 'f2'].map #-> #external __dirname + '/fixtures/' + #it
        var components = components-from-dirs dirs
        (expect Object.keys components).to.eql (['a', 'b', 'c'])

describe
  '#check-for-duplicates'
  #->
    it
      'throws when duplicates are found'
      #->
        var spec = [
          {source: 'a', components: {foo: 'foo', bar: 'bar'}}
          {source: 'b', components: {foo: 'foo'}}]
        var expected-message = "`foo' is defined more than once (`a', `b')"
        (expect #-> check-for-duplicates spec).to.throw expected-message
