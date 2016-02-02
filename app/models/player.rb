class Player < ActiveRecord::Base
has_many :player_lists
has_many :messages
has_many :games, through: :player_lists


  attr_accessible :email, :password, :password_confirmation, :username
  has_secure_password
  
  validates_uniqueness_of :email, :username
  validates :username, :presence => true
  validates :email, :presence => true
  validates :password, :length => { :in => 6..20 }
end
