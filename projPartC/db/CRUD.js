const path = require('path');
const fs = require("fs");
const { pool, getConnection } = require('./db');
pool.query('SET NAMES utf8mb4');
const multer = require('multer');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const { URLSearchParams } = require('url');

// _________________________________________validation___________________________ 


// After sending registration form - checks if user in db
async function isEmailExists(email) {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.query('SELECT UserMail FROM registratedUSERS WHERE UserMail = ?', [email]);
      if (rows.length > 0) {
        return true;
      } else {
        return false;
      }
    } finally {
      conn.release();
    }
}


//SAVE USER IN DB
const UserSignUp = async (req, res) => {
    if (!req.body) {
      res.status(400).render('error', { message: "Content can not be empty!" });
      return;
    }

    const User_id = req.cookies.User_id || null;
    //const userId = req.body.userId 
  
    let UsePic = 'default';
    if (req.file) {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "../static/images/UsePic/" + req.body.regtel + ".png");
  
      try {
        await fs.renameSync(tempPath, targetPath);
        UsePic = req.body.regtel + ".png";
      } catch (error) {
        console.error('Error in renaming file:', error);
        res.status(400).render('error', { message: "could not upload file" });
        return;
      }
    }
  
    const newSignUp = {
        "UserMail": req.body.regemail,
        "UserName": req.body.regname,
        "UserLastName": req.body.reglastname,
        "UserPhone": req.body.regtel,
        "UserAddress": req.body.UAdress,
        "UserAdrsLat": req.body.lat,
        "UserAdrLng": req.body.lng,
        "UserPassword": req.body.loginPassword,
        "UsePic": UsePic,
        "calendar_url": req.body.GoogleC
    };

    try {
      const conn = await pool.getConnection();
      if(User_id){
        const resultA = conn.query('UPDATE registratedUSERS SET ? WHERE User_id = ?', [newSignUp, User_id]);
        res.render('success', { V1: "המשתמש עודכן", herf: "Homepage", where: "GO Homepage" });
        
       

    } else {
        //const resultB = conn.query('INSERT INTO registratedUSERS SET ?', newSignUp);
        const resultB = conn.query('INSERT INTO registratedUSERS SET ?', newSignUp);
        const usernameCookie = req.body.regname;
        res.render('success', { V1: "המשתמש נוצר",message:'כעת ניתן לחזור למסך למסך הראשי ולבצע כניסה :)' ,herf: "/Logout", where: "צא וחזור אלינו בהקדם" });
    }
  
    } catch (err) {
      console.log('error: ', err);
      res.status(400).render('error', { message: 'sql-error in LogIn: ' + err });
    }
};
  

//AFTER "ENTER" IN LOG-IN, CHECK IF IN DB
const PostLogin = async (req, res) => {
    if (!req.body) {   
        res.status(400).render('error',{message: "Content can not be empty!"});
        return;
    } 
    const UserMail = req.body.logiMmail;
    const UserPassword = req.body.loginPassword;

    console.log(UserMail);
    console.log(UserPassword);
        
   
        const [user]= await isUserInDB(UserMail, UserPassword , req.session);
        console.log(user);
        if (user.length > 0) {
           res.cookie ("User_id", user[0].User_id);
           res.cookie ("UserMail", user[0].UserName);
           res.cookie ("UserName", user[0].UserName);
           res.cookie ("UserLastName", user[0].UserLastName);
           res.cookie ("UserPhone", user[0].UserPhone);
           res.cookie ("UserAddress", user[0].UserAddress);
           res.cookie ("UserAdrsLat", user[0].UserAdrsLat);
           res.cookie ("UserAdrLng", user[0].UserAdrLng);

           req.session.loggedIn = true;
           res.redirect('/Homepage');
            return;
        } else {
            res.render('Login', { error: 'Incorrect email or password.' });
        }
 
};

/* get user*/
// After sending log-in - checks if user in db
async function isUserInDB(email, password, session) {
    const conn = await pool.getConnection();
    console.log(email);
    console.log(password);
    console.log(session);

    return await conn.query('SELECT * FROM registratedUSERS WHERE UserMail = ? AND UserPassword = ?', [email, password]);

}

