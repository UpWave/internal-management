Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  resources :users
  resource :user, only: [] do
    resources :timelogs 
  end
  get 'pages/index'
  get '/auth/:provider/callback', to: 'sessions#create'
  root to: "pages#index"
  resources :trello

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
