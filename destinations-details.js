//Destinations details
const destinations = [
    {
        title: "Swiss Alps 🏔️ - A Majestic Wonderland of Snow and Adventure",
        image1: "images/swissalps1.jpg",
        image2: "images/swissalps2.jpg",
        image3: "images/swissalps3.jpg",
        image4: "images/swissalps4.jpg",
        image5: "images/swissalps5.jpg",
        theme1: "Breathtaking Alpine Landscapes ❄️",
        theme2: "Charming Villages & Swiss Cuisine 🧀🏡",
        theme3: "A Year-Round Adventure Destination 🎿",
        description1: "The Swiss Alps are a breathtaking mountain range known for their snow-capped peaks, scenic landscapes, and world-class ski resorts. Popular destinations like Zermatt, Jungfrau, and St. Moritz attract visitors year-round for skiing, hiking, and stunning panoramic views. 🏞️",
        description2: "Beyond adventure, the region offers charming alpine villages, luxurious resorts, and delicious Swiss cuisine like fondue and raclette. Whether exploring by train or hiking through lush meadows, the Swiss Alps promise an unforgettable escape into nature. 🚞🍫",
        description3: "The Swiss Alps are a majestic mountain range offering incredible outdoor activities, including skiing, hiking, and mountaineering. With picturesque villages and panoramic views, it’s a year-round destination for adventure seekers and nature lovers alike. 🏔️🚵‍♂️",
        culturetheme: "Swiss Traditions & Alpine Beauty 🇨🇭",
        culture1: "Swiss culture blends German, French, and Italian influences. Traditions include yodeling, cow parades, and delicious cheese-making. 🐄🎶",
        culture2: "Switzerland is also known for its world-famous chocolates, precision watches, and the scenic Glacier Express train journey. 🍫🕰️🚆",
        fact1: "The Swiss Alps Cover More Than Half of Switzerland 🏔️",
        factdesc1: "Around 60% of Switzerland is covered by the Alps, making it one of the most mountainous countries in Europe! 🏞️",
        fact2: "Home to the Iconic Matterhorn ⛰️",
        factdesc2: "The Matterhorn is one of the most famous mountains in the world. Its pyramid shape even inspired the Toblerone chocolate logo! 🍫🏔️",
        fact3: "You Can Visit the World’s Highest Train Station 🚂",
        factdesc3: "The Jungfraujoch railway station, located at 3,454 meters (11,332 feet) above sea level, is the highest train station in Europe! 🌍🚆"
    },

    {
        title: "🌴 Bali - The Island of Gods and Paradise 🌺",
        image1: "images/bali1.jpg",
        image2: "images/bali2.jpg",
        image3: "images/bali3.jpg",
        image4: "images/bali4.jpg",
        image5: "images/bali5.jpg",
        theme1: "🏝️ Tropical Beauty & Culture",
        theme2: "🏯 Iconic Landmarks & Local Delights",
        theme3: "🌊 A Blend of Adventure & Relaxation",
        description1: "Bali, known as the 'Island of the Gods' 🙏, is famous for its stunning beaches 🏖️, lush rice terraces 🌾, and vibrant culture 🎭. Visitors can explore Ubud’s serene temples, enjoy the nightlife in Seminyak 🎉, or surf in Kuta 🏄.",
        description2: "The island also offers breathtaking waterfalls 🌊, traditional Balinese dance performances 💃, and mouthwatering local cuisine 🍛. Don't miss the iconic Tanah Lot temple 🏯 during sunset 🌅 for a magical experience!",
        description3: "Bali is a tropical haven offering a mix of natural beauty 🍃, rich culture 🏯, and adventure 🚀. From its tranquil beaches 🏖️ to lush jungles 🌳, it's a perfect destination for both relaxation and exploration. Visitors can discover ancient temples 🏛️, vibrant markets 🛍️, and hidden waterfalls 💦 throughout the island.",
        culturetheme: "🎨 The Spiritual and Artistic Culture of Bali",
        culture1: "Bali’s culture blends Hindu traditions with local beliefs 🕉️. Temples like Tanah Lot host ceremonies, while festivals like Galungan and Nyepi reflect spirituality. Traditional dances 💃, Gamelan music 🎶, and Wayang Kulit puppetry 🎭 preserve its artistic heritage.",
        culture2: "Canang Sari offerings 🌸 show devotion, and the Banjar system strengthens communities. Balinese cuisine 🍽️ features Babi Guling 🐷 and Ayam Betutu 🍗. Unique traditions like the Ogoh-Ogoh Parade 🐉 and Tooth Filing Ceremony 🦷 highlight its deep-rooted customs.",
        fact1: "🏯 Bali Has Over 20,000 Temples",
        factdesc1: "Bali is known for its spiritual and religious culture, and there are literally thousands of temples, from small shrines in homes to massive ones like Tanah Lot and Uluwatu Temple.",
        fact2: "☕ It’s Home to the World’s Most Expensive Coffee",
        factdesc2: "Kopi Luwak, or \"civet coffee\" 🐾, is made from coffee beans that have been eaten and digested by a civet cat before being processed. It’s one of the priciest coffees in the world!",
        fact3: "🛑 Bali Has a New Year’s Celebration Like No Other – Nyepi",
        factdesc3: "Nyepi, or the \"Day of Silence\" 🤫, is Bali's unique New Year celebration where the entire island shuts down—no flights ✈️, no cars 🚗, no electricity 💡, and everyone must stay indoors in complete silence."
    },

    {
        title: "❄️🔥 Iceland - A Land of Vivid Contrasts of Climate, Geography, and Culture 🌋🌊",
        image1: "images/iceland1.jpg",
        image2: "images/iceland2.jpg",
        image3: "images/iceland3.jpg",
        image4: "images/iceland4.jpg",
        image5: "images/iceland5.jpg",
        theme1: "🌋❄️ Land of Fire & Ice",
        theme2: "🚗🏔️ Thrilling Adventures & Scenic Drives",
        theme3: "🌌🌊 Unparalleled Natural Wonders",
        description1: "Iceland is a land of stunning contrasts, featuring glaciers 🏔️, volcanoes 🌋, geysers 💨, and black sand beaches 🖤🏖️. Popular attractions include the Blue Lagoon ♨️, Golden Circle 🌿, and the breathtaking Northern Lights 🌌.",
        description2: "Adventure seekers can explore ice caves ❄️, hike volcanoes ⛰️, or drive along the scenic Ring Road 🚗. With its unique landscapes and rich Viking heritage ⚔️, Iceland offers an unforgettable experience in every season.",
        description3: "Iceland is a captivating island of natural wonders 🌍, with dramatic landscapes of glaciers 🏔️, hot springs ♨️, and lava fields 🔥. From soaking in geothermal spas to witnessing the Northern Lights 🌌, it’s a destination full of awe-inspiring beauty and adventure.",
        culturetheme: "🎭 Icelandic Traditions and Nature 🌿",
        culture1: "Icelandic culture is shaped by its Viking heritage ⚔️, storytelling 📖, and nature 🌿. Sagas, folklore (Huldufólk) 👻, and traditional folk music thrive alongside modern artists like Björk 🎶. Festivals like Þorrablót 🎉 honor Viking traditions, while hiking 🥾 and geothermal bathing ♨️ reflect a deep bond with nature.",
        culture2: "The cuisine features lamb 🥩, seafood 🐟, and fermented foods like hákarl (shark) 🦈. With a strong focus on equality ⚖️, sustainability 🌍, and creativity 🎨, Iceland blends ancient traditions with modern innovation.",
        fact1: "🐑 Iceland Has More Sheep Than People",
        factdesc1: "The population of Iceland is around 370,000 people, but there are over 800,000 sheep roaming the countryside—more than double the human population!",
        fact2: "♨️🏊‍♂️ You Can Swim in Geothermal Hot Springs All Year",
        factdesc2: "Thanks to Iceland’s volcanic activity, you can relax in natural hot springs like the famous Blue Lagoon and Secret Lagoon, even in freezing temperatures! ❄️",
        fact3: "❌🦟 There Are No Mosquitoes in Iceland",
        factdesc3: "Unlike most countries, Iceland has zero mosquitoes because the climate and soil conditions make it impossible for them to survive."
    },
    
    {
        title: "🏜️🏛️ Petra - A Historic and Archaeological City 🌹",
        image1: "images/petra1.jpg",
        image2: "images/petra2.jpg",
        image3: "images/petra3.jpg",
        image4: "images/petra4.jpg",
        image5: "images/petra5.jpg",
        theme1: "📜🌹 The Rose City’s Rich History",
        theme2: "🏛️🌄 Iconic Landmarks & Breathtaking Views",
        theme3: "🌍✨ A UNESCO World Heritage Treasure",
        description1: "Petra, an ancient city carved into rose-red cliffs 🏜️, is one of Jordan’s most iconic landmarks. Known as the 'Rose City' 🌹, it was once a thriving trade hub of the Nabataean civilization.",
        description2: "Visitors can walk through the Siq 🌄, a narrow canyon leading to the breathtaking Al-Khazneh (The Treasury) 🏛️, explore ancient tombs ⚰️, and hike up to the Monastery 🏰 for stunning views of the desert landscape.",
        description3: "Petra, a UNESCO World Heritage Site 🌍, is a remarkable ancient city carved into striking rose-red rock formations. Known for its impressive architecture 🏛️ and historical significance, it offers a unique glimpse into the Nabataean civilization through landmarks like the Treasury and the Monastery.",
        culturetheme: "🕌🏜️ The Ancient and Nomadic Heritage of Petra",
        culture1: "Petra’s culture is shaped by its Nabataean heritage 🏺, Bedouin traditions ⛺, and Arab influences. Once a major trade hub 🏦, its rock-cut architecture reflects Greek, Roman, and Middle Eastern styles. Bedouins preserve nomadic traditions through hospitality ☕, music 🎶, and handcrafted goods 🎨.",
        culture2: "Festivals like Petra by Night ✨ celebrate its history, while Jordanian cuisine 🍽️, featuring Mansaf 🍖 and Bedouin tea 🍵, remains central to local traditions.",
        fact1: "🌍 It’s One of the New Seven Wonders of the World",
        factdesc1: "In 2007, Petra was named one of the New Seven Wonders of the World, alongside places like the Great Wall of China 🏯 and Machu Picchu ⛰️!",
        fact2: "🌹 Petra Is Also Known as the \"Rose City\"",
        factdesc2: "The pinkish-red sandstone cliffs give Petra its famous nickname, especially during sunrise and sunset 🌅 when the colors become even more vibrant!",
        fact3: "⛏️🏜️ It Was Carved Directly into the Rock",
        factdesc3: "Unlike most ancient cities built from blocks and bricks 🏗️, Petra was carved straight into the rock face, including its famous structure, Al-Khazneh (The Treasury) 🏛️."
    },
    
    {
        title: "🌴 Costa Rica - A Tropical Paradise of Biodiversity 🌿",
        image1: "images/costarica1.jpg",
        image2: "images/costarica2.jpg",
        image3: "images/costarica3.jpg",
        image4: "images/costarica4.jpg",
        image5: "images/costarica5.jpg",
        theme1: "🌿🐒 A Nature Lover’s Paradise",
        theme2: "🏄‍♂️🌊 Adventurous Activities & Serenity",
        theme3: "🦜🌄 Thrilling Wildlife & Scenic Views",
        description1: "Costa Rica is a haven for nature lovers 🌿, known for its lush rainforests 🌳, stunning beaches 🏖️, and diverse wildlife 🐒🦜. Visitors can explore Arenal Volcano 🌋, Monteverde Cloud Forest ☁️, and Manuel Antonio National Park 🌊.",
        description2: "Adventure seekers can enjoy zip-lining 🌲⚡, surfing 🏄‍♀️, and wildlife spotting 🦥, while those looking to relax can unwind in hot springs ♨️ or on pristine beaches 🏝️. Costa Rica’s 'Pura Vida' lifestyle makes it a truly unforgettable destination.",
        description3: "Costa Rica is a tropical paradise 🌴 offering vibrant ecosystems, from misty cloud forests ☁️ to golden beaches 🏝️. With abundant wildlife 🦜, thrilling activities like zip-lining 🌲, and a laid-back vibe, it’s the perfect blend of adventure and relaxation.",
        culturetheme: "🎶🌎 Costa Rica’s ‘Pura Vida’ Lifestyle",
        culture1: "Costa Rica’s culture blends Spanish, Indigenous, and Afro-Caribbean influences 🌍, embracing the Pura Vida lifestyle ☀️. Music and dance 💃🎶, like cumbia and marimba, are central, while festivals 🎉 such as Día de los Boyeros celebrate tradition.",
        culture2: "Cuisine 🍽️ features Gallo Pinto 🍛, Casado 🥩, and tropical fruits 🍍🍌. With a strong respect for nature 🌱, Costa Ricans prioritize sustainability 🌍, biodiversity 🦋, and outdoor adventures like surfing 🏄 and hiking ⛰️.",
        fact1: "🚫⚔️ Costa Rica Has No Army",
        factdesc1: "In 1948, Costa Rica abolished its military, making it one of the only countries in the world without an army 🌍. Instead, the money is spent on education 📚 and healthcare 🏥!",
        fact2: "🌱🐒🦜 Costa Rica Has 5% of the World’s Biodiversity",
        factdesc2: "Even though it’s smaller than West Virginia, Costa Rica holds about 5% of the world’s biodiversity 🌍, with 500,000+ species of plants 🌿 and animals 🦥!",
        fact3: "🌋🔥 It’s Home to the World’s Most Active Volcanoes",
        factdesc3: "Arenal Volcano 🌋 was one of the world’s most active volcanoes for decades, and Poás Volcano has one of the largest craters on Earth 🌎!"
    },
    

    {
        title: "⛩️🌸 Kyoto - The Heart of Traditional Japan 🇯🇵",
        image1: "images/kyoto1.jpg",
        image2: "images/kyoto2.jpg",
        image3: "images/kyoto3.jpg",
        image4: "images/kyoto4.jpg",
        image5: "images/kyoto5.jpg",
        theme1: "🏯🌿 Timeless Temples & Gardens",
        theme2: "🎎🍵 Traditional Arts & Seasonal Beauty",
        theme3: "📜🏮 A Journey Through Japan’s Past",
        description1: "Kyoto, Japan’s cultural capital 🇯🇵, is known for its ancient temples 🏯, stunning gardens 🌿, and historic geisha districts 🎎. Iconic sites include Kinkaku-ji (Golden Pavilion) ✨, Fushimi Inari Shrine ⛩️, and Arashiyama Bamboo Forest 🎍.",
        description2: "Visitors can experience traditional tea ceremonies 🍵, stroll through cherry blossom-lined streets 🌸, and explore centuries-old castles 🏰. Kyoto’s blend of history, culture, and natural beauty makes it a must-visit destination.",
        description3: "Kyoto, Japan's cultural heart ❤️, is celebrated for its timeless beauty 🌿, with ancient temples 🏯, serene gardens 🌳, and the historic Gion district 🎭. Visitors can immerse themselves in traditional arts 🎨, witness breathtaking seasonal changes 🍁🌸, and explore iconic landmarks like the Golden Pavilion ✨ and Fushimi Inari Shrine ⛩️.",
        culturetheme: "🎎📜 The Heart of Japanese Tradition",
        culture1: "Kyoto, Japan’s former imperial capital 🏯, preserves Zen Buddhism 🧘, tea ceremonies 🍵, geisha culture 🎭, and festivals like Gion Matsuri 🎉. Traditional arts such as kimono weaving 👘, calligraphy 🖌️, and Noh theater 🎭 thrive, alongside Kaiseki dining 🍽️ and matcha sweets 🍵🍡.",
        culture2: "Blending samurai heritage ⚔️, Shinto shrines ⛩️, and serene gardens 🌿, Kyoto embodies Japan’s timeless elegance 🎎 and modern creativity 🎨.",
        fact1: "🏯 Kyoto Was Once Japan’s Capital for Over 1,000 Years",
        factdesc1: "From 794 to 1868, Kyoto was Japan’s capital before the title moved to Tokyo! That’s why it’s still rich in traditional culture 🎎 and history 📜.",
        fact2: "⛩️🙏 It Has Over 1,600 Temples",
        factdesc2: "Kyoto is home to more than 1,600 Buddhist temples 🏯 and 400 Shinto shrines ⛩️, including famous ones like Fushimi Inari Taisha ⛩️ and Kinkaku-ji (Golden Pavilion) ✨!",
        fact3: "🏙️ Kyoto’s Name Means \"Capital City\"",
        factdesc3: "The name \"Kyoto\" (京都) literally means \"Capital City\" 🏯, which made sense when it was Japan’s capital for centuries!"
    },
    
    {
        title: "🏔️🎢 Queenstown - The Adventure Capital of New Zealand 🇳🇿",
        image1: "images/queenstown1.jpg",
        image2: "images/queenstown2.jpg",
        image3: "images/queenstown3.jpg",
        image4: "images/queenstown4.jpg",
        image5: "images/queenstown5.jpg",
        theme1: "🎯 A Thrill-Seeker’s Dream",
        theme2: "🌄🛶 Stunning Scenery & Relaxation",
        theme3: "⛰️🏂 Breathtaking Landscapes & Activities",
        description1: "Queenstown, nestled on the shores of Lake Wakatipu 🏞️, is a paradise for adventure seekers 🎢. Surrounded by the Southern Alps 🏔️, it offers activities like bungee jumping 🏗️, skydiving 🪂, and skiing 🎿 in the winter.",
        description2: "Beyond adrenaline-pumping experiences, visitors can enjoy scenic cruises 🚤, explore nearby wineries 🍷, and take in breathtaking views from the Skyline Gondola 🚡. Queenstown is the perfect mix of thrill and natural beauty.",
        description3: "Queenstown, set against the stunning Southern Alps 🏔️, is an adventure lover’s dream 💙. From thrilling activities like bungee jumping 😱 and skiing ⛷️ to peaceful cruises 🚢 and vineyard tours 🍇, it combines heart-pounding excitement with breathtaking landscapes.",
        culturetheme: "🎭🌏 Queenstown: New Zealand’s Adventure and Arts Hub",
        culture1: "Queenstown, New Zealand 🇳🇿, blends adventure tourism 🎢 with a deep connection to nature 🌿. Activities like bungee jumping 🏗️, skiing 🎿, and hiking 🚶 thrive alongside Māori cultural influences in art 🎨, stories 📜, and language 🗣️.",
        culture2: "With a relaxed yet adventurous spirit 🌊, Queenstown offers fresh local cuisine 🥩, Central Otago wines 🍷, and vibrant arts 🎭, music 🎶, and film festivals 🎬.",
        fact1: "🏗️😱 Queenstown Is the Birthplace of Commercial Bungy Jumping",
        factdesc1: "The first-ever commercial bungy jump happened at the Kawarau Bridge 🌉 in 1988, founded by AJ Hackett. Today, thrill-seekers from around the world come to take the leap!",
        fact2: "⚡🏞️ It’s Surrounded by a Lake That Looks Like a Lightning Bolt",
        factdesc2: "Lake Wakatipu, Queenstown’s stunning lake, has a unique zigzag shape, resembling a lightning bolt from above! ⚡",
        fact3: "💙🌊 The Lake Has a Mysterious \"Heartbeat\"",
        factdesc3: "The water level of Lake Wakatipu rises and falls about 10 cm (4 inches) every 25 minutes—a natural phenomenon caused by its unique geography and water flow! 🌊"
    },
    
    {
        title: "🏝️✨ Maldives - A Tropical Paradise of Luxury and Serenity 🌊🐠",
        image1: "images/maldives1.jpg",
        image2: "images/maldives2.jpg",
        image3: "images/maldives3.jpg",
        image4: "images/maldives4.jpg",
        image5: "images/maldives5.jpg",
        theme1: "🌊 Crystal-Clear Waters & White Sands 🏖️",
        theme2: "🐠 Unforgettable Experiences & Marine Life 🐬",
        theme3: "🏝️ The Ultimate Island Getaway 🌅",
        description1: "The Maldives, a stunning island nation in the Indian Ocean 🌊, is famous for its crystal-clear waters 💙, overwater bungalows 🏡, and vibrant coral reefs 🪸. It’s the ultimate destination for relaxation and luxury.",
        description2: "Visitors can enjoy snorkeling 🤿, scuba diving 🐠, and sunset cruises 🚤 while experiencing world-class resorts and private island retreats 🌺. With its breathtaking beauty, the Maldives is a dream escape for honeymooners 💕 and travelers alike.",
        description3: "The Maldives, a tropical paradise 🌞 in the Indian Ocean, is renowned for its white-sand beaches 🏖️, turquoise waters 💙, and luxurious resorts 🏡. It’s the perfect getaway for those seeking tranquility, with activities like snorkeling 🤿, diving 🐡, and private island escapes 🏝️.",
        culturetheme: "🎶 The Vibrant Island Culture of the Maldives 🏝️",
        culture1: "Maldives’ culture is a mix of South Asian, Arab, and African influences 🌏, shaped by its maritime history ⚓. Maldivians have a deep connection to the sea 🌊, reflected in their music 🎵, dance 💃, and cuisine 🍛. Boduberu drumming 🥁 and dance are cultural highlights.",
        culture2: "Islam 🕌 shapes daily life and festivals 🎉, while traditional crafts like lacquered woodwork 🎨 and mat weaving showcase Maldivian artistry. Despite modernization, locals take pride in preserving their rich heritage and warm hospitality 🤗.",
        fact1: "🌍 It’s the World’s Flattest Country",
        factdesc1: "The Maldives holds the record for being the lowest-lying country on Earth, with an average ground level of only 1.5 meters (4 ft 11 in) above sea level! 🏝️",
        fact2: "🏝️ It Has Over 1,000 Islands!",
        factdesc2: "The Maldives is made up of 1,192 coral islands 🪸, grouped into 26 atolls 🌊, but only around 200 are inhabited! 🏡",
        fact3: "✨🌊 It’s One of the Best Places for Bioluminescent Beaches",
        factdesc3: "Some Maldivian beaches glow at night ✨ due to bioluminescent plankton, creating a magical \"sea of stars\" effect—especially on Vaadhoo Island! 🌌🌊"
    },
]

