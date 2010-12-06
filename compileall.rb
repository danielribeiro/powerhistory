require 'coffeecompiler'

puts "Watching coffeescript files..."
comp = CoffeeCompiler.new './globalizer.coffee'
watch '.*\.coffee'  do |f|
  comp.compile f[0]
end
