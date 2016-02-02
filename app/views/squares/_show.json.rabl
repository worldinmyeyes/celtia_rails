attributes :x, :y, :to_s, :to_s_ignoring_spells

child :piece => :piece do    
    node(:class) do |p|
        p.class.to_s.gsub(/^Engine\:\:/,"")
    end
    child :owner => :owner do
        attributes :turn_order
    end
end

child :misted_piece => :misted_piece do    
    node(:class) do |p|
        p.class.to_s.gsub(/^Engine\:\:/,"")
    end
    child :owner => :owner do
        attributes :turn_order
    end
end

child :mist_spell_owner => :mist_spell_owner do
    attributes :turn_order
end
