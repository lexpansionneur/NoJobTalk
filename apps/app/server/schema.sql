-- Schéma MySQL cible pour l'application NoJobTalk (pas encore implémenté :
-- l'appli tourne pour l'instant sur des données factices en localStorage,
-- voir README.md). À exécuter dans phpMyAdmin (cPanel -> MySQL Databases
-- pour créer la base/l'utilisateur au préalable) le jour où on bascule sur
-- un vrai backend, selon le même principe que apps/web/server/subscribe.php.

CREATE TABLE utilisateurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  prenom VARCHAR(100) NOT NULL,
  ville VARCHAR(100),
  secteur VARCHAR(150),
  tip TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tables_meetup (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  lieu VARCHAR(200) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  adresse VARCHAR(255),
  lat DECIMAL(9, 6) NOT NULL,
  lng DECIMAL(9, 6) NOT NULL,
  date DATE NOT NULL,
  heure TIME NOT NULL,
  places_max TINYINT UNSIGNED NOT NULL DEFAULT 4,
  hote_id INT NOT NULL,
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hote_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- table de jointure : qui participe à quelle table
CREATE TABLE participations (
  table_id INT NOT NULL,
  utilisateur_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (table_id, utilisateur_id),
  FOREIGN KEY (table_id) REFERENCES tables_meetup(id) ON DELETE CASCADE,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_id INT NOT NULL,
  auteur_id INT NOT NULL,
  contenu TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES tables_meetup(id) ON DELETE CASCADE,
  FOREIGN KEY (auteur_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

CREATE TABLE liens_utiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(150) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  categorie VARCHAR(100) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
