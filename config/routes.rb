Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  resource :user, only: [] do
    resources :timelogs 
    resources :vacations
    resource :profile
  end
  namespace :admin do
    resources :users
    resources :vacations
    resources :users, only: [] do
      resources :timelogs
    end
  end
  get 'pages/index'
  root to: "pages#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
