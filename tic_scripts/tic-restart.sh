declare -r DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"

cd ${DIR}

docker-compose down
./scripts/image_build.sh greenlight release-v2
docker-compose up -d
