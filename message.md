```sh
brew install libimobiledevice sqlite

idevicebackup2 backup --full <destination_directory>

find <destination_directory> -name '3d*'

sqlite3 <path_to_sms_db>

SELECT * FROM message;

.mode csv
.output messages.csv
SELECT text, date, is_from_me FROM message WHERE handle_id = 1; -- Modify the query based on your needs

```
