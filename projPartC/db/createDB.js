//const connection = require('./db');
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const { pool, getConnection } = require('./db');
const moment = require('moment');


/* _____________________________________________________________CREATING TABLES____________________________________________ */


const createTbUsers = async (req, res, next)=>{
  try {
      const Q1 = `CREATE TABLE IF NOT EXISTS registratedUSERS(
                  User_id INT AUTO_INCREMENT PRIMARY KEY, 
                  UserMail VARCHAR(320) NOT NULL, UNIQUE (UserMail),
                  UserName VARCHAR(255) NOT NULL, 
                  UserLastName VARCHAR(255) NOT NULL, 
                  UserPhone VARCHAR(13) NOT NULL, 
                  UserAddress VARCHAR(255),
                  UserAdrsLat DECIMAL(9,6) DEFAULT 0,
                  UserAdrLng DECIMAL(9,6) DEFAULT 0, 
                  UserPassword VARCHAR(60) NOT NULL, 
                  UsePic VARCHAR(255), 
                  calendar_url VARCHAR(420))`;

      const mySQLres = await pool.query(Q1);
      console.log('created table');
      res.render('success', { V1: 'User table created' });
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render('error', { message: "error in creating table : " + err });
    }
    next();
}

const createTagList = async (req, res, next) => {
    try {
      const Q3 = `CREATE TABLE IF NOT EXISTS TagNames (
                    tag_id INT AUTO_INCREMENT PRIMARY KEY,
                    tag_name VARCHAR(255) NOT NULL, UNIQUE (tag_name)
                  )COLLATE utf8mb4_unicode_ci`;

      const mySQLres = await pool.query(Q3);
      console.log('created table');
      res.render('success', { V1: 'TagList table created' });
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render('error', { message: "error in creating table : " + err });
    }
    next();
}

const createTbPosts = async (req, res, next) => {
    try {
      const Q2 =`CREATE TABLE IF NOT EXISTS Posts (
                  post_id INT AUTO_INCREMENT PRIMARY KEY,
                  publisher_id INT NOT NULL,
                  IsPostEvent BOOLEAN,
                  PostTitle TEXT NOT NULL,
                  PostDescrip TEXT, 
                  PostPrice DECIMAL(6,2) NOT NULL, 
                  PreOrderTime INT NOT NULL, 
                  IsDeliver BOOLEAN, 
                  PostAddress VARCHAR(255) NOT NULL,
                  PostAddressLat DECIMAL(9,6),
                  PostAddressLng DECIMAL(9,6),  
                  DeliverFee DECIMAL(6,2), 
                  MaxDayAmount INT,
                  PostFoodPic VARCHAR(13),
                  FOREIGN KEY (publisher_id) REFERENCES registratedUSERS (User_id)
                )COLLATE utf8mb4_unicode_ci`;

      const mySQLres = await pool.query(Q2);
      console.log("created table");
      res.render("success", { V1: "Posts table created" });
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render("error", { message: "error in creating table : " + err });
    }
    next();
};

const createTbPostTags = async (req, res, next)=>{
    try {
        const Q3 = `CREATE TABLE IF NOT EXISTS postTags (
                      post_id INT NOT NULL,
                      tag_name VARCHAR(255) NOT NULL, 
                      PRIMARY KEY (post_id, tag_name), 
                      FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE, 
                      FOREIGN KEY (tag_name) REFERENCES TagNames(tag_name) ON DELETE CASCADE
                    )COLLATE utf8mb4_unicode_ci`;

        const mySQLres = await pool.query(Q3);
        console.log('created table');
        res.render("success", { V1: "postTags table created" });  
    } catch (err) {
        console.log("error is: " + err);
        res.status(400).render('error',{message: "error in creating table : " + err});
    }
    next(); 
}

const createTbPostImages = async (req, res, next) => {
    try {
      const Q3 = `CREATE TABLE IF NOT EXISTS PostImages (
                    image_id INT AUTO_INCREMENT PRIMARY KEY, 
                    post_id INT NOT NULL, 
                    image_path VARCHAR(255) NOT NULL, 
                    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE
                  )COLLATE utf8mb4_unicode_ci`;

      const mySQLres = await pool.query(Q3);
      console.log("created table");
      res.render("success", { V1: "PostImages table created" });
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render("error", { message: "error in creating table : " + err });
    }
    next();
};

