#!/usr/bin/env bash
# Деплой Aillix на Ubuntu VM.
# Использование: ./deploy/deploy.sh [путь_к_приложению]
set -euo pipefail

APP_DIR="${1:-/opt/aillix/ai-studio}"
REPO_DIR="$(git -C "$APP_DIR" rev-parse --show-toplevel)"

echo "→ Обновление кода"
cd "$REPO_DIR"
git pull --ff-only

echo "→ Сборка образов"
cd "$APP_DIR"
docker compose -p aillix build

echo "→ Запуск контейнеров"
docker compose -p aillix up -d --remove-orphans

echo "→ Ожидание health-check Nginx"
for attempt in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:8080/healthz > /dev/null; then
    echo "✓ Сервис отвечает (попытка $attempt)"
    break
  fi
  if [ "$attempt" -eq 30 ]; then
    echo "✗ Сервис не поднялся за 60 секунд"
    docker compose -p aillix logs --tail=100
    exit 1
  fi
  sleep 2
done

echo "→ Очистка неиспользуемых образов"
docker image prune -f

echo "✓ Деплой завершён"
