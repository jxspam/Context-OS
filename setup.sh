#!/usr/bin/env bash
# Context-OS meetup setup (macOS / Linux)
# Idempotent: checks each dependency and skips if already installed.

set -euo pipefail

ok()   { printf '  \033[32m✓\033[0m %s\n' "$1"; }
info() { printf '  \033[36m→\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m!\033[0m %s\n' "$1"; }
skip() { printf '  \033[90m·\033[0m %s (already installed)\n' "$1"; }

have() { command -v "$1" >/dev/null 2>&1; }

detect_os() {
  case "$(uname -s)" in
    Darwin) echo "macos" ;;
    Linux)  echo "linux" ;;
    *)      echo "unknown" ;;
  esac
}

ensure_brew() {
  if have brew; then skip "homebrew"; return; fi
  info "installing homebrew"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  eval "$(/opt/homebrew/bin/brew shellenv 2>/dev/null || /usr/local/bin/brew shellenv)"
}

install_node() {
  if have node; then
    local major
    major="$(node -v | sed 's/v\([0-9]*\).*/\1/')"
    if [ "$major" -ge 20 ]; then skip "node $(node -v)"; return; fi
    warn "node $(node -v) is older than v20; upgrading"
  fi
  info "installing node 20"
  if [ "$OS" = "macos" ]; then
    brew install node@20
    brew link --overwrite --force node@20 || true
  else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
  fi
}

install_pnpm() {
  if have pnpm; then skip "pnpm $(pnpm -v)"; return; fi
  info "installing pnpm"
  corepack enable
  corepack prepare pnpm@latest --activate
}

install_gh() {
  if have gh; then skip "gh $(gh --version | head -1)"; return; fi
  info "installing GitHub CLI"
  if [ "$OS" = "macos" ]; then
    brew install gh
  else
    (type -p wget >/dev/null || sudo apt-get install -y wget) \
      && sudo mkdir -p -m 755 /etc/apt/keyrings \
      && wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg >/dev/null \
      && sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
      && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list >/dev/null \
      && sudo apt-get update && sudo apt-get install -y gh
  fi
}

install_claude() {
  if have claude; then skip "claude $(claude --version 2>/dev/null | head -1)"; return; fi
  info "installing Claude Code"
  npm install -g @anthropic-ai/claude-code
}

install_ralph() {
  local ralph_dir="scripts/ralph"
  if [ -d "$ralph_dir/.git" ]; then skip "ralph (in $ralph_dir)"; return; fi
  info "cloning Ralph into $ralph_dir"
  mkdir -p scripts
  git clone https://github.com/snarktank/ralph.git "$ralph_dir"
  chmod +x "$ralph_dir"/*.sh 2>/dev/null || true
}

install_supabase() {
  if have supabase; then skip "supabase $(supabase --version)"; return; fi
  info "installing Supabase CLI"
  if [ "$OS" = "macos" ]; then
    brew install supabase/tap/supabase
  else
    curl -fsSL https://github.com/supabase/cli/releases/latest/download/supabase_linux_amd64.tar.gz \
      | sudo tar -xz -C /usr/local/bin supabase
  fi
}

install_vercel() {
  if have vercel; then skip "vercel $(vercel --version)"; return; fi
  info "installing Vercel CLI"
  npm install -g vercel
}

prompt_env() {
  local env_file="web/.env.local"
  if [ -f "$env_file" ]; then
    skip ".env.local already exists at $env_file"
    return
  fi
  mkdir -p web
  printf '\n\033[1mSupabase credentials\033[0m (from https://supabase.com/dashboard → Project Settings → API)\n'
  printf '  Project URL: '
  read -r SUPABASE_URL
  printf '  anon key:    '
  read -r SUPABASE_ANON
  cat > "$env_file" <<EOF
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON}
EOF
  ok "wrote $env_file"
}

main() {
  OS="$(detect_os)"
  if [ "$OS" = "unknown" ]; then
    warn "unsupported OS; this script targets macOS or Linux"
    exit 1
  fi
  printf '\n\033[1mContext-OS setup\033[0m (%s)\n\n' "$OS"

  [ "$OS" = "macos" ] && ensure_brew

  install_node
  install_pnpm
  install_gh
  install_claude
  install_ralph
  install_supabase
  install_vercel
  prompt_env

  printf '\n\033[32m✓ setup complete\033[0m\n'
  printf 'Next: \033[1mcd web && pnpm install && pnpm dev\033[0m\n'
  printf 'To log into Vercel later: \033[1mvercel login\033[0m\n\n'
}

main "$@"
