namespace :db do
  task :create_admin => :environment do
    puts "You will be prompted to enter an email address and password for the new admin"
    puts "Enter an email address:"
    email = STDIN.gets
    puts "Enter a password:"
    password = STDIN.gets
    unless email.strip!.blank? || password.strip!.blank?
      if User.create!(email: email, password: password, role: 'admin')
        puts "The admin was created successfully."
      else
        puts "Sorry, the admin was not created!"
      end
    end
  end
end
