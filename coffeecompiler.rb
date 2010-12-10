require 'open3'
class CoffeeCompiler
  attr_reader :plugin

  def initialize(plugin = nil)
    @plugin = plugin
  end

  def compile(filename, outputDir = nil)
    args = ["coffee"]
    args.push '-r', plugin if @plugin
    args.push '-o', outputDir if outputDir
    args.push '-c', filename
    Open3.popen3 *args do |stdin, stdout, stderr|
      error_message = stderr.read
      puts "CoffeeScript compile failed. #{error_message}" unless error_message.empty?
    end

  end

  def compileDir(dir, outputDir = nil)
    Dir["#{dir}/**/*.coffee"].each {|f| compile f, outputDir}
  end

end
