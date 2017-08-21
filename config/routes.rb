Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  resources :users
  resource :user, only: [] do
    resources :timelogs 
    resources :vacations
  end
  namespace :admin do
    resources :vacations
    resources :users, only: [] do
      resources :timelogs
    end
  end
  get 'pages/index'
  root to: "pages#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
