CREATE DATABASE IF NOT EXISTS shopo;
USE shopo;

DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id)
);

INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@shopo.com', '$2a$10$KMwGg9EoI4Ptxnr3doD3vO5xCKuN5sz4H1V/fjJg8EMDxLPrjQlbC', 'admin');

INSERT INTO products (name, category, price, stock, image_url, description) VALUES
('Wireless Mouse', 'Electronics', 25.99, 10, 'https://www.computeralliance.com.au/InventoryImages/45730.jpg', 'Compact wireless mouse for everyday use.'),
('Gaming Keyboard', 'Electronics', 79.99, 6, 'https://jmau.imgix.net/media/catalog/product/9/2/920-013234-logitech-g-pro-x-tkl-rapid-keyboard-1_5kofnuei5cvvlehx.jpg', 'RGB mechanical keyboard with tactile switches.'),
('Notebook', 'Stationery', 5.50, 25, 'https://www.promotionproducts.com.au/media/products/images/eco-spiral-bound-a5-notebooks/Promotional%20Eco%20Spiral%20Bound%20A5%20Notebooks%20Main.jpg', 'Hardcover ruled notebook for study and work.'),
('Water Bottle', 'Lifestyle', 15.00, 18, 'https://au.yeti.com/cdn/shop/files/70000007210_21071508651_Site_Studio_Drinkware_Rambler_CM_Chug_Bottle_36oz_Ridgeline_Back_168_B_2400x2400_e404181c-228a-4be2-b1fe-b5fe4790619a.png?v=1774477078&width=846', 'Insulated reusable water bottle.'),
('Desk Lamp', 'Home Office', 39.99, 8, 'https://onlinelighting.com.au/images/detailed/136/Croset_Table_Lamp.jpg', 'LED desk lamp with adjustable brightness.'),
('Backpack', 'Lifestyle', 49.95, 12, 'https://www.antler.com.au/cdn/shop/files/Antler-01-Discovery-Backpack-Black-Angle.jpg?v=1712856855', 'Durable backpack for daily commuting.');