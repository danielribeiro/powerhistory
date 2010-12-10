require 'coffeecompiler'

# Watchr script that compiles all coffee files.
puts "Watching coffeescript files..."
comp = CoffeeCompiler.new
watch '.*\.coffee'  do |f|
  comp.compile f[0]
end
