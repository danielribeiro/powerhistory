require 'rubygems'
require 'bundler/setup'
require 'rake'
require 'rake/clean'
require 'rake/gempackagetask'
require 'rake/rdoctask'
require 'rake/testtask'
require 'spec/rake/spectask'

task :default => [:compile_watch]
#################################
## Custom tasks
#################################
#$LOAD_PATH.unshift File.join(File.dirname(__FILE__),'lib')
require 'pp'

desc "compile all coffeescripts and start watching them"
task :compile_watch do
  require 'coffeecompiler'
  puts "Compiling it All"
  root = File.dirname __FILE__
  compiler = CoffeeCompiler.new './globalizer.coffee'
  compiler.compileDir root
  system "watchr", 'compileall.rb'
end

