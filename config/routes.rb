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
    resources :skills
    resources :users, only: [] do
      resources :timelogs
    end
  end
  namespace :api do
    namespace :v1 do
      resources :vacations
      namespace :vacation_types do
        resources :types, only: [:index]
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
        resources :salaries
        resources :skills
        resources :users do
          collection do
            get :count_users
          end
        end
        resources :roles, only: [:index]
        resources :statuses, only: [:index]
        resources :timelogs do
          collection do
            get :trello_cards
            get :count_timelogs
          end
        end
        namespace :user do
          resources :users, only: [] do
            resources :skills do
              collection do
                get :missing
              end
            end
          end
        end
      end
    end
  end
  get 'pages/index'
  root to: "pages#index"
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
