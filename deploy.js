// Deploy frontend to S3 + CloudFront
// Usage: deno task deploy test|prod [-y|--yes] [--media]

var environments = {
  test: {
    bucket: 'test.trollhair.com',
    distributionId: 'E1AAWB5YT2L06L',
    buildTask: 'build',
    url: 'https://test.trollhair.com'
  },
  prod: {
    bucket: 'trollhair.com',
    distributionId: 'E30W92P5BYVD4T',
    buildTask: 'build:prod',
    url: 'https://trollhair.com'
  }
}

// Parse arguments
var args = Deno.args
var env = args[0]
var skipConfirm = args.includes('-y') || args.includes('--yes')
var mediaOnly = args.includes('--media')

// Validate environment
if (!env || !environments[env]) {
  console.error('\nUsage: deno task deploy test|prod [-y|--yes] [--media]\n')
  console.error('  test    Deploy to test.trollhair.com')
  console.error('  prod    Deploy to trollhair.com (requires confirmation)')
  console.error('  -y      Skip confirmation prompt')
  console.error('  --media Only sync videos/ and audios/ (no build, no cache invalidation)\n')
  Deno.exit(1)
}

var config = environments[env]

// Confirm production deployment
if (env === 'prod' && !skipConfirm) {
  console.log('\n⚠️  You are about to deploy to PRODUCTION (trollhair.com)\n')
  var answer = prompt('Type "yes" to confirm:')
  if (answer !== 'yes') {
    console.log('\nDeployment cancelled.\n')
    Deno.exit(0)
  }
  console.log('')
}

// Pure: run a shell command and return success/failure
async function run (cmd, args, description) {
  console.log(`\n→ ${description}`)
  console.log(`  ${cmd} ${args.join(' ')}\n`)

  var command = new Deno.Command(cmd, {
    args: args,
    stdout: 'inherit',
    stderr: 'inherit'
  })

  var result = await command.output()

  if (!result.success) {
    console.error(`\n✗ Failed: ${description}`)
    return false
  }

  return true
}

// Main deployment flow
async function deploy () {
  var mode = mediaOnly ? 'MEDIA' : 'SITE'
  console.log(`\n========================================`)
  console.log(`  Deploying ${mode} to ${env.toUpperCase()}`)
  console.log(`  ${config.url}`)
  console.log(`========================================`)

  if (mediaOnly) {
    // Media-only deployment: sync videos/ and audios/ only
    var videosSuccess = await run('aws', [
      's3', 'sync',
      'site/videos/',
      `s3://${config.bucket}/videos/`
    ], `Syncing videos/ to S3`)

    var audiosSuccess = await run('aws', [
      's3', 'sync',
      'site/audios/',
      `s3://${config.bucket}/audios/`
    ], `Syncing audios/ to S3`)

    if (!videosSuccess || !audiosSuccess) {
      Deno.exit(1)
    }

    console.log(`\n========================================`)
    console.log(`  ✓ Media deployed to ${config.url}`)
    console.log(`  (No cache invalidation - media files are immutable)`)
    console.log(`========================================\n`)
  } else {
    // Full site deployment

    // Step 1: Build
    var buildSuccess = await run('deno', ['task', config.buildTask, '--clean', '-y'], `Building (${config.buildTask})`)
    if (!buildSuccess) {
      Deno.exit(1)
    }

    // Step 2: Sync to S3 (excluding videos and audios)
    var syncSuccess = await run('aws', [
      's3', 'sync',
      'site/',
      `s3://${config.bucket}`,
      '--delete',
      '--exclude', 'videos/*',
      '--exclude', 'audios/*'
    ], `Syncing to S3 (${config.bucket})`)
    if (!syncSuccess) {
      Deno.exit(1)
    }

    // Step 3: Invalidate CloudFront cache
    var invalidateSuccess = await run('aws', [
      'cloudfront', 'create-invalidation',
      '--distribution-id', config.distributionId,
      '--paths', '/*'
    ], 'Invalidating CloudFront cache')
    if (!invalidateSuccess) {
      Deno.exit(1)
    }

    console.log(`\n========================================`)
    console.log(`  ✓ Deployed to ${config.url}`)
    console.log(`========================================\n`)
  }
}

deploy()
