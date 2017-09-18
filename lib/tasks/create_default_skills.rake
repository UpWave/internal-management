namespace :db do
  task :create_default_skills => :environment do
    Skill.transaction do
      Skill.create(name: "Language")
      Skill.create(name: "Framework")
      Skill.create(name: "Library")
      Skill.create(name: "DevOps")
      Skill.create(name: "Foreign Language")
    end
  end
end
