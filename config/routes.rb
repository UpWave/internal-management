Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks', sessions: 'sessions' }
  scope :auth do
    get 'is_signed_in', to: 'auth#is_signed_in?'
    get 'check_identities', to: 'auth#check_identities'
  end
  namespace :api do
    namespace :v1 do
      resources :evaluations, only: [:index]
      resource :profile do
        resources :trello_boards, only: [:index]
      end
      resources :vacations
      namespace :vacation_types do
        resources :types, only: [:index]
      end
      namespace :salary_types do
        resources :types, only: [:index]
      end
      resources :timelogs do
        collection do
          get :count_timelogs
        end
      end
    end
  end
  namespace :api do
    namespace :v1 do
      namespace :admin do
        resources :vacations do
          collection do
            get :users
            get :statuses
          end
        end
        resources :skills do
          collection do
            get :skill_types
          end
        end
        resources :users do
          member do
            put :reset_password
          end
          collection do
            get :count_users
          end
        end
        resources :roles, only: [:index]
        resources :statuses, only: [:index]
        namespace :user do
          resources :users, only: [] do
            resources :timelogs do
              collection do
                get :count_timelogs
              end
            end
            resources :evaluations
            resources :goals, only: [:update, :destroy]
            resources :salaries
            resources :invoices
            resources :comments
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
  get '*path' => redirect('/')
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