const createTbOrders = async (req, res, next) => {
    try {
      const Q3 = `CREATE TABLE IF NOT EXISTS Orders (
                    order_id INT AUTO_INCREMENT PRIMARY KEY, 
                    customer_id INT NOT NULL, 
                    post_id INT NOT NULL, 
                    order_date DATE, 
                    order_quantity INT NOT NULL, 
                    payment_method VARCHAR(50) NOT NULL, 
                    FOREIGN KEY (customer_id) REFERENCES registratedUSERS(User_id), 
                    FOREIGN KEY (post_id) REFERENCES Posts(post_id)
                  )COLLATE utf8mb4_unicode_ci`;

      const mySQLres = await pool.query(Q3);
      console.log("created table");
      res.render("success", { V1: "Orders table created" });
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render("error", { message: "error in creating table : " + err });
    }
    next();
};



const createSearchTable = async (req, res) => {
  try {
    const Q = `CREATE TABLE IF NOT EXISTS filteredPosts  (
              id INT AUTO_INCREMENT PRIMARY KEY,
              tag_name VARCHAR(255) NOT NULL)`;

    await pool.query(Q);

    console.log('Clicks table created');
    res.status(200).send('Clicks table created');
  }catch (err) {
    console.log('Error creating Clicks table: ', err);
    res.status(400).send(`Error creating Clicks table: ${err}`);
  }
};


/* _____________________________________________________________INSERTING TO TABLES____________________________________________ */

const insertTbUsers = async (req, res, next) => {
    try {
      const Q1 = "INSERT INTO registratedUSERS SET ?";
      const csvFilePath = path.join(__dirname, "/content/registratedUSERS.csv");
      const jsonObj = await csv().fromFile(csvFilePath);
  
      for (const element of jsonObj) {
        const newEntry = {
          "User_id": element.User_id,  
          "UserMail": element.UserMail,
          "UserName": element.UserName,
          "UserLastName": element.UserLastName,
          "UserPhone": element.UserPhone,
          "UserAddress": element.UserAddress,
          "UserAdrsLat": element.UserAdrsLat,
          "UserAdrLng": element.UserAdrLng,
          "UserPassword": element.UserPassword,
          "UsePic": element.UsePic,
          "calendar_url": element.calendar_url
        };
        const mySQLres = await pool.query(Q1, newEntry);
        console.log('created row successfully');
      }
  
      res.render('success', { V1: "registratedUSERS Data inserted successfully ;" });
      next();
    }catch (err) {
      console.log('error in inserting data:', err);
      res.status(400).render('error', { message: 'error in inserting to table: ' + err });
    }
};

const insertTagList = async (req, res, next) => {
    try {
        const Q1 = "INSERT INTO TagNames SET ?";
        const csvFilePath = path.join(__dirname, "/content/TagNames.csv");
        const jsonObj = await csv().fromFile(csvFilePath);
        
        for (const element of jsonObj) {
            const newEntry = {
                "tag_id": element.tag_id,
                "tag_name": element.tag_name,
            };
            const mySQLres = await pool.query(Q1, newEntry);
            console.log('created row successfully');
        }
        
        res.render('success', { V1: "TagNames Data inserted successfully ;" });
        next(); 
    }catch (err) {
        console.log('error in inserting data:', err);
        res.status(400).render('error', { message: 'error in inserting to table: ' + err });
    }
};

const insertTbPosts = async (req, res, next) => {
    try {
        const Q1 = "INSERT INTO Posts SET ?";
        const csvFilePath = path.join(__dirname, "/content/Posts.csv");
        const jsonObj = await csv().fromFile(csvFilePath);
        console.log(jsonObj);

        for (const element of jsonObj) {
            const newEntry = {
                "post_id": element.post_id,
                "publisher_id": element.publisher_id,
                "IsPostEvent": element.IsPostEvent,
                "PostTitle": element.PostTitle,
                "PostDescrip": element.PostDescrip,
                "PostPrice": element.PostPrice,
                "PreOrderTime": element.PreOrderTime,
                "IsDeliver": element.IsDeliver,
                "PostAddress": element.PostAddress,
                "PostAddressLat": element.PostAddressLat,
                "PostAddressLng": element.PostAddressLng,
                "DeliverFee": element.DeliverFee,
                "MaxDayAmount": element.MaxDayAmount,
                "PostFoodPic":element.PostFoodPic
            };
            const mySQLres = await pool.query(Q1, newEntry);
            console.log('created row successfully');
        }
        res.render('success', { V1: "Posts Data inserted successfully ;" });
        next(); 
    } catch (err) {
        console.log("error in inserting data", err);
        res.status(400).render('error', { message: "error in inserting to table : " + err });
    }
};

      
const insertTbPostTags = async (req, res, next) => {
    try {
        const Q1 = "INSERT INTO postTags SET ?";
        const csvFilePath = path.join(__dirname, "/content/postTags.csv");
        const jsonObj = await csv().fromFile(csvFilePath);
        
        for (const element of jsonObj) {
            const newEntry = {
                "post_id": element.post_id,
                "tag_name": element.tag_name
            };
            const mySQLres = await pool.query(Q1, newEntry);
            console.log('created row successfully');
        }
        
        res.render('success', { V1: "PostTags Data inserted successfully ;" });
        next(); 
    }catch (err) {
        console.log('error in inserting data:', err);
        res.status(400).render('error', { message: 'error in inserting to table: ' + err });
    }
};


