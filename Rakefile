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

def compileall
  require 'coffeecompiler'
  puts "Compiling it All"
  root = File.dirname __FILE__
  compiler = CoffeeCompiler.new
  compiler.compileDir root
end

desc "compile all coffeescripts and start watching them"
task :compile_watch do
  compileall
  system "watchr", 'compileall.rb'
end

desc "Compile all coffeescript and packages it into pkg directory"
task :package do
  require 'fileutils'
  FileUtils.mkpath 'pkg'
  compileall
  system 'zip', *%w[-r pkg/powerhistory.xpi chrome.manifest chrome install.rdf chrome]
end
