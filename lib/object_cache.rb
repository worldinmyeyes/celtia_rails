class ObjectCache
    @@objects = {}
    
    def self.add(key, value)
        @@objects[key] = value
    end
    
    def self.find(key)
        @@objects[key]
    end
end
