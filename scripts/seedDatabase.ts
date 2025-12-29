import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function clearAndSeedDatabase() {
    console.log('🗑️  Clearing existing data...')

    // First, clear all existing data
    const { error: deleteError } = await supabase
        .from('electrical_installations')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all rows

    if (deleteError) {
        console.error('⚠️  Error clearing data:', deleteError.message)
        console.log('Continuing with seed...')
    } else {
        console.log('✅ Existing data cleared')
    }

    console.log('\n🌱 Starting fresh database seed...')

    const jsonPath = path.join(__dirname, '..', 'installations.json')

    if (!fs.existsSync(jsonPath)) {
        console.error('❌ installations.json not found. Run "npm run process-csv" first.')
        process.exit(1)
    }

    // Read JSON file
    const installations = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    console.log(`📊 Found ${installations.length} installations to insert`)

    // Insert in smaller batches for better reliability
    const batchSize = 500
    let inserted = 0
    let errors = 0

    for (let i = 0; i < installations.length; i += batchSize) {
        const batch = installations.slice(i, i + batchSize)
        const batchNum = Math.floor(i / batchSize) + 1
        const totalBatches = Math.ceil(installations.length / batchSize)

        try {
            const { error } = await supabase
                .from('electrical_installations')
                .insert(batch)

            if (error) {
                console.error(`❌ Error inserting batch ${batchNum}/${totalBatches}:`, error.message)
                errors += batch.length
            } else {
                inserted += batch.length
                console.log(`✅ Inserted batch ${batchNum}/${totalBatches} (${inserted}/${installations.length} total)`)
            }
        } catch (err) {
            console.error(`❌ Exception inserting batch ${batchNum}/${totalBatches}:`, err)
            errors += batch.length
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`\n📈 Summary:`)
    console.log(`   ✅ Successfully inserted: ${inserted}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log(`\n🎉 Database seeding complete!`)

    // Verify count
    console.log('\n🔍 Verifying data...')
    const { count, error: countError } = await supabase
        .from('electrical_installations')
        .select('*', { count: 'exact', head: true })

    if (countError) {
        console.error('❌ Error counting records:', countError.message)
    } else {
        console.log(`✅ Total records in database: ${count}`)
    }
}

clearAndSeedDatabase().catch(console.error)
