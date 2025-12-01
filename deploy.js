// Deploy frontend to S3 + CloudFront
// Usage: deno task deploy test|prod [-y|--yes] [--media|--invalidate]

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
var invalidateOnly = args.includes('--invalidate')

// Validate environment
if (!env || !environments[env]) {
  console.error('\nUsage: deno task deploy test|prod [-y|--yes] [--media|--invalidate]\n')
  console.error('  test        Deploy to test.trollhair.com')
  console.error('  prod        Deploy to trollhair.com (requires confirmation)')
  console.error('  -y          Skip confirmation prompt')
  console.error('  --media     Sync videos/ and audios/ only (no build)')
  console.error('  --invalidate  Invalidate cache only (no build, no sync)\n')
  Deno.exit(1)
}

var config = environments[env]

// Confirm production deployment (only for operations that change files)
if (env === 'prod' && !skipConfirm && !invalidateOnly) {
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

// Pure: invalidate CloudFront cache
async function invalidateCache () {
  var success = await run('aws', [
    'cloudfront', 'create-invalidation',
    '--distribution-id', config.distributionId,
    '--paths', '/*'
  ], 'Invalidating CloudFront cache')
  if (!success) {
    Deno.exit(1)
  }
}

// Main deployment flow
async function deploy () {
  var mode = invalidateOnly ? 'INVALIDATE' : (mediaOnly ? 'MEDIA' : 'SITE')
  console.log(`\n========================================`)
  console.log(`  ${mode} → ${env.toUpperCase()}`)
  console.log(`  ${config.url}`)
  console.log(`========================================`)

  if (invalidateOnly) {
    // Invalidate cache only
    await invalidateCache()

    console.log(`\n========================================`)
    console.log(`  ✓ Cache invalidated for ${config.url}`)
    console.log(`========================================\n`)

  } else if (mediaOnly) {
    // Media deployment: sync videos/ and audios/, then invalidate
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

    await invalidateCache()

    console.log(`\n========================================`)
    console.log(`  ✓ Media deployed to ${config.url}`)
    console.log(`========================================\n`)

  } else {
    // Full site deployment: build, sync, invalidate
    var buildSuccess = await run('deno', ['task', config.buildTask, '--clean', '-y'], `Building (${config.buildTask})`)
    if (!buildSuccess) {
      Deno.exit(1)
    }

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

    await invalidateCache()

    console.log(`\n========================================`)
    console.log(`  ✓ Deployed to ${config.url}`)
    console.log(`========================================\n`)
  }
}

deploy()