const ForgotPASS = async (req, res) => {
    if (!req.body) {   
      res.status(400).render('error',{message: "Content can not be empty!"});
      return;
    } 
  
    const UserMail = req.body.logiMmailFP;
    console.log(UserMail);
  
    const emailExists = await isEmailExists(UserMail);
    console.log(emailExists);
      
    if (!emailExists) {
      res.status.render('error', { message: "כתובת המייל לא קיימת במערכת: " + err });
      return;
    }
  
    // OAuth2Client (GOOGLE) configuration
    const CLIENT_ID = '777866776773-v6ho22p7el3f47cfjp1jpgf7p80c3gul.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'http://localhost:3000/Login';
    const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  
    //const authorizationCode = '4%2F0AWtgzh4YnLAUC2qseAj5z0M31DdZJHtOxqsuPDcQz1aOtYIjB3bJbE2vuO60QfFMRTyHhw';
    
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    authorizationCode = urlParams.get('code');
    oauth2Client.getToken (authorizationCode, async (err, token) => {
      if (err) {
        console.error('Error getting token:', err);
      }

      oauth2Client.setCredentials(token)
      

      
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://mail.google.com/']
      });
  
      console.log('Authorize this app by visiting this url:', authorizeUrl);

      const { tokens } = await oauth2Client.getToken(authorizationCode);
      const refresh_token = token.refresh_token;
      console.log(`Refresh token: ${refresh_token}`);
  
  
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'annaperetiatka@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: refresh_token
        }
      });
  
      
      const conn = await pool.getConnection();
      try {
        const [rows] = await conn.query('SELECT UserPassword FROM registratedUSERS WHERE UserMail = ?', [UserMail]);
        console.log([rows]);
            
        if (rows.length > 0) {
          const password = rows[0].UserPassword;
  
          // שליחת המייל
          transporter.sendMail({
            from: 'annaperetiatka@gmail.com',
            to: UserMail,
            subject: 'שיחזור סיסמא',
            text: `התבקשנו להזכיר כי הסיסמא שלך היא : ${password}`
          }, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log(`Email sent: ${info.response}`);
            }
          });
          
          res.render('success', {message: " מייל עם הסיסמא נשלח בהצלחה :) " });
        } else {
          res.status(400).render('error', { message: "כתובת המייל לא קיימת במערכת: " + err });
        }
      } finally {
        conn.release();
      }
    });
}

const UserUpdate = async (req, res) => {
    const User_id = req.cookies.User_id;
    console.log('User_id:', User_id);
    const conn = await pool.getConnection();
    const [user] = await conn.query('SELECT * FROM registratedUSERS WHERE User_id = ?', [User_id]);
    console.log(user);
    res.render('updateRegi', {user:user}
    
           /* , (err, html) => {
                if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
                return;
                }
                console.log('html:', html);
                res.send(html);*/
    );
    return;
};





const UserNewPost = async (req, res) => {
    if (!req.body) {
      res.status(400).render('error', { message: "Content can not be empty!" });
      return;
    }
    
    const getPostCount = async () => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM Posts');
    return rows[0].count;
    }

    const post_id = await getPostCount() + 1;


    const newPost = {
        "publisher_id": req.cookies.User_id,
        "IsPostEvent": req.body.IsPostEvent ? 1 : 0,
        "PostTitle": req.body.PostTitle,
        "PostDescrip": req.body.PostDescrip,
        "PostPrice": req.body.PostPrice,
        "PreOrderTime": req.body.PreOrderTime,
        "IsDeliver": req.body.IsDeliver ? 1 : 0,
        "PostAddress": req.body.PostAddress,
        "PostAddressLat": req.body.PostAddressLat,
        "PostAddressLng": req.body.PostAddressLng,
        "DeliverFee": req.body.DeliverFee,
        "MaxDayAmount": req.body.MaxDayAmount,
        "PostFoodPic": post_id
    };
    
        console.log(newPost);

        if (req.file == undefined) {
            newPost.PostFoodPic = "default"
        } else {
            const tempPath = req.file.path;

            const targetPath = path.join(__dirname, "../static/images/PostImages/" + newPost.PostFoodPic + ".png");
                /*
            const renameFile = (tempPath, targetPath) => {
                return new Promise((resolve, reject) => {
                fs.rename(tempPath, targetPath, err => {
                    if (err) {
                    reject(err);
                    } else {
                    resolve();
                    }
                });
                });
            };
            await renameFile(tempPath, targetPath);*/

            fs.rename(tempPath, targetPath, err => {
                if (err) {
                    console.log("error: error: ", err);
                    res.status(400).send({message:"could not upload 1"});
                    return;
                }
                //res.cookie("UserName", req.body.regname);
                console.log(newPost); 
            }); 
       }
    try {
        const conn = await pool.getConnection();
        const Q1 = "INSERT INTO Posts SET ?";
        await conn.query(Q1, newPost);

    
        const checkboxesArray = req.body.hashtagNew;
        const tagInsertValues = checkboxesArray.map(tagName => `(${post_id}, '${tagName}')`).join(',');
        const Q2 = `INSERT INTO postTags (post_id, tag_name) VALUES ${tagInsertValues}`;
        await conn.query(Q2);

        const postTitle = req.body.PostTitle;
        res.render("success", { V1: "איזה כייף לך ", message: 'הצלחת להעלות בהצלחה את הפוסט ' + postTitle, href:"Homepage", where:"בחזרה לדף הבית"});
    } catch (err) {
        console.log('error: ', err);
        res.status(400).render('error', { message: 'sql-error in UserNewPost: ' + err });
    }
};


