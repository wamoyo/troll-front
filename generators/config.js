// Generates client-side config based on build environment

var isProd = Deno.env.get('PRODUCTION') === 'true'

var backend = isProd ? 'https://backend.trollhair.com' : 'https://dev.trollhair.com'

// Pure: returns JavaScript config module for client-side imports
export default function config () {
  return {
    filename: 'config.js',
    content: `export var BACKEND = '${backend}'`
  }
}
