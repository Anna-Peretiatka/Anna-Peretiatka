const express = require('express'); 
const app = express(); 
const router = express.Router();
const path = require('path');//ייבוא פאט
const BodyParser = require('body-parser');
const CRUD = require('./db/CRUD');
const createDB = require('./db/createDB');
const fs = require('fs');
const csv = require('csvtojson');
const cookieParser = require('cookie-parser');
const multer = require("multer");
const session = require('express-session');
const { pool, getConnection } = require('./db/db');
const nodemailer = require('nodemailer');

const port = 3000;

const upload = multer({ 
  dest: "../static/images/temporary"
});

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended:true}));
app.use(express.static('static')); // app.use(express.static(path.join(__dirmame,'static')));
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(session({secret: 'secret-key', resave: false, saveUninitialized: true}));

//set up view engine
//app.set('views', path.join(__dirname, 'views')); //הגדרה איפה ניתן למצוא את תיקיית views
app.set('views', 'views');
app.set('view engine', 'pug'); //צריך לרשום כי יש הרבה וייו אנג'נס אפשריים , ככה יודע לחפש קבצי פאג(או איצ'יאמאל) בתיקיית וייוס

app.get('/setcookie', (req, res)=>{
    res.cookie('Cookie token name' , 'encrypted cookie string Value'); //הגדרות לעוגיה
    res.send('Cookie have been saved successfully'); //שולח ללקוח
})


//homepagea rout
app.get("/", (req,res)=>{ 
    res.redirect('/Login')
})

//page 3 rout
app.get('/Login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/HomePage');
      } else {
        res.render('Login', { title: 'Login',message: null });
    }
});

app.post('/Login',CRUD.PostLogin)

app.post('/ForgotPASS',CRUD.ForgotPASS)

app.get('/Logout', function(req, res) { 
  const cookies = req.cookies;
  for (const cookieName in cookies) {
    res.clearCookie(cookieName);
}
  res.redirect('/Login');
});


/*app.get('/HomeLayout', (req,res)=>{
    res.render('HomeLayout');
})

app.get('/HomePandSearchLayout', (req,res)=>{
    res.render('HomePandSearchLayout');
})*/

app.get('/HomePage', (req, res) => {
    if (!req.session.loggedIn) {
      res.redirect('/Login');
    } else {
      res.render('Homepage', {
        title:'Homepage',
        V1: "מה במאנצ'? ",
        name: req.cookies.UserName,
        userAddress:req.cookies.UserAddress
      });
    }
});

app.post('/Homepage', CRUD.UserSignUp);

app.get('/registration', (req,res)=>{
  res.render('registration',{title: 'registration'});
  //res.redirect(`/HomePage?email=${req.body.regemail}`);
})

app.post('/registration', upload.single('regpic'), CRUD.UserSignUp);

app.get('/updateRegi', CRUD.UserUpdate);
app.post('/updateRegi', upload.single('regpic'), CRUD.UserSignUp);


app.get('/UserAddress',CRUD.userAddress);