const filterPosts = async (tags, location, maxPrice, availability,res) => {
  let posts = [];

  if(tags.length === 0) {
    posts = [];
  }else {
    const tagPosts = await filterByTag(tags);
    console.log('פוסטים שנבחרו מתגים');
    console.log(tagPosts);
    posts = tagPosts;
  }
  if (location) {
      const locationPosts = await filterByLocation(location, posts);
      console.log('פוסטים שנבחרו ממיקום');
      console.log("בפילטר פוסטס"+distances);
      posts = posts.filter(post => locationPosts.some(lp => lp.post_id === post.post_id));
  }

  const roundedDistances = distances.map(({ postID, distance }) => ({
    postID,
    distance: distance.toFixed(2),
  }));
  res.cookie('distances', roundedDistances);

  if(maxPrice){
    posts = posts.filter(post => parseFloat(post.PostPrice) <= maxPrice);
    console.log('פוסטים אחרי פילטר מחיר');
    console.log(posts);
  }
  if(availability){
    posts = posts.filter(post => post.PreOrderTime <= 7);
    console.log('פוסטים אחרי פילטר זמינות השבוע');
    console.log(posts);
  }
  console.log('סופי אמור להיות אחד מתחת');
  console.log(posts);

  const conn = await pool.getConnection();
  for (const post of posts) {
    const [result] = await conn.query('SELECT * FROM registratedUSERS WHERE User_id = ?', [post.publisher_id]);
    post.publisher = result[0];
  }
  
  conn.release();
  return posts;
};

