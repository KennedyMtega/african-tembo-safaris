
-- Seed 5 Tanzanian destinations
INSERT INTO destinations (name, country, description, image_url) VALUES
('Serengeti National Park', 'Tanzania', 'The iconic Serengeti is home to the Great Migration, where over two million wildebeest, zebra, and gazelle traverse the endless plains in search of fresh grazing. This UNESCO World Heritage Site offers unparalleled Big Five viewing year-round.', 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200'),
('Ngorongoro Crater', 'Tanzania', 'The world''s largest intact volcanic caldera, Ngorongoro is a natural amphitheater teeming with over 25,000 large animals including the endangered black rhino. The crater floor offers one of Africa''s most concentrated wildlife spectacles.', 'https://images.unsplash.com/photo-1621414050946-1b936a364e51?w=1200'),
('Zanzibar Island', 'Tanzania', 'A tropical archipelago off Tanzania''s coast, Zanzibar enchants visitors with its turquoise waters, white-sand beaches, UNESCO-listed Stone Town, and aromatic spice plantations. A perfect post-safari beach extension.', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200'),
('Mount Kilimanjaro', 'Tanzania', 'Africa''s highest peak at 5,895 meters, Kilimanjaro is the world''s tallest free-standing mountain. Its snow-capped summit rises above the savanna, offering trekkers an extraordinary journey through five distinct climate zones.', 'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=1200'),
('Tarangire National Park', 'Tanzania', 'Famous for its massive elephant herds and iconic baobab trees, Tarangire offers a quieter safari experience with excellent game viewing, especially during the dry season when animals congregate around the Tarangire River.', 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200');

-- Seed 5 Tanzanian safari packages using destination IDs
WITH dest AS (
  SELECT id, name FROM destinations WHERE country = 'Tanzania'
)
INSERT INTO packages (title, slug, description, short_description, destination_id, duration, difficulty, price_min, price_max, group_price_min, group_price_max, max_group_size, status, featured, images, highlights, tags, includes, excludes) VALUES
(
  'Serengeti Great Migration Safari',
  'serengeti-great-migration-safari',
  'Embark on the ultimate East African adventure following the legendary Great Migration across the Serengeti plains. Witness millions of wildebeest, zebra, and gazelle thundering across the savanna while predators lurk in the tall grass. This 7-day journey takes you from the bustling town of Arusha through Tarangire''s baobab-studded landscape, deep into the heart of the Serengeti, and down into the magnificent Ngorongoro Crater. Experience luxury tented camps, expert Maasai guides, and sunrise game drives that will leave you breathless.',
  'Follow the Great Migration across the Serengeti — 7 days of Big Five game drives, luxury camps, and Ngorongoro Crater.',
  (SELECT id FROM dest WHERE name = 'Serengeti National Park'),
  7, 'moderate', 3200, 4800, 2800, 4200, 12, 'published', true,
  ARRAY[
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200',
    'https://images.unsplash.com/photo-1534177616064-886e22e5b38a?w=1200',
    'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1200',
    'https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?w=1200',
    'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?w=1200'
  ],
  ARRAY['Witness the Great Wildebeest Migration', 'Big Five game drives in the Serengeti', 'Ngorongoro Crater floor descent', 'Luxury tented safari camps', 'Maasai village cultural visit', 'Hot air balloon safari option', 'Tarangire elephant herds and baobabs', 'Sunrise and sunset game drives'],
  ARRAY['wildlife', 'migration', 'luxury', 'big-five', 'safari', 'photography'],
  ARRAY['All park and conservation fees', 'Private 4x4 Land Cruiser with pop-up roof', 'Professional English-speaking safari guide', 'All accommodation in luxury lodges/tented camps', 'Full board meals and drinking water', 'Airport transfers in Arusha', 'Flying Doctors emergency evacuation insurance', 'Binoculars and wildlife guidebook', 'Laundry service at lodges'],
  ARRAY['International flights', 'Tanzania visa fees', 'Travel insurance', 'Hot air balloon safari ($500 pp)', 'Alcoholic beverages', 'Gratuities for guide and camp staff']
),
(
  'Ngorongoro Crater & Cultural Experience',
  'ngorongoro-crater-cultural-experience',
  'Descend into the world''s largest intact volcanic caldera — a natural amphitheater hosting over 25,000 large animals within its 260 square kilometer floor. This intimate 4-day journey combines extraordinary wildlife encounters with authentic Maasai cultural immersion. Explore the flamingo-lined shores of Lake Manyara, witness the endangered black rhino in the crater, and share stories around the fire with Maasai elders in their traditional boma.',
  'Explore the world''s largest volcanic caldera — 4 days of incredible wildlife and Maasai cultural immersion.',
  (SELECT id FROM dest WHERE name = 'Ngorongoro Crater'),
  4, 'easy', 1800, 2600, 1500, 2200, 10, 'published', true,
  ARRAY[
    'https://images.unsplash.com/photo-1621414050946-1b936a364e51?w=1200',
    'https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=1200',
    'https://images.unsplash.com/photo-1612527924781-1c14ef038e0d?w=1200',
    'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200',
    'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=1200'
  ],
  ARRAY['Ngorongoro Crater floor game drive', 'Spot endangered black rhino', 'Flamingo spectacle at Lake Manyara', 'Authentic Maasai boma village visit', 'Tree-climbing lions of Manyara', 'Panoramic crater rim views'],
  ARRAY['wildlife', 'culture', 'crater', 'big-five', 'safari', 'family-friendly'],
  ARRAY['All park and conservation fees', 'Private 4x4 safari vehicle', 'Experienced English-speaking guide', 'Lodge accommodation with crater views', 'Full board meals and beverages', 'Maasai village visit with cultural exchange', 'Airport transfers', 'Emergency evacuation insurance'],
  ARRAY['International flights', 'Tanzania visa fees', 'Travel insurance', 'Alcoholic beverages', 'Gratuities']
),
(
  'Zanzibar Beach & Spice Island Retreat',
  'zanzibar-beach-spice-island-retreat',
  'Escape to the legendary Spice Island where turquoise Indian Ocean waters lap against powder-white beaches. Wander through the labyrinthine alleys of UNESCO-listed Stone Town, rich with Swahili, Arab, and Portuguese heritage. Tour aromatic spice plantations, sail on a traditional dhow at sunset, snorkel pristine coral reefs, and encounter rare red colobus monkeys in Jozani Forest. This 5-day retreat is the perfect tropical finale to any Tanzania safari.',
  'Turquoise waters, UNESCO Stone Town, spice tours, and sunset dhow cruises — 5 days of tropical paradise.',
  (SELECT id FROM dest WHERE name = 'Zanzibar Island'),
  5, 'easy', 1200, 2000, 1000, 1700, 14, 'published', true,
  ARRAY[
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200',
    'https://images.unsplash.com/photo-1586861203927-800a5acdcc4d?w=1200',
    'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=1200',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?w=1200'
  ],
  ARRAY['UNESCO World Heritage Stone Town walking tour', 'Traditional spice plantation tour', 'Sunset dhow cruise with seafood dinner', 'Snorkeling at Mnemba Atoll', 'Jozani Forest red colobus monkey encounter', 'Prison Island giant tortoise visit', 'Fresh seafood at Forodhani night market', 'Relaxation at pristine beach resort'],
  ARRAY['beach', 'culture', 'relaxation', 'snorkeling', 'island', 'honeymoon'],
  ARRAY['Airport transfers in Zanzibar', 'Beachfront resort accommodation', 'Daily breakfast and dinner', 'Stone Town guided walking tour', 'Spice plantation tour with lunch', 'Sunset dhow cruise', 'Snorkeling trip with equipment', 'Jozani Forest entrance fee', 'All land and boat transfers'],
  ARRAY['International and domestic flights', 'Tanzania visa fees', 'Travel insurance', 'Lunch on free days', 'Alcoholic beverages', 'Gratuities', 'Water sports equipment rental']
),
(
  'Kilimanjaro Machame Route Trek',
  'kilimanjaro-machame-route-trek',
  'Conquer Africa''s highest peak via the breathtaking Machame Route, known as the "Whiskey Route" for its challenging yet scenic terrain. Over 7 days, ascend through five distinct ecological zones — from lush rainforest to alpine desert to arctic summit. Stand atop Uhuru Peak at 5,895 meters as the sun rises over the African continent, with glaciers glowing pink above the clouds. Our experienced mountain guides, porters, and chef team ensure a safe, supported, and unforgettable summit experience.',
  'Summit Africa''s highest peak via the scenic Machame Route — 7 days through five climate zones to Uhuru Peak.',
  (SELECT id FROM dest WHERE name = 'Mount Kilimanjaro'),
  7, 'challenging', 2800, 3800, 2400, 3400, 8, 'published', false,
  ARRAY[
    'https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?w=1200',
    'https://images.unsplash.com/photo-1631646109206-4c61a666dba4?w=1200',
    'https://images.unsplash.com/photo-1650668302197-7f556c34cb91?w=1200',
    'https://images.unsplash.com/photo-1617443795538-31e7e8e8e023?w=1200',
    'https://images.unsplash.com/photo-1621414050345-53db43f7e7ab?w=1200'
  ],
  ARRAY['Uhuru Peak summit at 5,895m', 'Five distinct climate zones', 'Spectacular glacier and crater views', 'Lush montane rainforest trekking', 'Alpine desert moonscape terrain', 'Professional mountain guide team', 'Summit night under starlight', 'Certificate of achievement'],
  ARRAY['trekking', 'adventure', 'mountain', 'challenge', 'summit', 'fitness'],
  ARRAY['Kilimanjaro National Park fees', 'Professional mountain guide and assistant guides', 'Porters for gear (15kg per person)', 'Mountain chef with hot meals daily', 'Quality camping equipment and tents', 'Dining tent with tables and chairs', 'Portable toilet', 'Oxygen tank and first aid kit', 'Pre-climb briefing and gear check', 'Summit certificate'],
  ARRAY['International flights', 'Tanzania visa fees', 'Travel insurance (mandatory)', 'Personal trekking gear and clothing', 'Sleeping bag rental ($30)', 'Alcoholic beverages', 'Gratuities for mountain crew', 'Pre/post-trek accommodation']
),
(
  'Northern Circuit Grand Safari',
  'northern-circuit-grand-safari',
  'The definitive Tanzania experience — a 10-day odyssey through the legendary Northern Circuit crowned with a Zanzibar beach finale. Begin in the elephant kingdom of Tarangire, drift along Lake Manyara''s tree-lined shores, spend three magical nights in the Serengeti witnessing the Great Migration, descend into the wildlife-packed Ngorongoro Crater, then fly to Zanzibar for two days of tropical bliss. This is Tanzania at its absolute finest, combining world-class safari, dramatic landscapes, rich culture, and Indian Ocean paradise.',
  'The ultimate 10-day Tanzania odyssey — Serengeti, Ngorongoro, Tarangire, and Zanzibar beach finale.',
  (SELECT id FROM dest WHERE name = 'Tarangire National Park'),
  10, 'moderate', 5500, 7500, 4800, 6800, 10, 'published', false,
  ARRAY[
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1200',
    'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1200',
    'https://images.unsplash.com/photo-1534177616064-886e22e5b38a?w=1200',
    'https://images.unsplash.com/photo-1621414050946-1b936a364e51?w=1200',
    'https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=1200'
  ],
  ARRAY['Complete Big Five safari experience', 'Great Migration game drives', 'Ngorongoro Crater floor descent', 'Tarangire elephant herds and baobabs', 'Lake Manyara flamingos and tree-climbing lions', 'Zanzibar beach relaxation', 'Stone Town cultural exploration', 'Maasai cultural immersion'],
  ARRAY['wildlife', 'migration', 'luxury', 'big-five', 'safari', 'beach', 'all-inclusive', 'honeymoon'],
  ARRAY['All park and conservation fees', 'Private 4x4 Land Cruiser throughout', 'Senior English-speaking safari guide', 'Luxury lodge and tented camp accommodation', 'Zanzibar beachfront resort', 'Full board meals throughout', 'Domestic flight safari to Zanzibar', 'All airport and inter-park transfers', 'Stone Town guided tour', 'Flying Doctors emergency evacuation', 'Complimentary binoculars and guide book'],
  ARRAY['International flights', 'Tanzania visa fees', 'Travel insurance', 'Zanzibar lunches', 'Alcoholic beverages', 'Optional activities in Zanzibar', 'Gratuities for guide and staff']
);

-- Seed itineraries for each package
-- 1. Serengeti Great Migration Safari (7 days)
WITH pkg AS (SELECT id FROM packages WHERE slug = 'serengeti-great-migration-safari')
INSERT INTO package_itinerary (package_id, day_number, title, description, meals, accommodation) VALUES
((SELECT id FROM pkg), 1, 'Arrival in Arusha', 'Welcome to Tanzania! You''ll be met at Kilimanjaro International Airport and transferred to your lodge in Arusha. Evening briefing about your upcoming safari adventure over a welcome dinner.', ARRAY['Dinner'], 'Arusha Coffee Lodge'),
((SELECT id FROM pkg), 2, 'Arusha to Tarangire National Park', 'Drive south to Tarangire, famous for its giant baobab trees and large elephant herds. Enjoy afternoon game drives along the Tarangire River, spotting elephants, giraffes, zebras, and diverse bird species.', ARRAY['Breakfast','Lunch','Dinner'], 'Tarangire Safari Lodge'),
((SELECT id FROM pkg), 3, 'Tarangire to Serengeti National Park', 'Journey through the Great Rift Valley to the Serengeti. Enter through the Naabi Hill Gate and begin game drives across the endless plains. First sightings of the migration herds and resident predators.', ARRAY['Breakfast','Lunch','Dinner'], 'Serengeti Serena Safari Lodge'),
((SELECT id FROM pkg), 4, 'Full Day Serengeti Game Drives', 'A full day exploring different sectors of the Serengeti following the migration. Dawn drive to catch predators on the hunt, afternoon drive focusing on river crossings where crocodiles await migrating herds.', ARRAY['Breakfast','Lunch','Dinner'], 'Serengeti Serena Safari Lodge'),
((SELECT id FROM pkg), 5, 'Serengeti — Sunrise Balloon & Game Drive', 'Optional hot air balloon safari at dawn floating over the plains. Continue game drives in less-visited areas, tracking leopards in kopjes and cheetahs on the open savanna.', ARRAY['Breakfast','Lunch','Dinner'], 'Serengeti Serena Safari Lodge'),
((SELECT id FROM pkg), 6, 'Serengeti to Ngorongoro Crater', 'Depart the Serengeti and drive to the Ngorongoro Conservation Area. Stop at Olduvai Gorge, the cradle of mankind. Arrive at the crater rim for stunning sunset views over the caldera.', ARRAY['Breakfast','Lunch','Dinner'], 'Ngorongoro Serena Safari Lodge'),
((SELECT id FROM pkg), 7, 'Ngorongoro Crater & Departure', 'Early morning descent into the crater for a half-day game drive. Spot black rhino, lions, hippos, and flamingos. Ascend and transfer back to Arusha for your departure flight.', ARRAY['Breakfast','Lunch'], 'N/A — Departure');

-- 2. Ngorongoro Crater & Cultural Experience (4 days)
WITH pkg AS (SELECT id FROM packages WHERE slug = 'ngorongoro-crater-cultural-experience')
INSERT INTO package_itinerary (package_id, day_number, title, description, meals, accommodation) VALUES
((SELECT id FROM pkg), 1, 'Arrival & Lake Manyara', 'Arrive in Arusha and head to Lake Manyara National Park. Explore the lush groundwater forest and lake shore, watching for tree-climbing lions, elephants, and thousands of flamingos along the alkaline lake.', ARRAY['Lunch','Dinner'], 'Lake Manyara Serena Safari Lodge'),
((SELECT id FROM pkg), 2, 'Lake Manyara to Ngorongoro', 'Morning visit to a Maasai boma for an authentic cultural experience — learn about their pastoral lifestyle, traditions, and beadwork. Continue to Ngorongoro Crater rim with spectacular views.', ARRAY['Breakfast','Lunch','Dinner'], 'Ngorongoro Serena Safari Lodge'),
((SELECT id FROM pkg), 3, 'Ngorongoro Crater Floor', 'Descend 600 meters to the crater floor for a full day of game driving. This natural enclosure hosts an incredible density of wildlife including the Big Five. Picnic lunch by the hippo pool.', ARRAY['Breakfast','Lunch','Dinner'], 'Ngorongoro Serena Safari Lodge'),
((SELECT id FROM pkg), 4, 'Crater Rim Walk & Departure', 'Morning guided walk along the crater rim through montane forest, spotting birds and small mammals. Transfer back to Arusha for afternoon departure.', ARRAY['Breakfast','Lunch'], 'N/A — Departure');

-- 3. Zanzibar Beach & Spice Island Retreat (5 days)
WITH pkg AS (SELECT id FROM packages WHERE slug = 'zanzibar-beach-spice-island-retreat')
INSERT INTO package_itinerary (package_id, day_number, title, description, meals, accommodation) VALUES
((SELECT id FROM pkg), 1, 'Arrival in Zanzibar & Stone Town', 'Arrive at Zanzibar Airport and transfer to Stone Town. Afternoon guided walking tour through the UNESCO World Heritage labyrinth — visit the Sultan''s Palace, House of Wonders, and bustling Darajani Market.', ARRAY['Dinner'], 'Zanzibar Serena Hotel, Stone Town'),
((SELECT id FROM pkg), 2, 'Spice Tour & Jozani Forest', 'Morning visit to a spice plantation — taste fresh vanilla, clove, cinnamon, and nutmeg straight from the source. Afternoon trip to Jozani Forest to see endemic red colobus monkeys.', ARRAY['Breakfast','Lunch','Dinner'], 'Zanzibar Serena Hotel, Stone Town'),
((SELECT id FROM pkg), 3, 'Transfer to Beach Resort', 'Depart Stone Town for the pristine northeast coast. Check into your beachfront resort and spend the afternoon relaxing on white sand beaches with crystal-clear Indian Ocean waters.', ARRAY['Breakfast','Dinner'], 'Matemwe Beach Resort'),
((SELECT id FROM pkg), 4, 'Beach Day — Snorkeling & Dhow Cruise', 'Morning snorkeling trip to the coral reefs near Mnemba Atoll, swimming with tropical fish, dolphins, and sea turtles. Evening sunset dhow cruise with fresh seafood dinner on board.', ARRAY['Breakfast','Lunch','Dinner'], 'Matemwe Beach Resort'),
((SELECT id FROM pkg), 5, 'Beach Leisure & Departure', 'Free morning for swimming, spa treatments, or kayaking. Transfer to Zanzibar Airport for your departure flight.', ARRAY['Breakfast'], 'N/A — Departure');

-- 4. Kilimanjaro Machame Route Trek (7 days)
WITH pkg AS (SELECT id FROM packages WHERE slug = 'kilimanjaro-machame-route-trek')
INSERT INTO package_itinerary (package_id, day_number, title, description, meals, accommodation) VALUES
((SELECT id FROM pkg), 1, 'Machame Gate to Machame Camp (3,000m)', 'Register at the gate and begin your trek through lush montane rainforest. Listen for colobus monkeys and exotic birdsong as you ascend through moss-draped trees to Machame Camp.', ARRAY['Lunch','Dinner'], 'Machame Camp (tents)'),
((SELECT id FROM pkg), 2, 'Machame Camp to Shira Camp (3,840m)', 'Emerge from the forest into moorland heath. Cross rocky ridges with increasingly dramatic views of Kibo peak. Arrive at the Shira Plateau, an ancient collapsed caldera.', ARRAY['Breakfast','Lunch','Dinner'], 'Shira Camp (tents)'),
((SELECT id FROM pkg), 3, 'Shira Camp to Barranco Camp (3,950m)', 'Trek toward the Lava Tower at 4,600m for acclimatization, then descend to Barranco Camp in the shadow of the dramatic Barranco Wall. "Climb high, sleep low" strategy.', ARRAY['Breakfast','Lunch','Dinner'], 'Barranco Camp (tents)'),
((SELECT id FROM pkg), 4, 'Barranco Camp to Karanga Camp (3,995m)', 'Scale the dramatic Barranco Wall — the trek''s most exhilarating scramble. Continue across ridges and valleys to Karanga Camp with views of the Southern Icefield glaciers.', ARRAY['Breakfast','Lunch','Dinner'], 'Karanga Camp (tents)'),
((SELECT id FROM pkg), 5, 'Karanga Camp to Barafu Camp (4,673m)', 'Short but steep ascent to Barafu Base Camp. Rest and prepare for summit night. Early dinner and final gear check. Views stretch across the Tanzanian plains far below.', ARRAY['Breakfast','Lunch','Dinner'], 'Barafu Camp (tents)'),
((SELECT id FROM pkg), 6, 'Summit Night — Uhuru Peak (5,895m)', 'Midnight departure. Climb through the arctic zone under starlight. Reach Stella Point at dawn, then continue to Uhuru Peak — the Roof of Africa! Descend to Mweka Camp for celebration dinner.', ARRAY['Breakfast','Lunch','Dinner'], 'Mweka Camp (tents)'),
((SELECT id FROM pkg), 7, 'Mweka Camp to Gate & Departure', 'Final descent through rainforest to Mweka Gate. Receive your summit certificate! Transfer to your hotel in Moshi for a well-deserved hot shower and celebration.', ARRAY['Breakfast','Lunch'], 'N/A — Departure');

-- 5. Northern Circuit Grand Safari (10 days)
WITH pkg AS (SELECT id FROM packages WHERE slug = 'northern-circuit-grand-safari')
INSERT INTO package_itinerary (package_id, day_number, title, description, meals, accommodation) VALUES
((SELECT id FROM pkg), 1, 'Arrival in Arusha', 'Welcome to Tanzania! Transfer from Kilimanjaro Airport to your luxury lodge. Evening welcome dinner and safari briefing with your head guide.', ARRAY['Dinner'], 'Gran Meliá Arusha'),
((SELECT id FROM pkg), 2, 'Arusha to Tarangire', 'Drive to Tarangire National Park, home to Tanzania''s largest elephant herds. Afternoon game drive among ancient baobab trees, spotting giraffes, wildebeest, and over 500 bird species.', ARRAY['Breakfast','Lunch','Dinner'], 'Tarangire Treetops Lodge'),
((SELECT id FROM pkg), 3, 'Tarangire to Lake Manyara', 'Morning game drive in Tarangire, then continue to Lake Manyara. Afternoon drive along the alkaline lake watching flamingos, hippos, and the famous tree-climbing lions.', ARRAY['Breakfast','Lunch','Dinner'], 'Lake Manyara Serena Safari Lodge'),
((SELECT id FROM pkg), 4, 'Lake Manyara to Serengeti', 'Cross the highlands and descend into the Serengeti. Stop at a Maasai village for cultural exchange. Begin game drives on the endless plains as the migration herds come into view.', ARRAY['Breakfast','Lunch','Dinner'], 'Four Seasons Safari Lodge Serengeti'),
((SELECT id FROM pkg), 5, 'Full Day Serengeti', 'Dawn game drive following lion prides and cheetah hunts. Explore river crossing points where the migration drama unfolds. Afternoon drive through kopje rock formations seeking leopards.', ARRAY['Breakfast','Lunch','Dinner'], 'Four Seasons Safari Lodge Serengeti'),
((SELECT id FROM pkg), 6, 'Serengeti — Deep Plains', 'Venture into remote Serengeti sectors. Visit a research center learning about conservation efforts. Extended game drive with bush sundowner cocktails at golden hour.', ARRAY['Breakfast','Lunch','Dinner'], 'Four Seasons Safari Lodge Serengeti'),
((SELECT id FROM pkg), 7, 'Serengeti to Ngorongoro', 'Morning game drive, then drive to Ngorongoro. Visit Olduvai Gorge museum. Arrive at the crater rim for breathtaking sunset views across the caldera.', ARRAY['Breakfast','Lunch','Dinner'], 'Ngorongoro Crater Lodge'),
((SELECT id FROM pkg), 8, 'Ngorongoro Crater & Flight to Zanzibar', 'Early descent into the crater for a morning game drive — spot black rhino, lions, and flamingos. Ascend and transfer to the airstrip for your flight to Zanzibar. Beach resort check-in.', ARRAY['Breakfast','Lunch','Dinner'], 'The Residence Zanzibar'),
((SELECT id FROM pkg), 9, 'Zanzibar — Stone Town & Beach', 'Morning Stone Town walking tour exploring spice markets and historic architecture. Afternoon at leisure on pristine beaches. Evening Forodhani night market seafood experience.', ARRAY['Breakfast','Dinner'], 'The Residence Zanzibar'),
((SELECT id FROM pkg), 10, 'Zanzibar Leisure & Departure', 'Free morning for spa, snorkeling, or beach relaxation. Transfer to Zanzibar Airport for your departure. Kwaheri — until we meet again!', ARRAY['Breakfast'], 'N/A — Departure');

-- Update destination package counts
UPDATE destinations SET package_count = (
  SELECT COUNT(*) FROM packages WHERE destination_id = destinations.id AND status = 'published'
) WHERE country = 'Tanzania';
