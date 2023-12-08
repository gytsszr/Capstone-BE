FROM mysql:8.0

# env
ENV MYSQL_DATABASE=be-jobsterific
ENV MYSQL_ROOT_PASSWORD=be-jobsterific

ADD init.sql /docker-entrypoint-initdb.d

VOLUME /var/lib/mysql

EXPOSE 3306

