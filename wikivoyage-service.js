// Wikivoyage API endpoint
const WIKIVOYAGE_API = 'https://en.wikivoyage.org/w/api.php';

/**
 * Fetch destination content from Wikivoyage
 * @param {string} destinationName - Name of the destination to search
 * @returns {Promise<Object>} Destination data including description, highlights, and images
 */
async function fetchWikivoyageContent(destinationName) {
    try {
        console.log('🌍 Fetching Wikivoyage content for:', destinationName);

        // First, get the exact page title through search
        console.log('🔍 Searching for exact page title...');
        const searchResult = await searchWikivoyage(destinationName);
        if (!searchResult) {
            console.warn('⚠️ No Wikivoyage page found for', destinationName);
            return null;
        }
        console.log('✅ Found page:', searchResult.title);

        // Fetch the full content using the exact title
        console.log('📚 Fetching full content...');
        const content = await getFullContent(searchResult.title);
        if (!content) {
            console.warn('⚠️ No content found for', searchResult.title);
            return null;
        }
        console.log('✅ Content fetched successfully');

        // Get images for the destination
        console.log('🖼️ Fetching images...');
        const images = await getDestinationImages(searchResult.title);
        console.log(`✅ Found ${images.length} images`);

        // Format the content
        const formattedContent = formatWikivoyageContent(content);

        return {
            title: searchResult.title,
            description: formattedContent.description,
            highlights: formattedContent.highlights,
            images: images,
            wikiUrl: `https://en.wikivoyage.org/wiki/${encodeURIComponent(searchResult.title)}`,
            lastUpdated: new Date().toISOString()
        };
    } catch (error) {
        console.error('❌ Error fetching Wikivoyage content:', error);
        return null;
    }
}

/**
 * Search for a destination on Wikivoyage
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search result with title
 */
