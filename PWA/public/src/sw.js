import { FetchEventHandlers } from "./Services/FetchEventHandlers/FetchEventHandlers.js";
import { CacheFilePathService } from "./Services/CacheFilePathService.js";
import { ActiveSession } from "./SessionState/ActiveSession.js";
import { Database } from "./Services/Database.js";
var CACHE_STATIC_NAME = "static-v10";
var CACHE_DYNAMIC_NAME = "dynamic-v2";
self.addEventListener("install", function (event) {
    console.log("[Service Worker] Installing Service Worker ...", event);
    console.log(new CacheFilePathService().pathsOfFilesToCache());
    event.waitUntil(caches.open(CACHE_STATIC_NAME)
        .then(function (cache) {
        console.log("[Service Worker] Precaching App Shell");
        cache.addAll([
            "/",
            "/favicon.ico",
            "/manifest.json",
            "/apple-touch-icon.png",
            "/apple-touch-icon-precomposed.png"
        ]
            .concat(new CacheFilePathService().pathsOfFilesToCache()));
    }));
});
self.addEventListener("activate", function (event) {
    console.log("[Service Worker] Activating Service Worker ....", event);
    event.waitUntil(caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
            if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
                console.log("[Service Worker] Removing old cache.", key);
                return caches.delete(key);
            }
        }));
    }));
    return self.clients.claim();
});
// Cache-only
self.addEventListener("fetch", function (event) {
    let customHandlers = new FetchEventHandlers(new ActiveSession(new Database(indexedDB)));
    console.log("Handling fetch request " + event.request.url);
    if (customHandlers.canHandleEvent(event)) {
        console.log("using custom event handler");
        event.respondWith(customHandlers.handleEvent(event));
    }
    else {
        console.log("using custom cache");
        event.respondWith(caches.match(event.request));
    }
});
