#!/usr/bin/env bash
# =============================================================================
# create-user.sh — управление пользователями контура Aillix
#
# Использование:
#   ./scripts/create-user.sh registry <login>   # пользователь локального Registry
#   ./scripts/create-user.sh db <login>         # роль PostgreSQL (только чтение)
#   ./scripts/create-user.sh admin <email>      # администратор панели (JWT)
#
# Пароли не передаются аргументами (иначе остаются в history):
# скрипт спрашивает их интерактивно.
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${PROJECT_DIR}"

if [[ ! -f .env ]]; then
  echo "Ошибка: .env не найден. Скопируйте .env.example в .env." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

usage() {
  sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Ошибка: команда '$1' не найдена." >&2
    exit 1
  }
}

read_secret() {
  local prompt="$1" value=""
  read -r -s -p "${prompt}: " value
  echo >&2
  if [[ -z "${value}" ]]; then
    echo "Ошибка: пустой пароль." >&2
    exit 1
  fi
  printf '%s' "${value}"
}

cmd="${1:-}"
login="${2:-}"

case "${cmd}" in
  registry)
    [[ -n "${login}" ]] || usage
    require_cmd docker
    mkdir -p deploy/registry
    touch deploy/registry/htpasswd
    password="$(read_secret "Пароль для registry-пользователя ${login}")"
    docker run --rm -i httpd:2.4-alpine \
      htpasswd -iB deploy/registry/htpasswd "${login}" <<<"${password}"
    chmod 640 deploy/registry/htpasswd
    echo "Готово: пользователь '${login}' добавлен в deploy/registry/htpasswd."
    echo "Проверка: docker compose --profile tools up -d registry"
    echo "Логин с клиента: docker login ${REGISTRY_HOST:-registry.aillix.ru}"
    ;;

  db)
    [[ -n "${login}" ]] || usage
    require_cmd docker
    password="$(read_secret "Пароль для роли ${login}")"
    docker compose exec -T postgres \
      psql -v ON_ERROR_STOP=1 -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" \
      -v role="${login}" -v pwd="${password}" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'role', :'pwd')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = :'role') \gexec
GRANT CONNECT ON DATABASE :"DBNAME" TO :"role";
GRANT USAGE ON SCHEMA public TO :"role";
GRANT SELECT ON ALL TABLES IN SCHEMA public TO :"role";
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO :"role";
SQL
    echo "Готово: роль '${login}' создана с правами только на чтение."
    ;;

  admin)
    [[ -n "${login}" ]] || usage
    require_cmd docker
    password="$(read_secret "Пароль администратора ${login}")"
    docker compose exec -T \
      -e ADMIN_EMAIL="${login}" -e ADMIN_PASSWORD="${password}" \
      backend python -m app.scripts.create_admin
    echo "Готово: администратор '${login}' создан/обновлён."
    ;;

  *)
    usage
    ;;
esac