// Load destination details
function loadDestinationDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const destinationName = urlParams.get("destinations");

    const destination = destinations.find(d => d.title.toLowerCase().includes(destinationName.toLowerCase()));

    if (destination) {
        document.getElementById("destination-title").innerText = destination.title;
        document.getElementById("destination-image2").src = destination.image2;
        document.getElementById("destination-image3").src = destination.image3;
        document.getElementById("destination-image4").src = destination.image4;
        document.getElementById("destination-theme1").innerText = destination.theme1;
        document.getElementById("destination-theme2").innerText = destination.theme2;
        document.getElementById("destination-theme3").innerText = destination.theme3;
        document.getElementById("destination-description1").innerText = destination.description1;
        document.getElementById("destination-description2").innerText = destination.description2;
        document.getElementById("destination-description3").innerText = destination.description3;
        document.getElementById("destination-culturetheme").innerText = destination.culturetheme;
        document.getElementById("destination-culture1").innerText = destination.culture1;
        document.getElementById("destination-culture2").innerText = destination.culture2;
        document.getElementById("destination-image1").src = destination.image1;
        document.getElementById("destination-fact1").innerText = destination.fact1;
        document.getElementById("destination-factdesc1").innerText = destination.factdesc1;
        document.getElementById("destination-fact2").innerText = destination.fact2;
        document.getElementById("destination-factdesc2").innerText = destination.factdesc2;
        document.getElementById("destination-fact3").innerText = destination.fact3;
        document.getElementById("destination-factdesc3").innerText = destination.factdesc3;
        document.getElementById("destination-image5").src = destination.image5;

    } else {
        document.body.innerHTML = "<h1>Destination not found.</h1>";
    }
}

//Set Up event listener
document.addEventListener("DOMContentLoaded", loadDestinationDetails);

