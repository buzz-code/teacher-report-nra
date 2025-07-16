FROM mysql:9.3

COPY data.sql /docker-entrypoint-initdb.d/
COPY init-user.sh /docker-entrypoint-initdb.d/