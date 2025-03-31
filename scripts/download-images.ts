import { createWriteStream } from 'fs';
import { resolve } from 'path';
import * as https from 'https';

const imageUrls = {
  // Pizza images
  'pizza.jpg': 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
  'pepperoni.jpg': 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee',
  'veg-pizza.jpg': 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6',
  
  // Pasta images
  'pasta.jpg': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
  'alfredo.jpg': 'https://images.unsplash.com/photo-1692635690920-73c3d9e6ff7f',
  'arrabbiata.jpg': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
  
  // Salad images
  'salad.jpg': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  'med-salad.jpg': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
  'quinoa.jpg': 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
  
  // Dessert images
  'tiramisu.jpg': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
  'lava-cake.jpg': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
  'panna-cotta.jpg': 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
  
  // Hero image
  'hero-bg.jpg': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
};

async function downloadImage(filename: string, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const filepath = `public/images/${filename}`;
    const fileStream = createWriteStream(filepath);

    https.get(`${url}?w=800&q=80`, (response) => {
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}:`, err);
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Starting image downloads...');
  
  try {
    await Promise.all(
      Object.entries(imageUrls).map(([filename, url]) => 
        downloadImage(filename, url)
      )
    );
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
    process.exit(1);
  }
}

downloadAllImages(); 