import { FetchEventHandlers } from "./Services/FetchEventHandlers/FetchEventHandlers.js";
import { CacheFilePathService } from "./Services/CacheFilePathService.js";
import { ActiveSession } from "./Services/ActiveSession.js";
import { Database } from "./Services/Database.js";

var CACHE_STATIC_NAME = "static-v10";
var CACHE_DYNAMIC_NAME = "dynamic-v2";

const activeSession = new ActiveSession(new Database(indexedDB))

self.addEventListener("install", function (event: any) {
  console.log("ℹ️ Installing Service Worker ...", event);
  console.log(new CacheFilePathService().pathsOfFilesToCache())
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
    .then(async (cache) => {
      console.log("ℹ️ Precaching App Shell..");
      const urlsToCache = [
        "/",
        "/favicon.ico",
        "/manifest.json",
        "/apple-touch-icon.png",
        "/apple-touch-icon-precomposed.png"
      ]
      .concat(new CacheFilePathService().pathsOfFilesToCache())

      for (const url of urlsToCache) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Failed to fetch ${url}: ${response.statusText}`);
            } else {
                await cache.put(url, response);
                console.log(`Cached: ${url}`);
            }
        } catch (error) {
            console.error(`Error fetching ${url}:`, error);
        }
    }
    })
    .then(() => {
      console.log("ℹ️ Serviceworker installed ✅")
    }).catch((error) => {
      console.error("Promise rejected with:", error);
    })
  );
});

self.addEventListener("activate", function (event: any) {
  console.log("ℹ️ Activating Service Worker ....", event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log("ℹ️ Removing old service worker cache.", key);
            return caches.delete(key);
          }
        })
      );
    })
    .catch((error) => {
      console.error("Promise rejected with:", error);
    })
  );
  return (self as any).clients.claim();
});

// Cache-only
self.addEventListener("fetch", function (event: any) {
  let customHandlers = new FetchEventHandlers(activeSession);
  console.info("ℹ️ Handling fetch request " + event.request.url);
  try {
    if (customHandlers.canHandleEvent(event)) {
      console.log("using custom event handler");
      event.respondWith(customHandlers.handleEvent(event))
    } else {
      console.log("using custom cache");
      event.respondWith(caches.match(event.request));
    }
  } catch (error) {
    console.error("Failed with error:")
    console.error(error)
  }  
});