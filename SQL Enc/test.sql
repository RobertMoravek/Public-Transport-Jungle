SELECT * FROM songs
    JOIN artists
    ON songs.artist_id = artists.id
    WHERE artists.name = "Dire Straits";

SELECT * FROM songs
    FULL OUTER JOIN artists
    ON songs.artist_id = artists.id; 
    -- alle Songs und artists, auch ohne Match

SELECT * FROM songs
    LEFT OUTER JOIN artists
    ON songs.artist_id = artists.id; 
    -- alle Songs, auch ohne artist

SELECT * FROM songs
    RIGHT OUTER JOIN artists
    ON songs.artist_id = artists.id; 
    -- alle artists, auch ohne songs

SELECT * FROM songs
    JOIN artists
    ON songs.artist_id = artists.id 
    JOIN albums
    ON songs.album_id = albums.id;
    -- JOIN Multiple

SELECT songs.name FROM songs
    JOIN artists
    ON songs.artist_id = artists.id 
    JOIN albums
    ON songs.album_id = albums.id;
    -- Get more specific values