const insertTbPostImages = async (req, res, next) => {
    try {
        const Q1 = "INSERT INTO PostImages SET ?";
        const csvFilePath = path.join(__dirname, "/content/PostImages.csv");
        const jsonObj = await csv().fromFile(csvFilePath);
        
        for (const element of jsonObj) {
            const newEntry = {
                "image_id": element.image_id,
                "post_id": element.post_id,
                "image_path": element.image_path
            };
            const mySQLres = await pool.query(Q1, newEntry);
            console.log('created row successfully');
        }
        
        res.render('success', { V1: "PostImage Data inserted successfully ;" });
        next();
    }catch (err) {
        console.log('error in inserting data:', err);
        res.status(400).render('error', { message: 'error in inserting to table: ' + err });
    }
};

const insertTbOrders = async (req, res) => {
    try {
        const Q1 = "INSERT INTO Orders SET ?";
        const csvFilePath = path.join(__dirname, "/content/Orders.csv");
        const jsonObj = await csv().fromFile(csvFilePath);
        
        for (const element of jsonObj) {
            const newEntry = {
                "order_id": element.order_id,
                "customer_id": element.customer_id,
                "post_id": element.post_id,
                "order_date": moment(element.order_date, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss"),
                "order_quantity": element.order_quantity,
                "payment_method": element.payment_method
            };
            const mySQLres = await pool.query(Q1, newEntry);
            console.log('created row successfully');
        }
        
        res.render('success', { V1: "Orders Data inserted successfully ;" });
    }catch (err) {
        console.log('error in inserting data:', err);
        res.status(400).render('error', { message: 'error in inserting to table: ' + err });
    }
};



const insertAllData = async () => {
    const csvDir = path.join(__dirname, 'content');
    const csvFiles = fs.readdirSync(csvDir).filter(file => path.extname(file) === '.csv');
  
    for (const csvFile of csvFiles) {
      const tableName = path.basename(csvFile, '.csv');
  
      const jsonObj = await csv().fromFile(path.join(csvDir, csvFile));
      const sql = `INSERT INTO ${tableName} SET ?`;
  
      for (const row of jsonObj) {
        pool.query(sql, row, (err, res) => {
          if (err) {
            console.log(`Error inserting data to ${tableName}: `, err);
          } else {
            console.log(`Inserted row ${res.insertId} to ${tableName}`);
          }
        });
      }
    }
};
  

/* !!!  אולי להוסיף טבלת סוגי תשלום- תלוי בהסר שלי*/

/* _____________________________________________________________SHOW TABLES____________________________________________ */

const showTbUsers = async (req, res) => {
    try {
      const Q3 = "SELECT * FROM `registratedUSERS`";
      const [mySQLres] = await pool.query(Q3);
  
      console.log('show table');
      console.log(mySQLres);
      res.send(mySQLres);
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render('error', { message: "error in showing table : " + err });
    }
};

const showTbTagList = async (req, res) => {
    try {
      const Q3 = "SELECT * FROM `TagNames`";
      const [mySQLres] = await pool.query(Q3);
  
      console.log('show table');
      console.log(mySQLres);
      res.send(mySQLres);
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render('error', { message: "error in showing table : " + err });
    }
};

const showTbPosts = async (req, res) => {
    try {
      const Q3 = "SELECT * FROM `Posts`";
      const [mySQLres] = await pool.query(Q3);
  
      console.log('show table');
      console.log(mySQLres);
      res.send(mySQLres);
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render('error', { message: "error in showing table : " + err });
    }
};
  
const showTbPostTags = async (req, res) => {
    try {
        const Q3 = "SELECT * FROM `postTags`";
        const [mySQLres] = await pool.query(Q3);

        console.log('show table');
        console.log(mySQLres);
        res.send(mySQLres);
    } catch (err) {
        console.log("error is: " + err);
        res.status(400).render('error', { message: "error in showing table : " + err });
}
};
  
const showTbPostImages = async (req, res) => {
    try {
      const Q3 = "SELECT * FROM `PostImages`";
      const [mySQLres] = await pool.query(Q3);
  
      console.log('show table');
      console.log(mySQLres);
      res.send(mySQLres);
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render('error', { message: "error in showing table : " + err });
    }
};
  
const showTbOrders = async (req, res) => {
    try {
      const Q3 = "SELECT * FROM `Orders`";
      const [mySQLres] = await pool.query(Q3);
  
      console.log('show table');
      console.log(mySQLres);
      res.send(mySQLres);
    } catch (err) {
      console.log("error is: " + err);
      res.status(400).render('error', { message: "error in showing table : " + err });
    }
};
  
/* _____________________________________________________________DROP ALL TABLES____________________________________________ */

const dropTbUsers = async (req, res)=>{
    try {
        const Q4 = "DROP TABLE `registratedUSERS`";
        await pool.query(Q4);
        console.log('table dropped');
        res.status(800).render('success', { message: "Table registratedUSERS has successfully DROPPED "  });
    } catch (err) {
        console.log(`error in dropping table: ${err.message}`);
        res.status(400).render('error', { message: "error in dropping table : " + err });
    }
}

const dropTbPosts = async (req, res) => {
    try {
        const Q4 = "DROP TABLE `Posts`";
        await pool.query(Q4);
        console.log('table dropped');
        res.status(800).render('success', { message: "Table registratedUSERS has successfully DROPPED "  });
    } catch (err) {
        console.log(`error in dropping table: ${err.message}`);
        res.status(400).render('error',{message: "error in dropping table : " + err});
    }
}

const dropTbPostTags = async (req, res) => {
    try {
      const Q4 = "DROP TABLE `postTags`";
      await pool.query(Q4);
      console.log('table dropped');
      res.status(800).render('success', { message: "Table postTags has successfully DROPPED "  });
    } catch (err) {
      console.log(`error in dropping table: ${err.message}`);
      res.status(400).render('error', { message: `error in dropping table: ${err.message}` });
    }
};

const dropTbPostImages = async (req, res) => {
    try {
        const Q4 = "DROP TABLE `PostImages`";
        await pool.query(Q4);
        console.log('table dropped');
        res.status(800).render('success', { message: "Table PostImages has successfully DROPPED "  });
    } catch (err) {
        console.log(`error in dropping table: ${err.message}`);
        res.status(400).render('error',{message: "error in dropping table : " + err});
    }
}

const dropTbOrders = async (req, res) => {
    try {
        const Q4 = "DROP TABLE `Orders`";
        await pool.query(Q4);
        console.log('table dropped');
        res.status(800).render('success', { message: "Table Orders has successfully DROPPED "  });
    } catch (err) {
        console.log(`error in dropping table: ${err.message}`);
        res.status(400).render('error',{message: "error in dropping table : " + err});
    }
}

const dropTbTagList = async (req, res) => {
    try {
        const Q4 = "DROP TABLE `TagNames`";

        await pool.query(Q4);
        console.log('table dropped');
        res.status(800).render('success', { message: "Table TagNames has successfully DROPPED "  });
    } catch (err) {
        console.log("error is: " + err);
        const errRes = await pool.query('SHOW ERRORS');
        console.log(`error in dropping table: ${err.message}`);
        res.status(400).render('error',{message: "error in dropping table : " + err});
    }
}

const showTables = async (req, res) => {
    try {
      const query = "SHOW TABLES";
      const [rows] = await pool.query(query);
      res.send(rows);
    } catch (err) {
      console.log(`Error showing tables: ${err.message}`);
      res.status(400).render('error', { message: `Error showing tables: ${err.message}` });
    }
};
/*
const dropA = async (req, res) => {
  try {
      const Q4 = `DELETE [LOW_PRIORITY] [QUICK] [IGNORE]
      tbl_name[.*] [, tbl_name[.*]] ...
      FROM Clicks, Orders, PostImages, postTags, Posts, TagNames, registratedUSERS`;

      await pool.query(Q4);
      console.log('table dropped');
      res.status(800).render('success', { message: "Table TagNames has successfully DROPPED "  });
  } catch (err) {
      console.log("error is: " + err);
      const errRes = await pool.query('SHOW ERRORS');
      console.log(`error in dropping table: ${err.message}`);
      res.status(400).render('error',{message: "error in dropping table : " + err});
  }
}*/




module.exports = {createTbUsers,createTagList, createTbPosts, createTbPostTags, createTbPostImages, createTbOrders,insertAllData,
     insertTbUsers, insertTagList, insertTbPosts, insertTbPostTags, insertTbPostImages, insertTbOrders,
     showTbUsers, showTbTagList, showTbPosts, showTbPostTags, showTbPostImages, showTbOrders,
     dropTbUsers, dropTbTagList, dropTbPosts, dropTbPostTags, dropTbPostImages, dropTbOrders, showTables};