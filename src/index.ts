import { startApi } from "./server";

const apiConfig = { PORT_NUMBER: 3000 }
startApi(apiConfig.PORT_NUMBER)

/*
// const response = await axios.get(url, { maxRedirects: 5 });
//expandedUrl = response.request.res.responseUrl;

const axios = require('axios'); // For Node.js

// Shortened TikTok URL
const shortUrl = "https://vt.tiktok.com/ZSNF3GY1R/";

// Function to resolve the shortened URL and extract the video ID
async function getTikTokVideoId(shortUrl:string) {
  try {
    // Step 1: Resolve the shortened URL
    const response = await axios.get(shortUrl, {
      maxRedirects: 5, // Allow redirects
    });

    // Get the final resolved URL
    const fullUrl = response.request.res.responseUrl; // Axios provides the final URL here
    console.log("Full TikTok URL:", fullUrl);

    // Step 2: Extract the video ID from the full URL
    const match = fullUrl.match(/\/video\/(\d+)/);
    if (match) {
      const videoId = match[1];
      console.log("Video ID:", videoId);
      return videoId;
    } else {
      throw new Error("Video ID not found in the URL.");
    }
  } catch (error) {
    console.error("Error:", (error as any).message);
  }
}

// Call the function
console.log(
getTikTokVideoId(shortUrl)
*/