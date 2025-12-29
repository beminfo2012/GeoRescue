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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY // Need service key for bulk insert

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.error('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedDatabase() {
    console.log('🌱 Starting database seed...')

    const jsonPath = path.join(__dirname, '..', 'installations.json')

    if (!fs.existsSync(jsonPath)) {
        console.error('❌ installations.json not found. Run "npm run process-csv" first.')
        process.exit(1)
    }

    // Read JSON file
    const installations = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    console.log(`📊 Found ${installations.length} installations to insert`)

    // Insert in batches of 1000
    const batchSize = 1000
    let inserted = 0
    let errors = 0

    for (let i = 0; i < installations.length; i += batchSize) {
        const batch = installations.slice(i, i + batchSize)

        try {
            const { data, error } = await supabase
                .from('electrical_installations')
                .upsert(batch, { onConflict: 'installation_number' })

            if (error) {
                console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message)
                errors += batch.length
            } else {
                inserted += batch.length
                console.log(`✅ Inserted batch ${i / batchSize + 1}/${Math.ceil(installations.length / batchSize)} (${inserted} total)`)
            }
        } catch (err) {
            console.error(`❌ Exception inserting batch:`, err)
            errors += batch.length
        }
    }

    console.log(`\n📈 Summary:`)
    console.log(`   ✅ Successfully inserted: ${inserted}`)
    console.log(`   ❌ Errors: ${errors}`)
    console.log(`\n🎉 Database seeding complete!`)
}

seedDatabase().catch(console.error)
