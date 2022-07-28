class CreateExitDeliveries < ActiveRecord::Migration[6.1]
  def change
    create_table :exit_deliveries do |t|
      t.string :name
      t.string :url
      t.float :percentage
      t.string :status
      t.integer :priority
      t.integer :cap
      t.text :source, array: true, default: []
      t.integer :count, :default => 0
      t.string :operational, :default => 'active'
      t.string :functional
      t.float :copy_percentage
      t.integer :total_count
      t.boolean :is_default, :default => false

      t.timestamps
    end
  end
end
