import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface RawCSVRow {
    NOME: string
    INSTALACAO: string
    ENDEREÇO: string
    RUA: string
    CLIENTE_LAT: string
    CLIENTE_LONG: string
    COORDENADA_LAT_PEE: string
    COORDENADA_LONG_PEE: string
}

interface ProcessedInstallation {
    installation_number: string
    name: string
    address: string
    street: string
    client_lat: number | null
    client_lng: number | null
    pee_lat: number
    pee_lng: number
}

function parseCoordinate(coord: string): number | null {
    if (!coord || coord.trim() === '') return null
    // Replace comma with dot for decimal separator
    const normalized = coord.replace(',', '.')
    const parsed = parseFloat(normalized)
    return isNaN(parsed) ? null : parsed
}

async function processCSV() {
    console.log('🔄 Processing CSV file...')

    const csvPath = path.join(__dirname, '..', 'relatorio_edp.csv')
    const outputPath = path.join(__dirname, '..', 'installations.json')

    // Read CSV file
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    const lines = csvContent.split('\n')

    // Skip header
    const dataLines = lines.slice(1).filter(line => line.trim())

    console.log(`📊 Found ${dataLines.length} records`)

    const installations: ProcessedInstallation[] = []
    let validCount = 0
    let invalidCount = 0

    for (const line of dataLines) {
        // Split by semicolon
        const parts = line.split(';')

        if (parts.length < 8) {
            invalidCount++
            continue
        }

        const [name, installation, address, street, clientLat, clientLng, peeLat, peeLng] = parts

        // Parse coordinates
        const peeLatNum = parseCoordinate(peeLat)
        const peeLngNum = parseCoordinate(peeLng)

        // Skip if primary coordinates are missing
        if (peeLatNum === null || peeLngNum === null) {
            invalidCount++
            continue
        }

        installations.push({
            installation_number: installation.trim(),
            name: name.trim(),
            address: address.trim(),
            street: street.trim(),
            client_lat: parseCoordinate(clientLat),
            client_lng: parseCoordinate(clientLng),
            pee_lat: peeLatNum,
            pee_lng: peeLngNum
        })

        validCount++
    }

    // Write to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(installations, null, 2), 'utf-8')

    console.log(`✅ Processed ${validCount} valid installations`)
    console.log(`❌ Skipped ${invalidCount} invalid records`)
    console.log(`💾 Saved to ${outputPath}`)
    console.log(`📦 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`)
}

processCSV().catch(console.error)