async function searchWikivoyage(query) {
    try {
        const params = new URLSearchParams({
            action: 'query',
            list: 'search',
            srsearch: query,
            format: 'json',
            origin: '*',
            srlimit: 1,
            srnamespace: 0 // Main namespace only
        });

        const url = `${WIKIVOYAGE_API}?${params}`;
        console.log('🔍 Searching Wikivoyage API:', url);

        const response = await fetch(url);
        if (!response.ok) {
            console.error('❌ HTTP error:', response.status, response.statusText);
            console.log('Response headers:', Object.fromEntries([...response.headers]));
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Search response:', data);
        return data.query?.search?.[0] || null;
    } catch (error) {
        console.error('❌ Error searching Wikivoyage:', error);
        return null;
    }
}

/**
 * Get full content for a destination
 * @param {string} title - Exact page title
 * @returns {Promise<string>} HTML content
 */
async function getFullContent(title) {
    try {
        const params = new URLSearchParams({
            action: 'query',
            titles: title,
            prop: 'extracts',
            exintro: '1', // Get only the introduction section
            explaintext: '1', // Get plain text
            format: 'json',
            origin: '*'
        });

        const url = `${WIKIVOYAGE_API}?${params}`;
        console.log('📚 Fetching content from:', url);

        const response = await fetch(url);
        if (!response.ok) {
            console.error('❌ HTTP error:', response.status, response.statusText);
            console.log('Response headers:', Object.fromEntries([...response.headers]));
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Content response:', data);
        const pages = data.query?.pages || {};
        const pageId = Object.keys(pages)[0];
        
        return pages[pageId]?.extract || '';
    } catch (error) {
        console.error('❌ Error fetching content:', error);
        return '';
    }
}

/**
 * Get images for a destination
 * @param {string} title - Page title
 * @returns {Promise<string[]>} Array of image URLs
 */
async function getDestinationImages(title) {
    try {
        // Try to get from cache first
        const cacheKey = `destination_images_${title}`;
        const cachedImages = localStorage.getItem(cacheKey);
        if (cachedImages) {
            const {images, timestamp} = JSON.parse(cachedImages);
            // Check if cache is less than 24 hours old
            if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                return images;
            }
        }

        // First, get list of images with enhanced params
        const params = new URLSearchParams({
            action: 'query',
            titles: title,
            prop: 'images|pageimages|imageinfo',
            piprop: 'original',
            imlimit: '30', // Increased limit for better selection
            iiurlwidth: '1200', // Request specific image width
            iiurlheight: '800', // Request specific image height
            iiprop: 'url|size|mime',
            format: 'json',
            origin: '*'
        });

        const response = await fetch(`${WIKIVOYAGE_API}?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const pages = data.query?.pages || {};
        const pageId = Object.keys(pages)[0];
        const images = pages[pageId]?.images || [];
        const pageImage = pages[pageId]?.original?.source;

        // Enhanced image filtering and quality checks
        const imageUrls = await Promise.all(
            images
                .filter(img => {
                    const title = img.title.toLowerCase();
                    // Enhanced filtering criteria
                    return !title.includes('icon') && 
                           !title.includes('logo') && 
                           !title.includes('marker') &&
                           !title.includes('map') &&
                           !title.includes('flag') &&
                           !title.includes('symbol') &&
                           !title.includes('banner') &&
                           !title.includes('shield') &&
                           !title.includes('button') &&
                           !title.endsWith('.svg') &&
                           !title.endsWith('.gif') &&
                           !title.includes('diagram') &&
                           !title.includes('icon');
                })
                .map(img => getImageUrl(img.title))
        );

        // Enhanced image quality validation
        const validUrls = (await Promise.all(
            imageUrls
                .filter(url => url != null)
                .map(async url => {
                    try {
                        const response = await fetch(url, { method: 'HEAD' });
                        const contentLength = response.headers.get('content-length');
                        const contentType = response.headers.get('content-type');
                        
                        // Enhanced quality checks
                        const isValidSize = contentLength && parseInt(contentLength) > 100000; // > 100KB
                        const isValidType = contentType && contentType.startsWith('image/') && 
                                         !contentType.includes('gif');
                        
                        return (isValidSize && isValidType) ? url : null;
                    } catch {
                        return null;
                    }
                })
        )).filter(url => url != null);

        // Prioritize images with destination name
        const prioritizedUrls = validUrls.sort((a, b) => {
            const aHasDestName = a.toLowerCase().includes(title.toLowerCase());
            const bHasDestName = b.toLowerCase().includes(title.toLowerCase());
            return bHasDestName - aHasDestName;
        });

        // If we have a page image, ensure it's in the top results
        if (pageImage && !prioritizedUrls.includes(pageImage)) {
            prioritizedUrls.unshift(pageImage);
        }

        // Fallback to high-quality Unsplash images with specific parameters
        if (prioritizedUrls.length === 0) {
            const unsplashUrl = `https://source.unsplash.com/featured/1200x800/?${encodeURIComponent(title + ' travel landmark')}`;
            prioritizedUrls.push(unsplashUrl);
        }

        // Cache the results
        localStorage.setItem(cacheKey, JSON.stringify({
            images: prioritizedUrls,
            timestamp: Date.now()
        }));

        return prioritizedUrls;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [`https://source.unsplash.com/featured/1200x800/?${encodeURIComponent(title + ' travel landmark')}`];
    }
}

/**
 * Get actual URL for an image
 * @param {string} title - Image title
 * @returns {Promise<string>} Image URL
 */
async function getImageUrl(title) {
    try {
        const params = new URLSearchParams({
            action: 'query',
            titles: title,
            prop: 'imageinfo',
            iiprop: 'url|size|mime',
            iiurlwidth: '1200',
            iiurlheight: '800',
            format: 'json',
            origin: '*'
        });

        const response = await fetch(`${WIKIVOYAGE_API}?${params}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        const pages = data.query?.pages || {};
        const pageId = Object.keys(pages)[0];
        const imageInfo = pages[pageId]?.imageinfo?.[0];
        
        // Additional quality checks
        if (imageInfo) {
            const { width, height, mime } = imageInfo;
            if (width < 800 || height < 600 || mime.includes('gif')) {
                return null;
            }
            return imageInfo.url;
        }
        return null;
    } catch (error) {
        console.error('Error fetching image URL:', error);
        return null;
    }
}

/**
 * Format Wikivoyage content into structured data
 * @param {string} content - Raw text content from Wikivoyage
 * @returns {Object} Formatted content with description and highlights
 */
function formatWikivoyageContent(content) {
    try {
        // Split content into paragraphs
        const paragraphs = content.split('\n\n').filter(p => p.trim());

        // First paragraph is the description
        const description = paragraphs[0] || '';

        // Remaining paragraphs are potential highlights
        const highlights = paragraphs.slice(1)
            .filter(p => {
                const text = p.toLowerCase();
                return !text.includes('wikivoyage') && 
                       !text.includes('wikipedia') &&
                       !text.includes('category:') &&
                       p.length > 50; // Only meaningful paragraphs
            })
            .map(cleanText)
            .slice(0, 5); // Limit to 5 highlights

        return {
            description: cleanText(description),
            highlights
        };
    } catch (error) {
        console.error('Error formatting content:', error);
        return {
            description: '',
            highlights: []
        };
    }
}

/**
 * Clean text content
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
function cleanText(text) {
    return text
        .replace(/\[\d+\]/g, '') // Remove reference numbers
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\(.*?\)/g, '') // Remove parenthetical content
        .trim();
}

/**
 * Update destination in Firestore with Wikivoyage content
 * @param {string} destinationId - Firestore destination ID
 * @param {string} destinationName - Name of the destination
 * @returns {Promise<void>}
 */
async function updateDestinationWithWikivoyage(destinationId, destinationName) {
    try {
        const wikivoyageContent = await fetchWikivoyageContent(destinationName);
        
        // Get Firestore instance
        const db = getFirestore();
        
        // Update the destination document
        await updateDoc(doc(db, 'destinations', destinationId), {
            wikivoyageContent: wikivoyageContent,
            lastUpdated: serverTimestamp()
        });

        console.log(`Updated ${destinationName} with Wikivoyage content`);
    } catch (error) {
        console.error('Error updating Wikivoyage content:', error);
    }
}

export { fetchWikivoyageContent }; 