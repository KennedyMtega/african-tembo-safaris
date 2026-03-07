UPDATE packages SET images = ARRAY[
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200',
  'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1200',
  'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1200',
  'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200'
] WHERE slug = 'ngorongoro-crater-cultural-experience';

UPDATE destinations SET image_url = 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200' WHERE name = 'Ngorongoro Crater';

UPDATE packages SET images = ARRAY[
  'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=1200',
  'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=1200',
  'https://images.unsplash.com/photo-1650668302197-7f556c34cb91?w=1200',
  'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=1200',
  'https://images.unsplash.com/photo-1577587230228-93984b98e22d?w=1200'
] WHERE slug = 'kilimanjaro-machame-route-trek';