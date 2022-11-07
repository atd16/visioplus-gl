#!/bin/sh
### Script pour automatiser la reconstruction du back-end symfony après mise à jour.

CT_PATH='/opt/greenlight'
CT_NAME='db'
DB_SCRIPT='/opt/teicee/scripts/dump/all-dumps.sh'


### Exécution depuis le système hôte: lancement du script dans le container
cd "${CT_PATH}"
docker-compose exec -T "${CT_NAME}" "${DB_SCRIPT}"
exit 0
