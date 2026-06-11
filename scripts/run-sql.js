#!/usr/bin/env node
// Executa um arquivo SQL no banco da Primeira Escola via Supabase Management API
// Uso: SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/run-sql.js supabase/migrations/001_initial_schema.sql

const fs   = require('fs')
const path = require('path')

const token = process.env.SUPABASE_ACCESS_TOKEN
const file  = process.argv[2]
const ref   = 'bvaiuvtlrhdrcxmtsmpq'

if (!token) { console.error('SUPABASE_ACCESS_TOKEN não definido'); process.exit(1) }
if (!file)  { console.error('Uso: node scripts/run-sql.js <arquivo.sql>'); process.exit(1) }

const sql = fs.readFileSync(path.resolve(file), 'utf8')

fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method:  'POST',
  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
  body:    JSON.stringify({ query: sql }),
})
  .then(async res => {
    const body = await res.json()
    if (!res.ok) { console.error('Erro:', JSON.stringify(body, null, 2)); process.exit(1) }
    console.log(`✓ ${file} executado com sucesso`)
    if (Array.isArray(body) && body.length) console.log(JSON.stringify(body, null, 2))
  })
  .catch(err => { console.error('Falha:', err.message); process.exit(1) })