app.get('/api/posts/search', async (req, res) => {
    const query = req.query.searchbox;
    try {
      const conn = await getConnection();
      const Q1 = 'SELECT * FROM Posts WHERE PostTitle LIKE ?';
      const searchQuery = `%${query}%`;
      const [rows] = await conn.query(Q1, [searchQuery]);
      conn.release();
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/AfterSearch',CRUD.AfterSearch);


app.get('/resaults', (req,res)=>{
  res.render('AfterSearch', {V1: 'תוצאות חיפוש'});
});


app.get('/postLayout', (req,res)=>{
    res.render('postLayout');
})

app.get('/Newpost', (req,res)=>{
    res.render('Newpost', {
      title: 'New Post',
      V1:"פוסט חדש",
      userAddress:req.cookies.UserAddress
    });
})

app.post('/Newpost',upload.single("PostFoodPic"), CRUD.UserNewPost)

app.get('/about', (req,res)=>{
    res.render('about', {
      title: 'About',
      V1:" עלינו "
    });
})

app.get('/loginFORcookie', (req,res)=>{
    res.render('loginFORcookie');
});

app.get('/show_all_customers', CRUD.showAll);


app.get('/post/:id', CRUD.postPage);

app.get("/api/posts/filter-by-tag", CRUD.filterByTag);


// //////////////////////////////////////////////////// TABLES ////////////////////////////////////////////////////////



app.get('/insertAllData', createDB.insertAllData);

/* _________Tb_Users_________ */
app.get('/CreateTbUsers', createDB.createTbUsers);
app.get('/InsertTbUsers', createDB.insertTbUsers);
app.get('/ShowTbUsers',createDB.showTbUsers);
app.get('/dropTbUsers', createDB.dropTbUsers);

/* _________Tb_Tag_List_________ */
app.get('/createTagList', createDB.createTagList);
app.get('/insertTagList', createDB.insertTagList);
app.get('/showTbTagList',createDB.showTbTagList);
app.get('/dropTbTagList', createDB.dropTbTagList);

/* _________Tb_Posts_________ */
app.get('/createTbPosts', createDB.createTbPosts);
app.get('/InsertTbPosts', createDB.insertTbPosts);
app.get('/ShowTbPosts',createDB.showTbPosts);
app.get('/dropTbPosts', createDB.dropTbPosts);

/* _________Tb_Post_Tags_________ */
app.get('/createTbPostTags', createDB.createTbPostTags);
app.get('/InsertTbPostTags', createDB.insertTbPostTags);
app.get('/showTbPostTags',createDB.showTbPostTags);
app.get('/dropTbPostTags', createDB.dropTbPostTags);

/* _________Tb_Post_Images_________ 
app.get('/createTbPostImages', createDB.createTbPostImages);
app.get('/InsertTbPostImages', createDB.insertTbPostImages);
app.get('/showTbPostImages',createDB.showTbPostImages);
app.get('/dropTbPostImages', createDB.dropTbPostImages);
*/

/* _________Tb_Orders_________ */
app.get('/createTbOrders', createDB.createTbOrders);
app.get('/InsertTbOrders', createDB.insertTbOrders);
app.get('/showTbOrders',createDB.showTbOrders);
app.get('/dropTbOrders', createDB.dropTbOrders);


app.get('/showTables', createDB.showTables);


const tableFunctions = [
    createDB.createTbUsers,
    createDB.createTagList,
    createDB.createTbPosts,
    createDB.createTbPostTags,
    createDB.createTbPostImages,
    createDB.createTbOrders
];

// define an express route to create all the tables at once
app.get('/CreateAllTables', async (req, res) => {
    try {
        // execute all the create and drop table functions using Promise.all()
        await Promise.all(tableFunctions.map((fn) => fn()));

        res.render('success', { V1: 'All tables created successfully' });
    } catch (err) {
        console.log('Error creating tables:', err);
        res.status(500).render('error', { message: 'Error creating tables' });
    }
});


app.get('/dropAllTables', async (req, res) => {
    try {
        await createDB.dropTbOrders();
        await createDB.dropTbPostImages();
        await createDB.dropTbPostTags();
        await createDB.dropTbPosts();
        await createDB.dropTbTagList();
        await createDB.dropTbTagList();

      res.render('success', { message: "All tables have been dropped successfully;" });
    } catch (err) {
      console.log(`error in dropping tables: ${err.message}`);
      res.status(400).render('error', { message: "error in dropping tables : " + err });
    }
});

//app.get('/dropA', createDB.dropA);


// //////////////////////////////////////////////////// set listen ////////////////////////////////////////////////////////
app.listen(port, ()=>{
    console.log("server is running on port ", port); 
   
})


/*
const DeleteTHEDB = {
dropTbOrders: async () => {
    const Q = `DROP TABLE IF EXISTS Orders`;
    await pool.query(Q);
},
dropTbPostImages: async () => {
    const Q = `DROP TABLE IF EXISTS PostImages`;
    await pool.query(Q);
},
dropTbPostTags: async () => {
    const Q = `DROP TABLE IF EXISTS PostTags`;
    await pool.query(Q);
},
dropTbPosts: async () => {
    const Q = `DROP TABLE IF EXISTS Posts`;
    await pool.query(Q);
},
dropTbTagList: async () => {
    const Q = `DROP TABLE IF EXISTS TagNames`;
    await pool.query(Q);
},
dropTbUsers: async () => {
    const Q = `DROP TABLE IF EXISTS RegistratedUsers`;
    await pool.query(Q);
},
};
*/

module.exports = { session,router };