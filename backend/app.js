// Déclaration des dépandances requis
const express = require('express'); /*Server Express*/
const path = require('path'); /* Gestion des Chemins*/
const bodyParser = require('body-parser');
const app = express(); /*Initialisation du serveur express*/
const mysql = require('mysql');

// Déclaration d'une varible d'initialisation de la Base de donnée SQL
var db_config = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "hardware"
};


var initConnectDB;

function handleDisconnect() {
  initConnectDB = mysql.createConnection(db_config); // Recreate the connection, since
  // the old one cannot be reused.

  initConnectDB.connect(function(err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log('Erreur de connexion à la db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }  else {
      console.log('BDD start succeful')
    }                                   // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  initConnectDB.on('error',
    function(err) {
      console.log('db error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        // Connection to the MySQL server is usually
        handleDisconnect(); // lost due to either server restart, or a
      } else {
        // connnection idle timeout (the wait_timeout
        throw err; // server variable configures this)
      }
    });

  // Déclaration des routes globales
  app.use("/assets",
    express.static(path.resolve(__dirname, "../frontend/assets")));
  app.use("/app/assets",
    express.static(path.resolve(__dirname, "../frontend/assets")));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use((req, res, next) => {
    /*Routes pour corriger les erreurs CORS*/
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  // Déclaration de routes GET
  app.get("/*",
    (req, res) => {
      res.sendFile(path.resolve(__dirname, "../frontend/index.html"))
    })

  // POST Request to save admin credentials in database
  app.post("/register-admin",
    (req, res) => {
      // Initialisation de la connexion à la base de donnée
      initConnectDB.connect(function (err) {
        if (err) {
          console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
        }
        // Script Requête SQL D'insertion dans la base de donnée
        var insertQuery = "INSERT INTO admin (identifiant, password) VALUES ('" + req.body.identifiant + "', '" + req.body.password + "')";
        // Exécution de la requête SQL
        initConnectDB.query(insertQuery, function (err, result) {
          if (err) {
            console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
          }
          // Sinon
          else {
            res.status(200).json({
              "status": "Admin crée avec succès"
            });
          }
        })
      })
    })

  // POST Request to check credentials of admin
  app.post("/connect-admin", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var insertQuery = 'SELECT * From admin where identifiant = "' + req.body.identifiant + '" and password = "'+ req.body.password +'";';
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result)
          if (result.length > 0)
            res.status(200).json({
            "isConnect": true
          })
          else
            res.status(200).json({
            "isConnect": false
          })
        }
      })
    })
  })

  //POST query to get all equipment
  app.post("/all-equipments", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT equipments.*,  DATE_FORMAT(equipments.date_achat, "%d/%m/%Y"), fournisseurs.* From equipments INNER JOIN fournisseurs on equipments.id_fournisseur=fournisseurs.id_fournisseur ORDER BY equipments.ref DESC;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result)
          res.status(200).json(result)
        }
      })
    })
  })

  //POST query to get all equipment is affected and user
  app.post("/all-equipments-affected", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT equipments.*, utilisateur.*, affectation.*, DATE_FORMAT(affectation.date_debut, "%d/%m/%Y"), DATE_FORMAT(affectation.date_fin, "%d/%m/%Y") FROM affectation INNER JOIN equipments ON affectation.ref_equip=equipments.ref INNER JOIN utilisateur ON affectation.id_util = utilisateur.id_utilisateur where affectation.date_fin is Null;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result)
          res.status(200).json(result)
        }
      })
    })
  })

  //POST query to get all equipment is offline
  app.post("/all-equipments-offline", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT DISTINCT equipments.*, probleme.*, DATE_FORMAT(probleme.date_panne, "%d/%m/%Y"),  affectation.* FROM affectation INNER JOIN equipments ON affectation.ref_equip = equipments.ref INNER JOIN probleme ON affectation.id_affect = probleme.id_affectation WHERE equipments.etat_utilisation="En Panne";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  //POST query to get all user
  app.post("/all-user", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT * FROM utilisateur;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });


  //POST query to get all informations for one equipment.
  app.post("/infos-equipment", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT *, DATE_FORMAT(date_achat, "%d/%m/%Y")  From equipments INNER JOIN fournisseurs on equipments.id_fournisseur=fournisseurs.id_fournisseur WHERE equipments.ref="'+req.body.equipRef+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result)
          res.status(200).json(result)
        }
      })
    })
  })

  //POST query to get all user
  app.post("/all-provider", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT * FROM fournisseurs;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  // POST Request to save admin credentials in database
  app.post("/register-equipment", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = "INSERT INTO equipments (ref, designation, carac_technique, marque, model, prix_achat, date_achat, etat_achat, id_fournisseur)  VALUES ('" + req.body["reference_equipement"]+ "', '" + req.body["designation_equipement"] + "', '"+req.body["fiche_technique"]+"', '"+req.body["marque_equipement"]+"', '"+req.body["model_equipement"]+"', '"+req.body["prix_achat"]+"', '"+req.body["date_achat"]+"', '" + req.body["etat_achat"]+"', '"+req.body["fournisseur"]+"')";
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          res.status(200).json({
            "status": "Équipements Ajouté avec succès"
          });
        }
      })
    })
  })

  //POST query to get all information of equipmet affected.
  app.post("/infos-equipment-affected", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT affectation.*, DATE_FORMAT(affectation.date_debut, "%d/%m/%Y"), DATE_FORMAT(affectation.date_fin, "%d/%m/%Y"), equipments.*, DATE_FORMAT(equipments.date_achat, "%d/%m/%Y"), utilisateur.*, fournisseurs.* FROM affectation INNER JOIN equipments ON affectation.ref_equip=equipments.ref INNER JOIN fournisseurs ON equipments.id_fournisseur=fournisseurs.id_fournisseur INNER JOIN utilisateur ON affectation.id_util = utilisateur.id_utilisateur where affectation.date_fin is Null and equipments.ref="'+req.body["equipRef"]+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result)
          res.status(200).json(result)
        }
      })
    })
  })

  //POST query to get all information for one equipment is offline
  app.post("/infos-offline-equipment", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT equipments.*, DATE_FORMAT(equipments.date_achat, "%d/%m/%Y"), probleme.*, DATE_FORMAT(probleme.date_panne, "%d/%m/%Y"),  affectation.*, fournisseurs.* FROM affectation INNER JOIN equipments ON affectation.ref_equip = equipments.ref INNER JOIN probleme ON affectation.id_affect = probleme.id_affectation INNER JOIN fournisseurs ON equipments.id_fournisseur = fournisseurs.id_fournisseur WHERE equipments.ref="'+req.body.equipRef+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  //POST query to get historyn⅔
  app.post("/user-of-equipment", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT affectation.*,  DATE_FORMAT(affectation.date_debut, "%d/%m/%Y"), DATE_FORMAT(affectation.date_fin, "%d/%m/%Y"), utilisateur.* FROM affectation INNER JOIN utilisateur ON affectation.id_util = utilisateur.id_utilisateur WHERE affectation.ref_equip="'+req.body.equipRef+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  //POST query to get all panne of equipment
  app.post("/bug-of-equipment", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT affectation.*, probleme.*, DATE_FORMAT(probleme.date_panne, "%d/%m/%Y") FROM affectation INNER JOIN probleme ON affectation.id_affect = probleme.id_affectation and affectation.ref_equip="'+req.body.equipRef+'" ORDER BY probleme.id_pro DESC;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  //POST query to get solution for panne of equipment
  app.post("/solution-of-bug", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT solution.*, DATE_FORMAT(solution.date_remise, "%d/%m/%Y") FROM solution WHERE solution.id_pro="'+req.body.bugId+'" ORDER BY id_pro DESC;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  //POST query to remove equipment on parc
  app.post("/remove-equipment", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'UPDATE equipments SET etat_utilisation = "Hors Parc" WHERE equipments.ref="'+req.body.equipRef+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json({
            "status": "Équipement retiré avec succès."
          });
        }
      });
    });
  });

  //POST query to get equipments of provider
  app.post("/equipments-of-provider", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT * FROM equipments INNER JOIN  fournisseurs ON equipments.id_fournisseur = fournisseurs.id_fournisseur WHERE fournisseurs.id_fournisseur = "'+req.body.idProvider+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  // POST Request to save admin credentials in database
  app.post("/register-provider", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = "INSERT INTO fournisseurs (nom_fournisseur, adresse_fournisseur) VALUES ('" + req.body.nom_fournisseur + "', '" + req.body.adresse_fournisseur + "')";
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          res.status(200).json({
            "status": "Fournisseur ajouté avec succès"
          });
        }
      })
    })
  })

  //POST query to get all equipment is offline group by Fournisseur
  app.post("/all-equipments-offline-by-fournisseur", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT equipments.id_fournisseur, COUNT(equipments.id_fournisseur) FROM affectation INNER JOIN equipments ON affectation.ref_equip = equipments.ref INNER JOIN probleme ON affectation.id_affect = probleme.id_affectation  GROUP BY equipments.id_fournisseur HAVING COUNT(equipments.id_fournisseur)>=3;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          res.status(500).json({
            "status": "Erreur de requête. | "+err.sqlMessage
          });
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          if (result.length == 0)
            res.status(200).json([]);
          else {
            //     res.status(200).json(result);
            //After get id_fournisseur, execute new query to get all informations of provider
            function getProvider(arrayOfId) {
              return new Promise((resolve, reject)=> {
                let finalArray = [];
                let i = 1;
                for (let provider of arrayOfId) {
                  var insertQuery = 'SELECT * From fournisseurs where id_fournisseur = "' + provider.id_fournisseur + '";';
                  // Exécution de la requête SQL
                  initConnectDB.query(insertQuery, function (err, result) {
                    if (err) {
                      console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
                    }
                    // Sinon
                    else {
                      console.log(result[0])
                      result[0].hasBug = provider["COUNT(equipments.id_fournisseur)"];
                      finalArray.push(result[0])
                      console.log(finalArray)
                    }
                    if (i == arrayOfId.length) {
                      resolve(finalArray)} else {
                      i++
                    }
                  })
                }
              })}
            getProvider(result).then((allProviderBug)=> {
              res.status(200).json(allProviderBug);
            })
          }
        }
      });
    });
  });

  //POST query to get all equipment is offline group by Fournisseur
  app.post("/bug-equipments-of-provider", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT equipments.*, probleme.* FROM  affectation INNER JOIN equipments ON affectation.ref_equip = equipments.ref INNER JOIN probleme ON affectation.id_affect = probleme.id_affectation  WHERE equipments.id_fournisseur = "' + req.body.idProvider + '";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          res.status(500).json({
            "status": "Erreur de requête. | "+err.sqlMessage
          });
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        } else {
          res.status(200).json(result);
        }
      })
    })
  })

  /** User Bloc **/
  //POST query to get equipments is used by a user
  app.post("/equipments-of-user", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT equipments.*, utilisateur.*, affectation.*, DATE_FORMAT(affectation.date_debut, "%d/%m/%Y"), DATE_FORMAT(affectation.date_fin, "%d/%m/%Y") FROM affectation INNER JOIN equipments ON affectation.ref_equip=equipments.ref INNER JOIN utilisateur ON affectation.id_util = utilisateur.id_utilisateur where id_utilisateur = "' + req.body.idUser+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result)
          res.status(200).json(result)
        }
      })
    })
  });

  // POST Request to save a user
  app.post("/register-user", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = "INSERT INTO utilisateur (nom, prenom) VALUES ('" + req.body.lastname + "', '" + req.body.firstname + "')";
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          res.status(200).json({
            "status": "Utilisateur ajouté avec succès"
          });
        }
      })
    })
  })

  //POST query to get all equipments not assign
  app.post("/equipments-not-assign", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT * FROM equipments WHERE etat_utilisation = "Non Affecté";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  // POST Request to assign equipment to user
  app.post("/assign-equipment", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = "INSERT INTO affectation (ref_equip, id_util) VALUES ('" + req.body.refEquip + "', '" + req.body.idUser + "')";
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          //Update etat_utilisation of equipment to Affecté
          var query = 'UPDATE equipments SET etat_utilisation = "Affecté" WHERE equipments.ref="'+req.body.refEquip+'";';
          // Exécution de la requête SQL
          initConnectDB.query(query, function (err, result) {
            if (err) {
              console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
            }
            // Sinon
            else {
              console.log(result);
              res.status(200).json({
                "status": "Affectation effectué avec succès."
              });
            }
          });
        }
      });
    }
    )
  })

  // POST Request to remove equipment to Affectation
  app.post("/remove-equipment-to-affectation", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = 'UPDATE affectation SET date_fin = CURRENT_TIMESTAMP WHERE affectation.ref_equip="'+req.body.refEquip+'";';
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          //Update etat_utilisation of equipment to Affecté
          var query = 'UPDATE equipments SET etat_utilisation = "Non Affecté" WHERE equipments.ref="'+req.body.refEquip+'";';
          // Exécution de la requête SQL
          initConnectDB.query(query, function (err, result) {
            if (err) {
              console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
            }
            // Sinon
            else {
              console.log(result);
              res.status(200).json({
                "status": "Retrait d'affectation effectué avec succès."
              });
            }
          });
        }
      });
    }
    )
  })

  //Service Bloc
  //POST query to get all Service
  app.post("/all-services", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT services.*, DATE_FORMAT(services.date_exp, "%d/%m/%Y") FROM services;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  //POST query to get all Service
  app.post("/infos-of-service", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT services.*, DATE_FORMAT(services.date_exp, "%d/%m/%Y"), equipments.*, prestataire.* FROM services INNER JOIN equipments ON  services.ref_equip = equipments.ref INNER JOIN prestataire ON services.id_prestataire = prestataire.id WHERE services.id_service = "'+req.body.refService+'";';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  //POST query to get all prestataire
  app.post("/all-prestataire", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT * FROM prestataire;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  // POST Request to save admin credentials in database
  app.post("/register-service", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = "INSERT INTO services (ref_equip, id_prestataire, reference, date_exp, type) VALUES ('" + req.body.reference_equipement + "', '" + req.body.id_prestataire + "', '"+ req.body.reference_service + "', '" + req.body.date_expiration + "', '"+req.body.type_service + "');";
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage);
          res.status(500).json({
            "status": err.sqlMessage
          })
          /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          res.status(200).json({
            "status": "Service crée avec succès"
          });
        }
      })
    })
  })

  //POST query to get all Service
  app.post("/all-expiring-services", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL to text connect
      var query = 'SELECT services.*, DATE_FORMAT(services.date_exp, "%d/%m/%Y") FROM services WHERE services.date_exp >= CURRENT_TIMESTAMP;';
      // Exécution de la requête SQL
      initConnectDB.query(query, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          console.log(result);
          res.status(200).json(result);
        }
      });
    });
  });

  // POST Request to save admin credentials in database
  app.post("/register-service-provider", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = "INSERT INTO prestataire (prestataire, adresse) VALUES ('" + req.body.name + "', '" + req.body.adresse + "')";
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          res.status(200).json({
            "status": "Prestataire ajouté avec succès"
          });
        }
      })
    })
  })

  //Bug Blog
  // POST Request to register bug
  app.post("/register-bug", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = 'INSERT INTO probleme (id_affectation, description, date_panne) VALUE ("'+req.body.id_affectation+'", "'+req.body.description_panne+'", "'+req.body.date_panne+'");';
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          //Update etat_utilisation of equipment to Affecté
          var query = 'SELECT ref_equip FROM affectation WHERE affectation.id_affect="'+req.body.id_affectation+'";';
          // Exécution de la requête SQL
          initConnectDB.query(query, function (err, result) {
            if (err) {
              console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
            }
            // Sinon
            else {
              var query = 'UPDATE equipments SET etat_utilisation = "En Panne" WHERE equipments.ref="'+result[0].ref_equip+'";'
              initConnectDB.query(query, function (err, result) {
                if (err) {
                  console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
                }
                // Sinon
                else {
                  var query = 'UPDATE affectation SET date_fin = "'+ req.body.date_panne +'" WHERE affectation.id_affect="'+req.body.id_affectation+'";'
                  initConnectDB.query(query, function (err, result) {
                    if (err) {
                      console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
                    }
                    // Sinon
                    else {
                      console.log(result);
                      res.status(200).json({
                        "status": "Panne enregistré avec succès."
                      })
                    }});
                }
              })
            }});
        }
      });
    });
  })

  // POST Request to register solution for a probleme
  app.post("/register-solution", (req, res) => {
    // Initialisation de la connexion à la base de donnée
    initConnectDB.connect(function (err) {
      if (err) {
        console.log(err.sqlMessage); /* Si erreur, afficher l'erreur */
      }
      // Script Requête SQL D'insertion dans la base de donnée
      var insertQuery = "INSERT INTO solution (description, date_remise, id_pro) VALUES ('" + req.body.description_solution + "', '" + req.body.date_remise + "', '" + req.body.id_probleme + "');";
      // Exécution de la requête SQL
      initConnectDB.query(insertQuery, function (err, result) {
        if (err) {
          console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
        }
        // Sinon
        else {
          //Get ref equipment of bug
          var query = 'SELECT affectation.ref_equip FROM affectation INNER JOIN probleme ON affectation.id_affect = probleme.id_affectation WHERE probleme.id_pro="'+req.body.id_probleme+'";';
          // Exécution de la requête SQL
          initConnectDB.query(query, function (err, refEquip) {
            if (err) {
              console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
            }
            // Sinon
            else {
              //Update etat_utilisation of equipment to Non Affecté
              var query = 'UPDATE equipments SET etat_utilisation = "Non Affecté" WHERE equipments.ref="'+refEquip[0].ref_equip+'";';
              // Exécution de la requête SQL
              initConnectDB.query(query, function (err, result) {
                if (err) {
                  console.log(err.sqlMessage); /* Si errerur Afficher l'erreur */
                }
                // Sinon
                else {
                  console.log(result);
                  res.status(200).json({
                    "status": "Solution enregistrée avec succès."
                  });
                }
              });
            }
          });
        }
      })
    })
  })
}

handleDisconnect();
module.exports = app;