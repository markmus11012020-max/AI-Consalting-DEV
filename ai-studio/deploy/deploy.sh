#!/usr/bin/env bash
# Деплой AI.STUDIO на Ubuntu VM в Yandex Cloud.
# Использование: ./deploy/deploy.sh [путь_к_проекту]
set -euo pipefail

PROJECT_DIR="${1:-/opt/ai-studio}"
cd "$PROJECT_DIR"

echo "→ Обновление кода"
git pull --ff-only

echo "→ Сборка образа"
docker compose build

echo "→ Запуск контейнеров"
docker compose up -d

echo "→ Ожидание health-check"
for attempt in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:3000/api/health > /dev/null; then
    echo "✓ Сервис отвечает (попытка $attempt)"
    break
  fi
  if [ "$attempt" -eq 30 ]; then
    echo "✗ Сервис не поднялся за 60 секунд"
    docker compose logs --tail=100
    exit 1
  fi
  sleep 2
done

echo "→ Очистка неиспользуемых образов"
docker image prune -f

echo "✓ Деплой завершён"
