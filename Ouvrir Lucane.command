#!/bin/zsh
cd -- "$(dirname -- "$0")"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if [ ! -d node_modules ]; then npm ci || exit 1; fi
npm run build || exit 1
printf '\nOuvrir http://127.0.0.1:4318/lucane/ dans votre navigateur.\nGarder cette fenêtre ouverte pendant la présentation.\n\n'
npm run dev
