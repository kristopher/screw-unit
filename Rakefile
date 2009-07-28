# -*- ruby -*-

require 'rubygems'
require 'hoe'
require './lib/screw_unit.rb'

Hoe.new('screw_unit', ScrewUnit::VERSION) do |p|
  # p.rubyforge_name = 'screw_unitx' # if different than lowercase project name
  p.developer('Nathan Sobo', 'nathansobo@gmail.com')
end

desc "Package screw-unit.js for distribution"
task :dist do
  root_path = File.dirname(__FILE__)

  require File.join(root_path, 'vendor', 'sprockets', 'lib', 'sprockets')

  secretary = Sprockets::Secretary.new(
    :root         => File.join(root_path, "javascript"),
    :load_path    => [File.join(root_path, "javascript")],
    :source_files => ['screw-unit.js']
  )
  
  secretary.concatenation.save_to(File.join(root_path, 'dist', 'screw-unit.js'))
  
end
# vim: syntax=Ruby
