attributes :name

child :waiting_piece => :waiting_piece do |p|
    node(:class, :unless => lambda{|p| p.nil?}) do
        p.class.to_s.gsub(/^Engine\:\:/,"")
    end
    node(:owner, :unless => lambda{|p| p.nil?}) do
        p.owner.turn_order.to_s.gsub(/^Engine\:\:/,"")
    end
end
