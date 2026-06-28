export type LocationEntry = {
  slug: string
  name: string
  type: 'neighbourhood' | 'city'
  province?: string
  h1: string
  title: string
  description: string
  heroText: string
  areaServed: string
}

export const LOCATIONS: LocationEntry[] = [
  // Montreal Neighbourhoods
  {
    slug: 'plateau-mont-royal',
    name: 'Plateau Mont-Royal',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Plateau Mont-Royal',
    title: 'Exotic Car Rental Plateau Mont-Royal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Plateau Mont-Royal, Montreal. Luxury and performance vehicles delivered to your door starting from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Plateau Mont-Royal is one of Montreal\'s most vibrant and sought-after neighbourhoods, and it deserves a ride to match. Our exotic car rental service delivers premium vehicles directly to your door anywhere in the Plateau. From sleek sports cars to luxury SUVs, we make every drive through this iconic neighbourhood unforgettable.',
    areaServed: 'Plateau Mont-Royal, Montreal, QC, Canada',
  },
  {
    slug: 'mile-end',
    name: 'Mile End',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Mile End',
    title: 'Exotic Car Rental Mile End Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Mile End, Montreal. Premium and luxury vehicles delivered to your address starting from $299/day. No hidden fees. Book on WhatsApp.',
    heroText:
      'Mile End is Montreal\'s creative and cultural hub, blending art, dining, and urban energy in one legendary neighbourhood. Our exotic car rental service brings the finest luxury and performance vehicles right to your Mile End address. Arrive in style and explore the city the way it was meant to be experienced.',
    areaServed: 'Mile End, Montreal, QC, Canada',
  },
  {
    slug: 'old-montreal',
    name: 'Old Montreal (Vieux-Montréal)',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Old Montreal',
    title: 'Exotic Car Rental Old Montreal (Vieux-Montréal) | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Old Montreal. Drive a luxury or performance vehicle through Vieux-Montréal starting from $299/day. Concierge delivery. Book now.',
    heroText:
      'Old Montreal combines centuries of history with a backdrop that makes every exotic car look like a work of art. Our luxury car rental service delivers stunning vehicles directly to your hotel or address in Vieux-Montréal. Turn every cobblestone street into a photo-worthy moment with our premium fleet.',
    areaServed: 'Old Montreal, Vieux-Montréal, Montreal, QC, Canada',
  },
  {
    slug: 'griffintown',
    name: 'Griffintown',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Griffintown',
    title: 'Exotic Car Rental Griffintown Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Griffintown, Montreal. Luxury vehicles and performance cars delivered to your door from $299/day. 24/7 WhatsApp booking.',
    heroText:
      'Griffintown is Montreal\'s most dynamic and rapidly evolving neighbourhood, home to modern condos, top restaurants, and a thriving energy. Our exotic car rental service delivers premium vehicles to your Griffintown address so you can explore the city in ultimate style. Lamborghinis, Ferraris, and luxury SUVs are just a WhatsApp message away.',
    areaServed: 'Griffintown, Montreal, QC, Canada',
  },
  {
    slug: 'rosemont',
    name: 'Rosemont',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Rosemont',
    title: 'Exotic Car Rental Rosemont Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Rosemont, Montreal. Premium luxury vehicles delivered to your door starting from $299/day. No airport queues. Book on WhatsApp.',
    heroText:
      'Rosemont is a beloved Montreal neighbourhood known for its beautiful parks, lively streets, and welcoming community. Our exotic car rental service brings the best of our luxury and performance fleet directly to your Rosemont doorstep. Skip the rental counter and enjoy a seamless, concierge-style experience from day one.',
    areaServed: 'Rosemont, Montreal, QC, Canada',
  },
  {
    slug: 'outremont',
    name: 'Outremont',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Outremont',
    title: 'Exotic Car Rental Outremont Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Outremont, Montreal. Luxury and high-performance vehicles delivered to your address from $299/day. Concierge service. Book now.',
    heroText:
      'Outremont is one of Montreal\'s most prestigious and elegant neighbourhoods, lined with stunning architecture and a refined urban atmosphere. Our exotic car rental service is the perfect complement to the Outremont lifestyle, delivering top-tier luxury vehicles directly to your door. Experience the city at its finest with our curated fleet.',
    areaServed: 'Outremont, Montreal, QC, Canada',
  },
  {
    slug: 'westmount',
    name: 'Westmount',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Westmount',
    title: 'Exotic Car Rental Westmount Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Westmount, Montreal. Exclusive luxury vehicles and supercars delivered to your home from $299/day. WhatsApp booking available 24/7.',
    heroText:
      'Westmount is synonymous with elegance, luxury, and some of Montreal\'s finest residences. Our exotic car rental service delivers world-class vehicles directly to your Westmount address, matching the neighbourhood\'s distinguished reputation. Choose from Lamborghinis, McLarens, and premium luxury SUVs for an experience that fits right in.',
    areaServed: 'Westmount, Montreal, QC, Canada',
  },
  {
    slug: 'ndg',
    name: 'NDG (Notre-Dame-de-Grâce)',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental NDG',
    title: 'Exotic Car Rental NDG Notre-Dame-de-Grâce | Exotic Rentals Montreal',
    description:
      'Exotic car rental in NDG (Notre-Dame-de-Grâce), Montreal. Premium vehicles delivered to your door starting from $299/day. 24/7 WhatsApp booking.',
    heroText:
      'NDG (Notre-Dame-de-Grâce) is a charming and diverse Montreal neighbourhood with a welcoming community atmosphere. Our exotic car rental service delivers premium luxury and performance vehicles right to your NDG address, no matter the occasion. From weekend getaways to special events, we have the perfect vehicle waiting for you.',
    areaServed: 'Notre-Dame-de-Grâce, NDG, Montreal, QC, Canada',
  },
  {
    slug: 'cote-des-neiges',
    name: 'Côte-des-Neiges',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Côte-des-Neiges',
    title: 'Exotic Car Rental Côte-des-Neiges Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Côte-des-Neiges, Montreal. Luxury and sports cars delivered to your address from $299/day. No hidden fees. Book on WhatsApp.',
    heroText:
      'Côte-des-Neiges is one of Montreal\'s most vibrant and multicultural neighbourhoods, full of life and energy. Our exotic car rental service brings the best luxury and performance vehicles directly to your Côte-des-Neiges address. Elevate your next outing or special occasion with a world-class vehicle at your doorstep.',
    areaServed: 'Côte-des-Neiges, Montreal, QC, Canada',
  },
  {
    slug: 'verdun',
    name: 'Verdun',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Verdun',
    title: 'Exotic Car Rental Verdun Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Verdun, Montreal. Luxury vehicles and performance cars delivered to your door from $299/day. Concierge delivery. Book on WhatsApp.',
    heroText:
      'Verdun is a thriving Montreal neighbourhood on the St. Lawrence River, known for its stunning waterfront and growing food scene. Our exotic car rental service delivers luxury and performance vehicles directly to your Verdun address for a seamless, premium experience. Whether it\'s a special celebration or an everyday upgrade, we\'ve got you covered.',
    areaServed: 'Verdun, Montreal, QC, Canada',
  },
  {
    slug: 'hochelaga',
    name: 'Hochelaga',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Hochelaga',
    title: 'Exotic Car Rental Hochelaga Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Hochelaga, Montreal. Premium sports cars and luxury vehicles delivered to your door from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Hochelaga is one of Montreal\'s most energetic and up-and-coming neighbourhoods, with a bold character that matches our fleet. Our exotic car rental service delivers high-performance and luxury vehicles directly to your Hochelaga address. Make every drive a statement with a car that turns heads wherever you go.',
    areaServed: 'Hochelaga, Montreal, QC, Canada',
  },
  {
    slug: 'saint-laurent',
    name: 'Saint-Laurent',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Saint-Laurent',
    title: 'Exotic Car Rental Saint-Laurent Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Saint-Laurent, Montreal. Luxury and performance vehicles delivered to your address from $299/day. No hidden fees. Book 24/7.',
    heroText:
      'Saint-Laurent is a bustling Montreal borough known for its industrial heritage and vibrant community. Our exotic car rental service offers concierge delivery of premium vehicles straight to your Saint-Laurent location. Choose from our full fleet of sports cars, luxury sedans, and performance SUVs for any occasion.',
    areaServed: 'Saint-Laurent, Montreal, QC, Canada',
  },
  {
    slug: 'ahuntsic',
    name: 'Ahuntsic',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Ahuntsic',
    title: 'Exotic Car Rental Ahuntsic Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Ahuntsic, Montreal. Premium luxury vehicles delivered to your home from $299/day. Concierge service, no hidden fees. Book now.',
    heroText:
      'Ahuntsic is a peaceful and family-friendly Montreal neighbourhood with beautiful riverfront parks and a welcoming atmosphere. Our exotic car rental service delivers world-class luxury and performance vehicles directly to your Ahuntsic address. Perfect for a special occasion, a weekend escape, or simply treating yourself.',
    areaServed: 'Ahuntsic, Montreal, QC, Canada',
  },
  {
    slug: 'saint-henri',
    name: 'Saint-Henri',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Saint-Henri',
    title: 'Exotic Car Rental Saint-Henri Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Saint-Henri, Montreal. Luxury and sports cars delivered to your door from $299/day. 24/7 WhatsApp booking available.',
    heroText:
      'Saint-Henri is a culturally rich and rapidly growing Montreal neighbourhood blending industrial charm with modern living. Our exotic car rental service makes it effortless to get a luxury or performance vehicle delivered right to your Saint-Henri address. Enjoy a premium experience without leaving your neighbourhood.',
    areaServed: 'Saint-Henri, Montreal, QC, Canada',
  },
  {
    slug: 'cote-saint-luc',
    name: 'Côte-Saint-Luc',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Côte-Saint-Luc',
    title: 'Exotic Car Rental Côte-Saint-Luc Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Côte-Saint-Luc, Montreal. Premium luxury and performance cars delivered to your address from $299/day. Book on WhatsApp.',
    heroText:
      'Côte-Saint-Luc is a prestigious residential community in Montreal known for its safety, community spirit, and well-kept streets. Our exotic car rental service delivers top-tier luxury vehicles directly to your Côte-Saint-Luc address, bringing the showroom experience to your driveway. Choose from Lamborghinis, BMWs, Ferraris, and more.',
    areaServed: 'Côte-Saint-Luc, Montreal, QC, Canada',
  },
  {
    slug: 'montreal-nord',
    name: 'Montréal-Nord',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Montréal-Nord',
    title: 'Exotic Car Rental Montréal-Nord | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Montréal-Nord. Luxury and performance vehicles delivered to your door starting from $299/day. 24/7 WhatsApp booking.',
    heroText:
      'Montréal-Nord is a dynamic borough in the northeast of Montreal with a strong community and growing local scene. Our exotic car rental service delivers premium luxury and performance vehicles directly to your Montréal-Nord address. Whether it\'s a birthday, prom, or weekend adventure, we bring the car to you.',
    areaServed: 'Montréal-Nord, Montreal, QC, Canada',
  },
  {
    slug: 'villeray',
    name: 'Villeray',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Villeray',
    title: 'Exotic Car Rental Villeray Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Villeray, Montreal. Luxury vehicles and sports cars delivered to your address from $299/day. No hidden fees. Book on WhatsApp.',
    heroText:
      'Villeray is one of Montreal\'s most beloved neighbourhoods, celebrated for its local markets, diverse restaurants, and friendly streets. Our exotic car rental service delivers the finest luxury and performance vehicles straight to your Villeray address. Turn a regular day into an extraordinary one with the right car.',
    areaServed: 'Villeray, Montreal, QC, Canada',
  },
  {
    slug: 'anjou',
    name: 'Anjou',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Anjou',
    title: 'Exotic Car Rental Anjou Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Anjou, Montreal. Premium vehicles and luxury cars delivered to your door from $299/day. Concierge delivery. Book 24/7.',
    heroText:
      'Anjou is a well-established Montreal borough on the east end of the island, offering a comfortable blend of residential life and commercial activity. Our exotic car rental service provides concierge delivery of premium luxury and performance vehicles directly to your Anjou address. Make your next event truly memorable.',
    areaServed: 'Anjou, Montreal, QC, Canada',
  },
  {
    slug: 'pointe-aux-trembles',
    name: 'Pointe-aux-Trembles',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental Pointe-aux-Trembles',
    title: 'Exotic Car Rental Pointe-aux-Trembles | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Pointe-aux-Trembles, Montreal. Luxury vehicles delivered to your door starting from $299/day. 24/7 WhatsApp booking.',
    heroText:
      'Pointe-aux-Trembles sits at the eastern tip of Montreal Island, offering a scenic and tranquil setting that pairs beautifully with a premium drive. Our exotic car rental service delivers luxury and performance vehicles right to your address in Pointe-aux-Trembles. Experience the open road in a Lamborghini, McLaren, or any car from our fleet.',
    areaServed: 'Pointe-aux-Trembles, Montreal, QC, Canada',
  },
  {
    slug: 'lasalle',
    name: 'LaSalle',
    type: 'neighbourhood',
    h1: 'Exotic Car Rental LaSalle',
    title: 'Exotic Car Rental LaSalle Montreal | Exotic Rentals Montreal',
    description:
      'Exotic car rental in LaSalle, Montreal. Luxury and performance vehicles delivered to your door from $299/day. No hidden fees. Book on WhatsApp 24/7.',
    heroText:
      'LaSalle is a vibrant Montreal borough on the southwestern shoreline of the island, known for its riverside parks and diverse community. Our exotic car rental service delivers world-class luxury and performance vehicles directly to your LaSalle address. From Ferraris to luxury SUVs, our fleet is just a message away.',
    areaServed: 'LaSalle, Montreal, QC, Canada',
  },

  // Quebec Cities
  {
    slug: 'laval',
    name: 'Laval',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Laval',
    title: 'Exotic Car Rental Laval QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Laval, QC. Luxury and performance vehicles delivered from Montreal to your Laval address starting from $299/day. Book on WhatsApp.',
    heroText:
      'Laval is Quebec\'s third-largest city and sits just minutes north of Montreal, making it a perfect destination for our exotic car rental delivery service. We bring luxury and performance vehicles directly to your Laval address, with no airport queues or rental counters. Enjoy a Ferrari, Lamborghini, or premium SUV delivered right to your door.',
    areaServed: 'Laval, QC, Canada',
  },
  {
    slug: 'longueuil',
    name: 'Longueuil',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Longueuil',
    title: 'Exotic Car Rental Longueuil QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Longueuil, QC. We deliver luxury and performance vehicles from Montreal to your Longueuil address from $299/day. Book on WhatsApp.',
    heroText:
      'Longueuil is a thriving city on the South Shore of Montreal, and we are proud to offer exotic car rental delivery directly to your address there. Our luxury fleet travels from Montreal to bring you the finest sports cars, supercars, and premium SUVs. Book on WhatsApp and we will handle all the details.',
    areaServed: 'Longueuil, QC, Canada',
  },
  {
    slug: 'gatineau',
    name: 'Gatineau',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Gatineau',
    title: 'Exotic Car Rental Gatineau QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Gatineau, QC. Luxury and performance vehicles from our Montreal fleet starting from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Gatineau is a stunning city in western Quebec, bordering Ottawa and offering some of Canada\'s most scenic drives. We deliver our exotic and luxury car rental fleet from Montreal to Gatineau so you can experience the region in total style. Contact us on WhatsApp for pricing and availability for your Gatineau delivery.',
    areaServed: 'Gatineau, QC, Canada',
  },
  {
    slug: 'sherbrooke',
    name: 'Sherbrooke',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Sherbrooke',
    title: 'Exotic Car Rental Sherbrooke QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Sherbrooke, QC. We deliver luxury and performance vehicles from Montreal starting from $299/day. Book on WhatsApp.',
    heroText:
      'Sherbrooke is the vibrant capital of the Eastern Townships, surrounded by rolling hills and scenic landscapes that are perfect for a luxury car drive. We deliver exotic and performance vehicles from Montreal across Quebec to your Sherbrooke address. Whether it\'s a special event or a weekend getaway, we bring the showroom to you.',
    areaServed: 'Sherbrooke, QC, Canada',
  },
  {
    slug: 'saguenay',
    name: 'Saguenay',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Saguenay',
    title: 'Exotic Car Rental Saguenay QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Saguenay, QC. Luxury vehicles from our Montreal fleet delivered across Quebec from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Saguenay is one of Quebec\'s most spectacular cities, nestled along the dramatic Saguenay Fjord with breathtaking natural scenery. We deliver our full luxury and exotic car rental fleet from Montreal to clients across Quebec including Saguenay. Contact us on WhatsApp to arrange your delivery and make your Saguenay experience unforgettable.',
    areaServed: 'Saguenay, QC, Canada',
  },
  {
    slug: 'trois-rivieres',
    name: 'Trois-Rivières',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Trois-Rivières',
    title: 'Exotic Car Rental Trois-Rivières QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Trois-Rivières, QC. Luxury and sports cars delivered from Montreal starting from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Trois-Rivières is a historic and charming city halfway between Montreal and Quebec City, making it an ideal stop for an exotic driving experience. We deliver luxury and performance vehicles from Montreal to clients in Trois-Rivières and across Quebec. Reach out on WhatsApp to get a quote and reserve your car today.',
    areaServed: 'Trois-Rivières, QC, Canada',
  },
  {
    slug: 'terrebonne',
    name: 'Terrebonne',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Terrebonne',
    title: 'Exotic Car Rental Terrebonne QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Terrebonne, QC. Luxury and performance vehicles delivered from Montreal to your address from $299/day. Book on WhatsApp.',
    heroText:
      'Terrebonne is a picturesque city north of Montreal along the Mille Îles River, known for its rich heritage and beautiful natural surroundings. Our exotic car rental service offers delivery from Montreal to Terrebonne so you can enjoy a luxury vehicle without the hassle. Choose from our full fleet and we will bring the car to you.',
    areaServed: 'Terrebonne, QC, Canada',
  },
  {
    slug: 'saint-jerome',
    name: 'Saint-Jérôme',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Saint-Jérôme',
    title: 'Exotic Car Rental Saint-Jérôme QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Saint-Jérôme, QC. Luxury vehicles from Montreal delivered to your door from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Saint-Jérôme is the gateway to the Laurentians, surrounded by some of Quebec\'s most beautiful mountain scenery. Our luxury car rental delivery service brings premium vehicles from Montreal straight to your Saint-Jérôme address. Explore the Laurentians in a Lamborghini, Ferrari, or any vehicle from our exotic fleet.',
    areaServed: 'Saint-Jérôme, QC, Canada',
  },
  {
    slug: 'blainville',
    name: 'Blainville',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Blainville',
    title: 'Exotic Car Rental Blainville QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Blainville, QC. Luxury and performance vehicles delivered from Montreal from $299/day. Concierge service. Book on WhatsApp.',
    heroText:
      'Blainville is a growing and prosperous city north of Montreal, known for its high quality of life and family-friendly environment. We deliver exotic and luxury car rentals from Montreal to Blainville for clients who want a premium experience at their doorstep. Celebrate any occasion in style with one of our world-class vehicles.',
    areaServed: 'Blainville, QC, Canada',
  },
  {
    slug: 'brossard',
    name: 'Brossard',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Brossard',
    title: 'Exotic Car Rental Brossard QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Brossard, QC. Luxury vehicles and sports cars delivered from Montreal to your door from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Brossard is a dynamic South Shore city just minutes from Montreal, and one of our most popular delivery destinations for exotic car rentals. We bring our full fleet of luxury and performance vehicles directly to your Brossard address, making the premium rental experience effortless. Message us on WhatsApp to book your next adventure.',
    areaServed: 'Brossard, QC, Canada',
  },
  {
    slug: 'repentigny',
    name: 'Repentigny',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Repentigny',
    title: 'Exotic Car Rental Repentigny QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Repentigny, QC. Luxury and performance vehicles from Montreal from $299/day. Concierge delivery. Book on WhatsApp.',
    heroText:
      'Repentigny is a welcoming city on the north shore of the St. Lawrence River, just east of Montreal Island. Our exotic car rental service offers convenient delivery from Montreal to Repentigny, bringing luxury and performance vehicles directly to your address. No queues, no counters: just a premium car at your door.',
    areaServed: 'Repentigny, QC, Canada',
  },
  {
    slug: 'drummondville',
    name: 'Drummondville',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Drummondville',
    title: 'Exotic Car Rental Drummondville QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Drummondville, QC. Luxury vehicles from our Montreal fleet from $299/day. We deliver across Quebec. Book on WhatsApp.',
    heroText:
      'Drummondville is a thriving city in the Centre-du-Québec region, perfectly located between Montreal and Quebec City. We deliver exotic and luxury car rentals from Montreal to clients across Quebec including Drummondville. Get in touch on WhatsApp to discuss your rental and arrange delivery at your convenience.',
    areaServed: 'Drummondville, QC, Canada',
  },
  {
    slug: 'saint-jean-sur-richelieu',
    name: 'Saint-Jean-sur-Richelieu',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Saint-Jean-sur-Richelieu',
    title: 'Exotic Car Rental Saint-Jean-sur-Richelieu QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Saint-Jean-sur-Richelieu, QC. Luxury vehicles from Montreal from $299/day. We deliver across Quebec. Book on WhatsApp.',
    heroText:
      'Saint-Jean-sur-Richelieu is a beautiful city along the Richelieu River, renowned for its international hot air balloon festival and scenic surroundings. Our luxury and exotic car rental service delivers premium vehicles from Montreal to Saint-Jean-sur-Richelieu for any occasion. Make your visit to this charming city truly extraordinary.',
    areaServed: 'Saint-Jean-sur-Richelieu, QC, Canada',
  },
  {
    slug: 'levis',
    name: 'Lévis',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Lévis',
    title: 'Exotic Car Rental Lévis QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Lévis, QC. Luxury and performance vehicles from our Montreal fleet from $299/day. We deliver across Quebec. Book now.',
    heroText:
      'Lévis sits across the St. Lawrence River from Quebec City, offering some of the most breathtaking views in all of Canada. We deliver our exotic and luxury car rental fleet from Montreal to clients across Quebec including Lévis. Contact us on WhatsApp to arrange your vehicle delivery and explore the region in unparalleled style.',
    areaServed: 'Lévis, QC, Canada',
  },
  {
    slug: 'granby',
    name: 'Granby',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Granby',
    title: 'Exotic Car Rental Granby QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Granby, QC. Luxury and performance vehicles from Montreal from $299/day. We deliver across Quebec. Book on WhatsApp.',
    heroText:
      'Granby is a vibrant Eastern Townships city known for its famous zoo and beautiful natural surroundings. Our exotic car rental service delivers luxury and performance vehicles from Montreal to Granby so you can explore the region in absolute style. Get in touch on WhatsApp for pricing and to reserve your preferred vehicle.',
    areaServed: 'Granby, QC, Canada',
  },
  {
    slug: 'chateauguay',
    name: 'Châteauguay',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Châteauguay',
    title: 'Exotic Car Rental Châteauguay QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental in Châteauguay, QC. Luxury vehicles delivered from Montreal to your door from $299/day. Concierge service. Book on WhatsApp 24/7.',
    heroText:
      'Châteauguay is a thriving South Shore city with a strong community and easy access to Montreal and the broader Quebec region. We deliver exotic and luxury car rentals from Montreal directly to your Châteauguay address, making the premium experience accessible and hassle-free. Choose your car and we will bring it to you.',
    areaServed: 'Châteauguay, QC, Canada',
  },
  {
    slug: 'saint-hyacinthe',
    name: 'Saint-Hyacinthe',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Saint-Hyacinthe',
    title: 'Exotic Car Rental Saint-Hyacinthe QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Saint-Hyacinthe, QC. Luxury and performance vehicles from Montreal from $299/day. We deliver across Quebec. Book now.',
    heroText:
      'Saint-Hyacinthe is the agrifood capital of Quebec, a progressive and welcoming city in the Montérégie region. Our luxury car rental delivery service brings exotic and high-performance vehicles from Montreal to clients in Saint-Hyacinthe and across Quebec. Reach out on WhatsApp to book your rental and arrange seamless delivery.',
    areaServed: 'Saint-Hyacinthe, QC, Canada',
  },
  {
    slug: 'joliette',
    name: 'Joliette',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Joliette',
    title: 'Exotic Car Rental Joliette QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Joliette, QC. Luxury and performance vehicles from Montreal from $299/day. We deliver across Quebec. Book on WhatsApp.',
    heroText:
      'Joliette is a cultural gem in the Lanaudière region, home to an internationally recognized music festival and beautiful natural landscapes. We deliver our exotic car rental fleet from Montreal to Joliette so you can arrive at any event in style. Message us on WhatsApp and we will arrange everything for your perfect ride.',
    areaServed: 'Joliette, QC, Canada',
  },
  {
    slug: 'rimouski',
    name: 'Rimouski',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Rimouski',
    title: 'Exotic Car Rental Rimouski QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Rimouski, QC. Luxury vehicles from our Montreal fleet delivered across Quebec from $299/day. Book on WhatsApp 24/7.',
    heroText:
      'Rimouski is a spectacular city on the south shore of the St. Lawrence River, offering dramatic ocean views and sweeping roads perfect for an exotic drive. Our luxury car rental service delivers vehicles from Montreal across Quebec to clients in Rimouski and beyond. Contact us on WhatsApp to learn more and arrange your delivery.',
    areaServed: 'Rimouski, QC, Canada',
  },
  {
    slug: 'quebec-city',
    name: 'Québec City',
    type: 'city',
    province: 'QC',
    h1: 'Exotic Car Rental Québec City',
    title: 'Exotic Car Rental Québec City QC | Exotic Rentals Montreal',
    description:
      'Exotic car rental delivery to Québec City, QC. Luxury and performance vehicles from our Montreal fleet from $299/day. We deliver across Quebec. Book now.',
    heroText:
      'Québec City is one of the most beautiful and historic cities in North America, with iconic architecture and stunning riverfront views. Our luxury car rental service delivers exotic and performance vehicles from Montreal to Québec City so you can explore this magnificent destination in ultimate style. Contact us on WhatsApp to arrange your delivery today.',
    areaServed: 'Québec City, QC, Canada',
  },
]

export function getLocationBySlug(slug: string): LocationEntry | undefined {
  return LOCATIONS.find((loc) => loc.slug === slug)
}
