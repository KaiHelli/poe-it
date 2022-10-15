#!/bin/bash
while IFS= read -r -d '' file
do
  echo "Processing file: $file"
  echo "$(envsubst < "$file")" > "$file"
done < <(find /docker-entrypoint-initdb.d/ -type f -name '*.sql' -print0)