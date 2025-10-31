// Development server with auto-rebuild on file changes

import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { serveDir } from "https://deno.land/std@0.208.0/http/file_server.ts"

var port = 8700

console.log(`🚀 Dev server running at http://localhost:${port}`)
console.log('📁 Serving from ./site')
console.log('\nPress Ctrl+C to stop\n')

// Simple HTTP server
await serve((req) => {
  return serveDir(req, {
    fsRoot: "./site",
    showDirListing: true,
    enableCors: true
  })
}, { port })
