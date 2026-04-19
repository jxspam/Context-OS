# Context-OS meetup setup (Windows PowerShell)
# Idempotent: checks each dependency and skips if already installed.

$ErrorActionPreference = "Stop"

function Write-Ok   ($msg) { Write-Host "  " -NoNewline; Write-Host "✓ " -ForegroundColor Green -NoNewline; Write-Host $msg }
function Write-Info ($msg) { Write-Host "  " -NoNewline; Write-Host "→ " -ForegroundColor Cyan  -NoNewline; Write-Host $msg }
function Write-Warn2($msg) { Write-Host "  " -NoNewline; Write-Host "! " -ForegroundColor Yellow -NoNewline; Write-Host $msg }
function Write-Skip ($msg) { Write-Host "  " -NoNewline; Write-Host "· " -ForegroundColor DarkGray -NoNewline; Write-Host "$msg (already installed)" -ForegroundColor DarkGray }

function Test-Command ($name) {
    $null = Get-Command $name -ErrorAction SilentlyContinue
    return $?
}

function Require-Winget {
    if (-not (Test-Command winget)) {
        Write-Warn2 "winget not found. Install 'App Installer' from the Microsoft Store, then re-run this script."
        exit 1
    }
}

function Install-Node {
    if (Test-Command node) {
        $v = (node -v) -replace 'v', ''
        $major = [int]($v.Split('.')[0])
        if ($major -ge 20) { Write-Skip "node v$v"; return }
        Write-Warn2 "node v$v is older than v20; upgrading"
    }
    Write-Info "installing Node.js 20 (LTS)"
    winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
    $env:Path = [Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [Environment]::GetEnvironmentVariable("Path","User")
}

function Install-Pnpm {
    if (Test-Command pnpm) { Write-Skip "pnpm $(pnpm -v)"; return }
    Write-Info "installing pnpm"
    corepack enable
    corepack prepare pnpm@latest --activate
}

function Install-Gh {
    if (Test-Command gh) { Write-Skip "gh $((gh --version)[0])"; return }
    Write-Info "installing GitHub CLI"
    winget install --id GitHub.cli -e --accept-package-agreements --accept-source-agreements
}

function Install-Claude {
    if (Test-Command claude) { Write-Skip "claude"; return }
    Write-Info "installing Claude Code"
    npm install -g "@anthropic-ai/claude-code"
}

function Install-Ralph {
    $ralphDir = "scripts\ralph"
    if (Test-Path "$ralphDir\.git") { Write-Skip "ralph (in $ralphDir)"; return }
    Write-Info "cloning Ralph into $ralphDir"
    New-Item -ItemType Directory -Force -Path "scripts" | Out-Null
    git clone https://github.com/snarktank/ralph.git $ralphDir
}

function Install-Jq {
    if (Test-Command jq) { Write-Skip "jq $(jq --version)"; return }
    Write-Info "installing jq"
    winget install --id jqlang.jq -e --accept-package-agreements --accept-source-agreements
}

function Install-Supabase {
    if (Test-Command supabase) { Write-Skip "supabase $(supabase --version)"; return }
    Write-Info "installing Supabase CLI"
    if (Test-Command scoop) {
        scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
        scoop install supabase
    } else {
        Write-Warn2 "scoop not found — installing scoop first"
        Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
        scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
        scoop install supabase
    }
}

function Install-Vercel {
    if (Test-Command vercel) { Write-Skip "vercel $(vercel --version)"; return }
    Write-Info "installing Vercel CLI"
    npm install -g vercel
}

function Prompt-Env {
    $envFile = "web\.env.local"
    if (Test-Path $envFile) { Write-Skip ".env.local already exists at $envFile"; return }
    New-Item -ItemType Directory -Force -Path "web" | Out-Null
    Write-Host ""
    Write-Host "Supabase credentials " -ForegroundColor White -NoNewline
    Write-Host "(from https://supabase.com/dashboard → Project Settings → API)"
    $url  = Read-Host "  Project URL"
    $anon = Read-Host "  anon key"
    @(
        "NEXT_PUBLIC_SUPABASE_URL=$url"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY=$anon"
    ) | Set-Content -Path $envFile -Encoding UTF8
    Write-Ok "wrote $envFile"
}

Write-Host ""
Write-Host "Context-OS setup " -ForegroundColor White -NoNewline
Write-Host "(windows)"
Write-Host ""

Require-Winget
Install-Node
Install-Pnpm
Install-Gh
Install-Claude
Install-Jq
Install-Ralph
Install-Supabase
Install-Vercel
Prompt-Env

Write-Host ""
Write-Host "✓ setup complete" -ForegroundColor Green
Write-Host "Next: " -NoNewline; Write-Host "cd web; pnpm install; pnpm dev" -ForegroundColor White
Write-Host "To log into Vercel later: " -NoNewline; Write-Host "vercel login" -ForegroundColor White
Write-Host ""
