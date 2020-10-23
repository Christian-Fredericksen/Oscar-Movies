class CreateMovies < ActiveRecord::Migration[6.0]
  def change
    create_table :movies do |t|
      t.string :title
      t.string :year
      t.string :starring
      t.string :tag_line
      t.string :link
      t.string :image

      t.timestamps
    end
  end
end
