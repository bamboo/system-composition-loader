#metaimport masakari
#metaimport hash-require

#require
  mori
    conj
    count
    filter
    into_array
    map
    reduce
    update_in
  require-all
  underscore
    extend
  system-composition
    singleton

refer Object keys

fun component-for module ->
  if (module instanceof Function) module
  else singleton module

fun components-from-dir dir ->
"""
Loads multiple components from a dir into a map ready to be used with #compose.

The simple file name of each module becomes the identifier for the
associated component in the resulting map.
"""
  var modules = require-all dir
  (keys modules).reduce
    (components, k) ->
      components[k] = component-for modules[k]
      components
    {}

fun check-for-duplicates components-per-source -> do!
  var errors = |>>
    components-per-source
    reduce
      fun (acc, {source, components}) ->
        (keys components).reduce
          (acc, c) -> update_in (acc, [c], cur -> conj (cur, source))
          acc
      ::{}
    filter fun [c, sources] ->
      (count sources) > 1
    map fun [c, sources] ->
      var s = sources |>>
        map #-> "`" + #it + "'"
        into_array
      "Component `" + c + "' is defined more than once (" + (s.sort ().join ', ') + ")"
    into_array
  if (errors.length)
    throw Error errors.join '\n'

fun components-from-dirs dirs ->
  var components-per-source = dirs.map #-> {source: #it, components: components-from-dir #it}
  check-for-duplicates components-per-source
  extend.apply (null, components-per-source.map #-> #it.components)

#export
  check-for-duplicates
  components-from-dir
  components-from-dirs
