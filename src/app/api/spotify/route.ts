
import axios from 'axios';

// In-memory cache for Spotify data
let spotifyCache: {
  data: any;
  timestamp: number;
  expiresAt: number;
} | null = null;

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    // Check cache first
    if (spotifyCache && Date.now() < spotifyCache.expiresAt) {
      return new Response(JSON.stringify(spotifyCache.data), {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=600', // 10 minutes
          'X-Cache': 'HIT',
        },
      });
    }

    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return new Response(JSON.stringify({ error: "Missing Spotify credentials" }), { status: 500 });
    }

    const auth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

    // Get access token with timeout
    const tokenResp = await Promise.race([
      axios.post(
        'https://accounts.spotify.com/api/token',
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: 5000, // 5 second timeout
        }
      ),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Token request timeout')), 5000)
      )
    ]) as any;

    const accessToken = tokenResp.data.access_token;
    const artistId = "1m1LEnibEhbcsnn6f0jsrT";

    // Fetch top tracks with timeout
    const tracksResp = await Promise.race([
      axios.get(
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IN`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 8000, // 8 second timeout
        }
      ),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Tracks request timeout')), 8000)
      )
    ]) as any;

    // Return only first 6 tracks with necessary data
    const trimmedTracks = tracksResp.data.tracks.slice(0, 4).map((track: any) => ({
      id: track.id,
      name: track.name,
      album: {
        name: track.album.name,
        images: track.album.images,
      },
      artists: track.artists.map((artist: any) => ({
        name: artist.name,
        id: artist.id,
      })),
      external_urls: track.external_urls,
    }));

    const responseData = { tracks: trimmedTracks };

    // Update cache
    spotifyCache = {
      data: responseData,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=600', // 10 minutes
        'X-Cache': 'MISS',
      },
    });

  } catch (err: any) {
    console.error("Spotify fetch error:", err.response?.data || err.message);
    
    // Return cached data if available and request failed
    if (spotifyCache && spotifyCache.data) {
      return new Response(JSON.stringify(spotifyCache.data), {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=300', // 5 minutes for stale data
          'X-Cache': 'STALE',
          'Warning': '199 - "Returning stale data due to API failure"',
        },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to fetch tracks" }), { status: 500 });
  }
}
