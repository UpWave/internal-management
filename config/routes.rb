Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  devise_scope :user do
    resource :registration,
    only: [:new, :create, :edit, :update],
    path: 'users',
    path_names: { new: 'sign_up' },
    controller: 'devise/registrations',
    as: :user_registration do
      get :cancel
      end
    end
  resources :users
  get 'pages/index'
  root to: "pages#index"

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
