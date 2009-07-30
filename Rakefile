require 'rubygems'

desc "Package screw-unit.js for distribution"
task :dist do
  root_path = File.dirname(__FILE__)
  
  begin
    require 'sprockets'
  rescue
    puts "\nYou need sprockets to build Screw-Unit\n\n"
    puts "  $ sudo gem install sprockets\n\n"
    puts "And try building again.\n\n"
  end 

  secretary = Sprockets::Secretary.new(
    :root         => File.join(root_path, "lib"),
    :asset_root  => File.join(root_path, 'dist', 'assets'),
    :load_path    => [File.join(root_path, "lib")],
    :source_files => ['screw-unit.js']
  )
  
  secretary.concatenation.save_to(File.join(root_path, 'dist', 'screw-unit.js'))
  secretary.install_assets
  
  puts "\nThe built screw-unit library and assets are located in ./dist\n\n"
end
