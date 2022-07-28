Rails.application.routes.draw do
  devise_for :users
  resources :exit_deliveries
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root 'pages#index'
  get '/privacy' => 'pages#privacy'
  get '/terms' => 'pages#terms'
  get '/cookies' => 'pages#cookies'
  get '/lead_search' => 'lead#lead_search'
  namespace 'api', defaults: { format: :json } do
    namespace 'v1' do
      get '/redirect_url' => 'redirect#redirect_url'
      get '/exit_deliveries' => 'redirect#exit_deliveries'
    end
  end
  get '/:page_name' => 'pages#show'
end
