import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
} else {
    console.error('❌ .env.local file not found!')
    process.exit(1)
}

const serviceKey = process.env.SUPABASE_SERVICE_KEY

if (!serviceKey) {
    console.error('❌ SUPABASE_SERVICE_KEY is missing in .env.local')
    process.exit(1)
}

if (serviceKey === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.error('❌ You have not replaced the placeholder YOUR_SERVICE_ROLE_KEY_HERE in .env.local')
    process.exit(1)
}

try {
    // Basic JWT decoding without external cleanup library
    const [, output] = serviceKey.split('.')
    if (!output) {
        throw new Error('Invalid JWT format')
    }

    const decoded = JSON.parse(Buffer.from(output, 'base64').toString())

    if (decoded.role !== 'service_role') {
        console.error('❌ Invalid Token Role!')
        console.error(`   Expected role: 'service_role'`)
        console.error(`   Found role: '${decoded.role}'`)
        console.error('\n⚠️  It looks like you used the ANON KEY instead of the SERVICE ROLE KEY.')
        console.error('   Please go to Supabase Dashboard > Settings > API and copy the "service_role" secret.')
        process.exit(1)
    }

    console.log('✅ SUPABASE_SERVICE_KEY looks valid (role: service_role)')

} catch (e) {
    console.error('❌ Could not decode SUPABASE_SERVICE_KEY. Is it a valid JWT?')
    console.error(e)
    process.exit(1)
}
