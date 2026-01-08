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

    // Header 0: Instalação, 1: Código Unidade Consumidora, 2: Status da UC, 3: NOME_BAIRRO, 4: NOME_LOGRADOURO, 5: LATITUDE, 6: LONGITUDE
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
    const dataLines = rawData.slice(1)

    console.log(`📊 Found ${dataLines.length} total records in Excel`)

    const installations: ProcessedInstallation[] = []
    let validCount = 0
    let invalidCount = 0

    for (const row of dataLines) {
        if (!row || row.length < 7) {
            invalidCount++
            continue
        }

        const fullUC = String(row[1] || '')
        const ucFormatted = extractUCDigits(fullUC)

        const street = String(row[4] || '').trim() || 'SEM NOME'
        const district = String(row[3] || '').trim()

        const lat = parseFloat(String(row[5] || '').replace(',', '.'))
        const lng = parseFloat(String(row[6] || '').replace(',', '.'))

        if (isNaN(lat) || isNaN(lng)) {
            invalidCount++
            continue
        }

        installations.push({
            installation_number: ucFormatted,
            name: street,
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
