-- Calo AI Database Schema

-- Users Profile Table
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    age INTEGER,
    weight FLOAT, -- in kg
    height FLOAT, -- in cm
    gender TEXT,
    goal TEXT, -- lose, maintain, gain
    calorie_target INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meals Tracking Table
CREATE TABLE IF NOT EXISTS meals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    image_url TEXT,
    food_items JSONB, -- Array of strings
    calories INTEGER,
    protein FLOAT,
    carbs FLOAT,
    fat FLOAT,
    fiber FLOAT,
    meal_score FLOAT,
    advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    role TEXT CHECK (role IN ('user', 'alisha')),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own meals" ON meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meals" ON meals FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own chats" ON chat_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own chats" ON chat_history FOR INSERT WITH CHECK (auth.uid() = user_id);
