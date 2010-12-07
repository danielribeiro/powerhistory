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

  def compileAll(baseFile, coffeeDir, outDir)
    root = Fileobject.new baseFile
    Dir["#{coffeeDir}/**/*.coffee"].each do |f|
      subPath = File.dirname f.gsub /^#{coffeeDir}\//, ''
      dir = "#{outDir}/#{subPath}"
      root.pathAndCreate dir
      compile f, dir
    end
  end

  def compileDir(dir, outputDir = nil)
    Dir["#{dir}/**/*.coffee"].each {|f| compile f, outputDir}
  end

end
