#!/bin/sh
### Script pour automatiser la reconstruction du back-end symfony après mise à jour.

CT_PATH='/opt/greenlight'
CT_NAME='app'
DB_CMD='bundle exec rake signatures:handle_disconnect'


### Exécution depuis le système hôte: lancement du script dans le container
cd "${CT_PATH}"
docker-compose exec -T ${CT_NAME} ${DB_CMD}
exit 0

