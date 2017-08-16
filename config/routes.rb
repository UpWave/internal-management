Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  resources :users
  resource :user, only: [] do
    resources :timelogs 
  end
  namespace :admin do
    resources :users, only: [] do
      resources :timelogs
    end
  end
  get 'pages/index'
  post "admin/timelogs/download_pdf" => "admin/timelogs#download_pdf"
  root to: "pages#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
