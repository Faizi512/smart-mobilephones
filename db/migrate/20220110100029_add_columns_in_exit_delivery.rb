class AddColumnsInExitDelivery < ActiveRecord::Migration[6.1]
  def change
    return if Rails.env.production?
    add_column :exit_deliveries, :is_mobile, :boolean, default: false
    add_column :exit_deliveries, :source_rule, :integer, :default => 0
  end
end
