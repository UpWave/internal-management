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
  namespace :api do
    namespace :v1 do
      resources :vacations
      namespace :vacations do
        resources :types
      end
      resources :timelogs do
        collection do
          get :trello_cards
          get :count_timelogs
        end
      end
    end
  end
  namespace :api do
    namespace :v1 do
      namespace :admin do
        resources :timelogs do
          collection do
            get :trello_cards
            get :count_timelogs
          end
        end
      end
    end
  end
  get 'pages/index'
  root to: "pages#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