const AfterSearch = async (req, res) => {
  try {
    const encodedJson = req.query.data;
    const myJson = JSON.parse(decodeURIComponent(encodedJson));
    console.log(myJson);

    const { tags, location, maxPrice, availability } = myJson;
    const posts = await filterPosts(tags, location, maxPrice, availability,res);
    console.log(posts);

    console.log('אחרון חביב');
    console.log(posts);
    console.log(res.getHeaders());

    res.cookie ("posts",posts)
    res.cookie ("tags",tags)
    res.cookie ("location",location)
    res.cookie ("maxPrice",maxPrice)
    res.cookie ("availability",availability)

    const distances = req.cookies.distances;

    res.render('AfterSearch', {title: 'Search Results', V1: 'תוצאות חיפוש', posts: posts, distances: distances});
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/* ________________________________ Fillter by tag = bubbles____________________________________*/

const filterByTag = async (tags) => {
    try {
      console.log('נכנסתי לפילטר תגים');
      console.log([tags]);
      //Filter posts by the clicked tags
      const placeholders = new Array(tags.length).fill('?').join(',');
      const query = `
        SELECT Posts.* 
        FROM Posts
        JOIN (
          SELECT post_id 
          FROM postTags 
          WHERE tag_name IN (${placeholders})
          GROUP BY post_id 
          HAVING COUNT(DISTINCT tag_name) = ?
        ) matchedPosts ON Posts.post_id = matchedPosts.post_id;`;
      const [result] = await pool.query(query, [...tags, tags.length]);
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while filtering the posts..');
    }
}
  
/* ________________________________ Fillter by Location____________________________________*/ 

let distances = [];

const filterByLocation = async (location) => {

  const { cityLat, cityLng, radius } = location;
  console.log('נכנסתי לפילטר מיקום');
  console.log(cityLat);
  console.log(cityLng);
  console.log(radius);

  try {
      // Get all the posts from the database
      const conn = await pool.getConnection();
      const [rows] = await conn.query("SELECT * FROM posts");
      console.log([rows]);
      conn.release();
  
      // Filter the posts by location
        const filteredPosts = rows.filter(post => {
        const postID = post.post_id;
        const postLat = post.PostAddressLat;
        const postLng = post.PostAddressLng;
        console.log(postLat);
        console.log(postLng);

        if (!postLat || !postLng) {
            return false;
        }
        
        const distance = getDistanceFromLatLonInKm(cityLat, cityLng, postLat, postLng);
        if(distance <= radius){
            distances.push({ postID, distance });
            return true
        }else {
            return false;
        }

      });
      console.log(filteredPosts);
      return filteredPosts;

  } catch (error) {
      console.error(error);
      throw new Error('Failed to filter posts by location');
  }
};
  
function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
const deg2rad = deg => deg * (Math.PI / 180);
const R = 6371; // Radius of the earth in km
const dLat = deg2rad(lat2 - lat1); // deg2rad below
const dLng = deg2rad(lng2 - lng1);
const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
const distance = R * c; // Distance in km
console.log(distance);
return distance;
    
}

/* ________________________________ Post Pages After Choosing ONE :) ____________________________________*/ 

const postPage = async (req, res) => {
    
    res.clearCookie('distances');
    const postId = req.params.id;
    try {
      const conn = await pool.getConnection();
      const [thisPost] = await conn.query(`
      SELECT * 
      FROM registratedUSERS u JOIN (
        SELECT * 
        FROM Posts
        WHERE post_id = ?
        ) p
      WHERE p.publisher_id=u.User_id`, postId);
      //let usernameCookie = req.body.regname;
      //console.log(usernameCookie);

      try {
        const [postTags] = await conn.query(`
            SELECT * 
            FROM postTags
            WHERE post_id = ?`, postId ); 
            try {
                const [otherPosts] = await conn.query(`
                                SELECT * FROM posts
                                WHERE publisher_id = (SELECT publisher_id FROM posts WHERE post_id = ?)
                                AND post_id != ?;`, [postId,postId] );
            
                    const to_pug = {
                        post: thisPost[0],
                        tags: postTags,
                        others: otherPosts
                    }

                res.render('postPage',to_pug,);
            } catch (err) {
                console.error(err);
                res.status(400).render('error', { message: 'sql-error: ' + err });
            } 
  
        } catch (err) {
            console.error(err);
            res.status(400).render('error', { message: 'sql-error: ' + err });
        }

    } catch (err) {
      console.error(err);
      res.status(400).render('error', { message: 'sql-error: ' + err });
    }

};
 
const userAddress = async (req, res) => {
    const userEmail = req.query.email;
    pool.query('SELECT UserAddress FROM registratedUSERS WHERE UserMail = ?', [userEmail], (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
    
        if (results.length === 0) {
          res.status(404).json({ error: 'User not found' });
          return;
        }
        res.json({ address: results[0].UserAddress });
    });
}


const UserNewOrder =  (req,res)=>{
    const reallocation = geocodeAddress(req.body.pacinput.value);
    if (!req.body) {   
        res.status(400).render('error',{message: "Content can not be empty!"});
        return;
    }    
    const newOrder = {
        "CustomerPhone": req.body.titleTextNew,
        "post_id": req.body.descripTextNew,
        "order_date": req.body.priceNewPost,
        "order_quantity": req.body.timeToNew,
        "payment_method": req.body.availDeliverNew
    };
    //run query  
    const Q1 = "INSERT INTO Orders SET ?";
    pool.query(Q1, newOrder, (err, mysqlres)=>{
        if(err){ 
            console.log("error: ", err);
            res.status(400).render('error',{message: "sql-error in LogIn: " + err});
            return;
        }
       // console.log("LogIn customer: ", { id: mysqlres.insertId, ...newlogIn });
        let usernameCookie = req.body.regname;
        console.log(usernameCookie);
        res.render('HomePage', {V2:usernameCookie});
        return;
    })
}
/*
const UserNewPublisherPosts =  (req,res)=>{
    const reallocation = geocodeAddress(req.body.pacinput.value);
    if (!req.body) {   
        res.status(400).render('error',{message: "Content can not be empty!"});
        return;
    }    
    const newPublisherPosts = {
        "publisher_Postid": req.body.titleTextNew,
        "publisherpost_Phone": req.body.descripTextNew,
        "Post_id": req.body.priceNewPost
    };
    //run query  
    const Q1 = "INSERT INTO PublisherPosts SET ?";
    pool.query(Q1, newPublisherPosts, (err, mysqlres)=>{
        if(err){ 
            console.log("error: ", err);
            res.status(400).render('error',{message: "sql-error in LogIn: " + err});
            return;
        }
       // console.log("LogIn customer: ", { id: mysqlres.insertId, ...newlogIn });
        let usernameCookie = req.body.regname;
        console.log(usernameCookie);
        res.render('HomePage', {V2:usernameCookie});
        return;
    })
}
*/

/* post- new figure  */
/*const ForgotPASS = async (req, res) => {
    if (!req.body) {   
        res.status(400).render('error',{message: "Content can not be empty!"});
        return;
    } 
    const UserMail = req.body.logiMmailFP;
    console.log(UserMail);
    const emailExists = await isEmailExists(UserMail);
    console.log(emailExists);
    

    if (!emailExists) {
        res.status.render('error', { message: "כתובת המייל לא קיימת במערכת: " + err });
        return;
    }

    const conn = await pool.getConnection();
    try {
        const [rows] = await conn.query('SELECT UserPassword FROM registratedUSERS WHERE UserMail = ?', [UserMail]);
        console.log([rows]);
        
        if (rows.length > 0) {
          const password = rows[0].UserPassword;

          
          const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'annaperetiatka@gmail.com',
              pass: 'annaP1997'
            }
          });
    
          const mailOptions = {
            from: 'Anna Peretiatka <annaperetiatka@gmail.com>',
            to: UserMail,
            subject: 'שיחזור סיסמא',
            text: `התבקשנו להזכיר כי הסיסמא שלך היא : ${password}`
          };
    
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    
          // Render a success message to the user
          res.render('success', { V1: " מייל עם הסיסמא נשלח בהצלחה :) " });
        } else {
            res.status(400).render('error', { message: "כתובת המייל לא קיימת במערכת: " + err });
        }
      } finally {
        conn.release();
      }

}*/




const showAll = (req,res)=>{
    const Q2 = "SELECT * FROM Users";
    pool.query(Q2, (err, mysqlres)=>{
        if(err){ 
            //התמודדות עם שגיאה של ERROR
            console.log("error: ", err);
            res.status(400).send({message: "error in selecting all Users: " + err});
            return;
        }
        console.log("successfully got all Users...");  //לקונסול שלנו
        //res.send(mysqlres); //ישלח לעמוד של הלקוח
        const Timee = new Date();
        res.render('results', {
            V1: 'Users',
            V2:Timee, 
            mysqlresArray:mysqlres
        })
        return;
    })
}

const findUser = (req, res)=>{
    // validate body exists
    if (!req.body) {        // אם אין גוף לבקשה
        res.status(400).send({  //מעדכנים סטטוס תגובה לשגיאה
        message: "please fill user name to search"});  //שולחים הודעה ללקוח
        return;
    }
    
    // pull data fron body to json
    const user = req.body.SearchName;
    console.log(user)

    // run query
    const Q3 = "SELECT * FROM Users where name like ?"
    pool.query(Q3, user + "%", (err, mysqlres)=>{
        if (err) {
            console.log("error is: " + err);
            res.status(400).send({message: "error in searching customer " + err});
            return;
        }
        // if not query error
        console.log("found user: ", { user: mysqlres});
        res.send(mysqlres);  //שליחת התוצאות ללקוח
        return;
    })
}



module.exports = {isEmailExists,ForgotPASS, UserSignUp, PostLogin, isUserInDB, filterByTag,AfterSearch,
                     filterByLocation, UserNewPost, userAddress, showAll, findUser,postPage, UserUpdate, UserNewOrder};