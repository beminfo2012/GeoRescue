import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import * as XLSX from 'xlsx'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

function extractUCDigits(fullUC: string): string {
    if (!fullUC) return ''
    // Format: 0.002.217.642.054-14
    // segments: [0, 002, 217, 642, 054-14]
    const parts = fullUC.split('.')
    if (parts.length >= 4) {
        return `${parts[2]}.${parts[3]}`
    }
    return fullUC
}

async function processCSV() {
    console.log('🔄 Processing Excel file...')

    const excelPath = path.join(__dirname, '..', 'UC_PMSMJ-PRO0296618.xlsx')
    const outputPath = path.join(__dirname, '..', 'installations.json')

    if (!fs.existsSync(excelPath)) {
        console.error(`❌ File not found: ${excelPath}`)
        return
    }

    const workbook = XLSX.readFile(excelPath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Rows: [Instalação, Código Unidade Consumidora, Status da UC, NOME_BAIRRO, NOME_LOGRADOURO, LATITUDE, LONGITUDE]
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    const dataLines = rawData.slice(1)

    console.log(`📊 Found ${dataLines.length} records`)

    const installations: ProcessedInstallation[] = []
    let validCount = 0
    let invalidCount = 0

    for (const row of dataLines) {
        // We need at least column 1 (UC) and columns 5, 6 (Coords)
        if (!row || row.length < 7) {
            invalidCount++
            continue
        }

        const fullUC = String(row[1] || '')
        const ucFormatted = extractUCDigits(fullUC)

        const street = String(row[4] || '').trim()
        const district = String(row[3] || '').trim()

        // Coordinates at index 5 and 6
        const lat = parseFloat(String(row[5] || '').replace(',', '.'))
        const lng = parseFloat(String(row[6] || '').replace(',', '.'))

        if (isNaN(lat) || isNaN(lng)) {
            invalidCount++
            continue
        }

        installations.push({
            installation_number: ucFormatted,
            name: street || 'SEM NOME',
            address: district,
            street: street,
            client_lat: null,
            client_lng: null,
            pee_lat: lat,
            pee_lng: lng
        })

        validCount++
    }

    fs.writeFileSync(outputPath, JSON.stringify(installations, null, 2), 'utf-8')
    console.log(`✅ Processed ${validCount} valid units`)
    console.log(`❌ Skipped ${invalidCount} invalid records`)
    console.log(`💾 Saved to ${outputPath}`)
}

processCSV().catch(console.error)
