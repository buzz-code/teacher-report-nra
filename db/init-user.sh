#!/bin/bash
set -e

echo "Creating database user from environment variables..."

# Ensure required environment variables are set
if [ -z "$MYSQL_USER" ] || [ -z "$MYSQL_PASSWORD" ] || [ -z "$MYSQL_DATABASE" ]; then
    echo "Error: MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE environment variables must be set"
    exit 1
fi

# Connect to MySQL and create user with full privileges
mysql -u root -p"$MYSQL_ROOT_PASSWORD" <<-EOSQL
    -- Create user that can connect from any host (%)
    CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
    
    -- Grant ALL PRIVILEGES on the specific database
    GRANT ALL PRIVILEGES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
    
    -- Also grant some additional useful privileges for application development
    GRANT CREATE, DROP, ALTER, INDEX, REFERENCES ON \`${MYSQL_DATABASE}\`.* TO '${MYSQL_USER}'@'%';
    
    -- Apply the privilege changes
    FLUSH PRIVILEGES;
    
    -- Verify user creation
    SELECT User, Host FROM mysql.user WHERE User = '${MYSQL_USER}';
    
    -- Show granted privileges
    SHOW GRANTS FOR '${MYSQL_USER}'@'%';
EOSQL

echo "Database user '${MYSQL_USER}' created successfully with access from any host and full privileges on '${MYSQL_DATABASE}'"