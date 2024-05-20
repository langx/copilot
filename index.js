addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  return new Response("Hello, World!", {
    headers: { "content-type": "text/plain" },
  });
}
