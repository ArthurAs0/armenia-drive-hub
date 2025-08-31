-- Create cars table
CREATE TABLE public.cars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT,
  mileage TEXT NOT NULL,
  fuel TEXT NOT NULL,
  transmission TEXT NOT NULL,
  location TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT true,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view cars" 
ON public.cars 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own cars" 
ON public.cars 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cars" 
ON public.cars 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cars" 
ON public.cars 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for timestamps
CREATE TRIGGER update_cars_updated_at
BEFORE UPDATE ON public.cars
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(user_id) NOT NULL,
  car_id UUID REFERENCES cars(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, car_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for favorites
CREATE POLICY "Users can view their own favorites" 
ON public.favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their favorites" 
ON public.favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their favorites" 
ON public.favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Insert 100 sample cars
INSERT INTO public.cars (make, model, year, price, image_url, mileage, fuel, transmission, location, featured, verified, description) VALUES
('BMW', 'X5', 2023, 65000, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop', '15,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Luxury SUV with premium features'),
('Mercedes-Benz', 'C-Class', 2022, 45000, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop', '22,000 km', 'Petrol', 'Automatic', 'Gyumri', true, true, 'Elegant sedan with advanced technology'),
('Toyota', 'Camry', 2021, 28000, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop', '35,000 km', 'Hybrid', 'CVT', 'Vanadzor', false, true, 'Reliable hybrid sedan'),
('Audi', 'A4', 2023, 52000, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop', '8,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Sporty luxury sedan'),
('Honda', 'Civic', 2020, 22000, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop', '45,000 km', 'Petrol', 'Manual', 'Kapan', false, true, 'Compact reliable car'),
('Volkswagen', 'Golf', 2022, 25000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '18,000 km', 'Diesel', 'Automatic', 'Yerevan', false, true, 'European compact car'),
('Ford', 'Mustang', 2023, 55000, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', '5,000 km', 'Petrol', 'Manual', 'Yerevan', true, true, 'American muscle car'),
('Tesla', 'Model 3', 2022, 48000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '25,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Electric luxury sedan'),
('Nissan', 'Altima', 2021, 24000, 'https://images.unsplash.com/photo-1502877828070-33aba7b17d77?w=400&h=300&fit=crop', '30,000 km', 'Petrol', 'CVT', 'Gyumri', false, true, 'Mid-size sedan'),
('Hyundai', 'Elantra', 2020, 19000, 'https://images.unsplash.com/photo-1549399742-d3905619a036?w=400&h=300&fit=crop', '40,000 km', 'Petrol', 'Automatic', 'Vanadzor', false, true, 'Affordable compact sedan'),
('Kia', 'Optima', 2021, 23000, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop', '32,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Stylish mid-size sedan'),
('Mazda', 'CX-5', 2022, 32000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '20,000 km', 'Petrol', 'Automatic', 'Gyumri', false, true, 'Compact SUV with style'),
('Subaru', 'Outback', 2021, 29000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '28,000 km', 'Petrol', 'CVT', 'Kapan', false, true, 'Adventure-ready wagon'),
('Chevrolet', 'Malibu', 2020, 21000, 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=300&fit=crop', '38,000 km', 'Petrol', 'Automatic', 'Vanadzor', false, true, 'American mid-size sedan'),
('Lexus', 'ES', 2023, 47000, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', '12,000 km', 'Hybrid', 'CVT', 'Yerevan', true, true, 'Luxury hybrid sedan'),
('Infiniti', 'Q50', 2022, 38000, 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop', '26,000 km', 'Petrol', 'Automatic', 'Gyumri', false, true, 'Performance luxury sedan'),
('Acura', 'TLX', 2021, 35000, 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400&h=300&fit=crop', '29,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Sport luxury sedan'),
('Genesis', 'G90', 2023, 62000, 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop', '8,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Ultra-luxury sedan'),
('Cadillac', 'CT5', 2022, 41000, 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=300&fit=crop', '23,000 km', 'Petrol', 'Automatic', 'Gyumri', false, true, 'American luxury sedan'),
('Lincoln', 'Continental', 2021, 39000, 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=400&h=300&fit=crop', '31,000 km', 'Petrol', 'Automatic', 'Kapan', false, true, 'Premium American sedan'),
('Volvo', 'XC60', 2022, 43000, 'https://images.unsplash.com/photo-1606016159991-db7d1f8c6b1b?w=400&h=300&fit=crop', '19,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Scandinavian luxury SUV'),
('Jaguar', 'XF', 2023, 51000, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop', '7,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'British luxury sedan'),
('Land Rover', 'Range Rover', 2023, 85000, 'https://images.unsplash.com/photo-1566473965997-3de9c817e938?w=400&h=300&fit=crop', '10,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Luxury off-road SUV'),
('Porsche', '911', 2022, 95000, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', '15,000 km', 'Petrol', 'Manual', 'Yerevan', true, true, 'Iconic sports car'),
('Ferrari', '488', 2021, 220000, 'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=400&h=300&fit=crop', '8,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Italian supercar'),
('Lamborghini', 'Huracan', 2022, 250000, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', '5,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Exotic supercar'),
('McLaren', '720S', 2021, 280000, 'https://images.unsplash.com/photo-1592853625511-ad0edcc69c07?w=400&h=300&fit=crop', '6,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'British supercar'),
('Bentley', 'Continental', 2023, 195000, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop', '3,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Ultra-luxury coupe'),
('Rolls-Royce', 'Phantom', 2022, 450000, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop', '2,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Ultimate luxury sedan'),
('Maserati', 'Ghibli', 2021, 68000, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop', '18,000 km', 'Petrol', 'Automatic', 'Gyumri', true, true, 'Italian luxury sedan'),
('Alfa Romeo', 'Giulia', 2022, 42000, 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop', '21,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Italian sport sedan'),
('Mini', 'Cooper', 2020, 26000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '33,000 km', 'Petrol', 'Manual', 'Kapan', false, true, 'Compact British car'),
('Fiat', '500', 2019, 16000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '42,000 km', 'Petrol', 'Manual', 'Vanadzor', false, true, 'Italian city car'),
('Smart', 'ForTwo', 2020, 15000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '25,000 km', 'Electric', 'Automatic', 'Yerevan', false, true, 'Ultra-compact city car'),
('Peugeot', '308', 2021, 22000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '27,000 km', 'Diesel', 'Manual', 'Gyumri', false, true, 'French compact car'),
('Renault', 'Megane', 2020, 19000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '35,000 km', 'Petrol', 'Automatic', 'Vanadzor', false, true, 'European compact car'),
('Citroen', 'C4', 2021, 21000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '29,000 km', 'Diesel', 'Automatic', 'Kapan', false, true, 'French family car'),
('Skoda', 'Octavia', 2022, 24000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '16,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Czech family sedan'),
('Seat', 'Leon', 2021, 23000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '24,000 km', 'Petrol', 'Manual', 'Gyumri', false, true, 'Spanish compact car'),
('Opel', 'Astra', 2020, 20000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '31,000 km', 'Diesel', 'Manual', 'Vanadzor', false, true, 'German compact car'),
('Dacia', 'Duster', 2021, 18000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '26,000 km', 'Petrol', 'Manual', 'Kapan', false, true, 'Affordable compact SUV'),
('Mitsubishi', 'Outlander', 2022, 31000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '17,000 km', 'Petrol', 'CVT', 'Yerevan', false, true, 'Japanese family SUV'),
('Suzuki', 'Vitara', 2021, 23000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '22,000 km', 'Petrol', 'Manual', 'Gyumri', false, true, 'Compact SUV'),
('Isuzu', 'D-Max', 2022, 35000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '14,000 km', 'Diesel', 'Manual', 'Kapan', false, true, 'Reliable pickup truck'),
('Toyota', 'Prius', 2023, 32000, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop', '9,000 km', 'Hybrid', 'CVT', 'Yerevan', true, true, 'Iconic hybrid car'),
('Honda', 'Accord', 2022, 29000, 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop', '20,000 km', 'Hybrid', 'CVT', 'Gyumri', false, true, 'Midsize hybrid sedan'),
('Toyota', 'Corolla', 2021, 21000, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop', '34,000 km', 'Petrol', 'CVT', 'Vanadzor', false, true, 'Reliable compact sedan'),
('Honda', 'CR-V', 2023, 36000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '11,000 km', 'Petrol', 'CVT', 'Yerevan', false, true, 'Popular compact SUV'),
('Toyota', 'RAV4', 2022, 34000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '18,000 km', 'Hybrid', 'CVT', 'Gyumri', false, true, 'Hybrid compact SUV'),
('Nissan', 'Sentra', 2020, 18000, 'https://images.unsplash.com/photo-1502877828070-33aba7b17d77?w=400&h=300&fit=crop', '41,000 km', 'Petrol', 'CVT', 'Kapan', false, true, 'Affordable compact sedan'),
('Mazda', '3', 2021, 24000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '28,000 km', 'Petrol', 'Manual', 'Vanadzor', false, true, 'Stylish compact car'),
('Subaru', 'Impreza', 2020, 22000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '36,000 km', 'Petrol', 'CVT', 'Yerevan', false, true, 'All-wheel drive compact'),
('Volkswagen', 'Passat', 2022, 31000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '19,000 km', 'Diesel', 'Automatic', 'Gyumri', false, true, 'Midsize European sedan'),
('Ford', 'Focus', 2021, 20000, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop', '30,000 km', 'Petrol', 'Automatic', 'Kapan', false, true, 'American compact car'),
('Chevrolet', 'Cruze', 2020, 19000, 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=300&fit=crop', '37,000 km', 'Petrol', 'Automatic', 'Vanadzor', false, true, 'American compact sedan'),
('Buick', 'Regal', 2021, 27000, 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=300&fit=crop', '25,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Premium American sedan'),
('Dodge', 'Charger', 2022, 35000, 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop', '16,000 km', 'Petrol', 'Automatic', 'Gyumri', false, true, 'American muscle sedan'),
('Chrysler', '300', 2021, 32000, 'https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=300&fit=crop', '23,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Full-size American sedan'),
('Jeep', 'Cherokee', 2022, 33000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '21,000 km', 'Petrol', 'Automatic', 'Kapan', false, true, 'American midsize SUV'),
('Ram', '1500', 2023, 45000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '12,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Full-size pickup truck'),
('GMC', 'Sierra', 2022, 42000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '15,000 km', 'Petrol', 'Automatic', 'Gyumri', false, true, 'American pickup truck'),
('Ford', 'F-150', 2023, 48000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '8,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Best-selling pickup truck'),
('Chevrolet', 'Silverado', 2022, 44000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '13,000 km', 'Petrol', 'Automatic', 'Kapan', false, true, 'American pickup truck'),
('Toyota', 'Tacoma', 2021, 36000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '24,000 km', 'Petrol', 'Manual', 'Vanadzor', false, true, 'Mid-size pickup truck'),
('Honda', 'Ridgeline', 2022, 38000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '17,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Unibody pickup truck'),
('Nissan', 'Frontier', 2021, 30000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '26,000 km', 'Petrol', 'Manual', 'Gyumri', false, true, 'Mid-size pickup truck'),
('Ford', 'Ranger', 2022, 32000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '19,000 km', 'Petrol', 'Manual', 'Kapan', false, true, 'Compact pickup truck'),
('Chevrolet', 'Colorado', 2021, 31000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '22,000 km', 'Petrol', 'Automatic', 'Vanadzor', false, true, 'Mid-size pickup truck'),
('GMC', 'Canyon', 2022, 33000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '18,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Mid-size pickup truck'),
('Tesla', 'Model S', 2023, 85000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '6,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Luxury electric sedan'),
('Tesla', 'Model X', 2022, 95000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '11,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Luxury electric SUV'),
('Tesla', 'Model Y', 2023, 58000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '7,000 km', 'Electric', 'Automatic', 'Gyumri', true, true, 'Compact electric SUV'),
('Lucid', 'Air', 2022, 120000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '4,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Luxury electric sedan'),
('Rivian', 'R1T', 2023, 75000, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop', '3,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Electric pickup truck'),
('Ford', 'Mustang Mach-E', 2022, 52000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '14,000 km', 'Electric', 'Automatic', 'Gyumri', true, true, 'Electric SUV'),
('Volkswagen', 'ID.4', 2021, 41000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '20,000 km', 'Electric', 'Automatic', 'Kapan', false, true, 'German electric SUV'),
('BMW', 'iX', 2023, 84000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '5,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Luxury electric SUV'),
('Mercedes-Benz', 'EQS', 2022, 105000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '9,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Luxury electric sedan'),
('Audi', 'e-tron', 2021, 65000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '16,000 km', 'Electric', 'Automatic', 'Gyumri', true, true, 'Premium electric SUV'),
('Porsche', 'Taycan', 2022, 98000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '10,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Electric sports sedan'),
('Jaguar', 'I-PACE', 2021, 72000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '18,000 km', 'Electric', 'Automatic', 'Kapan', true, true, 'British electric SUV'),
('Volvo', 'XC40 Recharge', 2022, 55000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '12,000 km', 'Electric', 'Automatic', 'Vanadzor', false, true, 'Compact electric SUV'),
('Genesis', 'Electrified GV70', 2023, 68000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '4,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Luxury electric SUV'),
('Cadillac', 'Lyriq', 2022, 62000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '8,000 km', 'Electric', 'Automatic', 'Gyumri', true, true, 'American electric SUV'),
('Chevrolet', 'Bolt EV', 2021, 31000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '25,000 km', 'Electric', 'Automatic', 'Kapan', false, true, 'Affordable electric car'),
('Nissan', 'Leaf', 2020, 28000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '32,000 km', 'Electric', 'Automatic', 'Vanadzor', false, true, 'Pioneer electric car'),
('Hyundai', 'IONIQ 5', 2022, 45000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '15,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Futuristic electric SUV'),
('Kia', 'EV6', 2023, 48000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '6,000 km', 'Electric', 'Automatic', 'Gyumri', true, true, 'Sport electric SUV'),
('Polestar', '2', 2021, 47000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '21,000 km', 'Electric', 'Automatic', 'Yerevan', false, true, 'Scandinavian electric sedan'),
('BMW', 'i4', 2022, 56000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '13,000 km', 'Electric', 'Automatic', 'Kapan', true, true, 'Electric sport sedan'),
('Mercedes-Benz', 'EQB', 2021, 58000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '17,000 km', 'Electric', 'Automatic', 'Vanadzor', false, true, 'Compact electric SUV'),
('Audi', 'Q4 e-tron', 2022, 52000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '11,000 km', 'Electric', 'Automatic', 'Yerevan', true, true, 'Compact electric SUV'),
('Lexus', 'UX 300e', 2021, 48000, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop', '19,000 km', 'Electric', 'Automatic', 'Gyumri', false, true, 'Luxury electric crossover'),
('Infiniti', 'QX60', 2022, 46000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '16,000 km', 'Petrol', 'CVT', 'Kapan', false, true, 'Family luxury SUV'),
('Acura', 'MDX', 2023, 51000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '9,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Premium family SUV'),
('Lincoln', 'Aviator', 2022, 58000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '14,000 km', 'Petrol', 'Automatic', 'Gyumri', true, true, 'Luxury midsize SUV'),
('Cadillac', 'Escalade', 2023, 78000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '7,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Full-size luxury SUV'),
('BMW', 'X7', 2022, 85000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '12,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Flagship luxury SUV'),
('Mercedes-Benz', 'GLS', 2023, 82000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '8,000 km', 'Petrol', 'Automatic', 'Gyumri', true, true, 'Full-size luxury SUV'),
('Audi', 'Q8', 2022, 75000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '13,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Coupe-style luxury SUV'),
('Lexus', 'LX', 2023, 95000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '5,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Flagship luxury SUV'),
('Genesis', 'GV80', 2022, 65000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '11,000 km', 'Petrol', 'Automatic', 'Kapan', true, true, 'Korean luxury SUV'),
('Volvo', 'XC90', 2021, 58000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '18,000 km', 'Petrol', 'Automatic', 'Vanadzor', true, true, 'Scandinavian luxury SUV'),
('Land Rover', 'Discovery', 2022, 62000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '15,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'British adventure SUV'),
('Jeep', 'Grand Cherokee', 2023, 38000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '10,000 km', 'Petrol', 'Automatic', 'Gyumri', false, true, 'American midsize SUV'),
('Ford', 'Explorer', 2022, 36000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '17,000 km', 'Petrol', 'Automatic', 'Kapan', false, true, 'American family SUV'),
('Chevrolet', 'Tahoe', 2023, 55000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '9,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Full-size American SUV'),
('GMC', 'Yukon', 2022, 58000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '12,000 km', 'Petrol', 'Automatic', 'Vanadzor', false, true, 'Full-size luxury SUV'),
('Toyota', 'Sequoia', 2023, 62000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '6,000 km', 'Petrol', 'Automatic', 'Yerevan', false, true, 'Full-size family SUV'),
('Honda', 'Pilot', 2022, 39000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '16,000 km', 'Petrol', 'Automatic', 'Gyumri', false, true, 'Family-friendly SUV'),
('Nissan', 'Armada', 2021, 48000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '20,000 km', 'Petrol', 'Automatic', 'Kapan', false, true, 'Full-size family SUV'),
('Infiniti', 'QX80', 2022, 68000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '14,000 km', 'Petrol', 'Automatic', 'Yerevan', true, true, 'Luxury full-size SUV'),
('Mazda', 'CX-9', 2021, 35000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '22,000 km', 'Petrol', 'Automatic', 'Vanadzor', false, true, 'Three-row family SUV'),
('Subaru', 'Ascent', 2022, 34000, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop', '18,000 km', 'Petrol', 'CVT', 'Gyumri', false, true, 'All-wheel drive family SUV');