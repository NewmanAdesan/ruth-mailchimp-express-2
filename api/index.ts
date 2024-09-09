require('dotenv').config();

const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require('express');
const cors = require('cors'); 

const app = express();
// app.use(cors());
app.use(cors({ origin: '*' }));  // Enable CORS 
app.use(express.json());

// const { sql } = require('@vercel/postgres');

// const bodyParser = require('body-parser');
const path = require('path');

// // Create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));



const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_DATA_CENTER = process.env.MAILCHIMP_DATA_CENTER;

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_DATA_CENTER,
});

async function getLists() {
    try {
      const response = await mailchimp.lists.getAllLists();
      console.log(response);
      // This will print out your lists and their corresponding IDs
    } catch (error) {
      console.error(error);
    }
  }
  
getLists();


// Route that accepts listId as a path parameter
app.post("/subscribe/:listId", async (req, res) => {
    const { listId } = req.params; 
    const { email_address, status, merge_fields } = req.body; 

    console.log (req.body, req.params)
    if (!email_address || !status || !merge_fields) {
        console.log(email_address, status, merge_fields)
        return
    }
  
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address,
        status,
        merge_fields
      });
   
      console.log("Successfully added contact:", response);
      res.status(200).json(response);
    } catch (error) {
      console.error("Error adding contact:", error);
      res.status(500).json({ error: error.message });
      
    }
});

app.get("/testing", async (req, res) => {
    res.send("Testing Successful");
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'home.htm'));
});

app.get('/about', function (req, res) {
	res.sendFile(path.join(__dirname, '..', 'components', 'about.htm'));
});

// app.get('/uploadUser', function (req, res) {
// 	res.sendFile(path.join(__dirname, '..', 'components', 'user_upload_form.htm'));
// });

// app.post('/uploadSuccessful', urlencodedParser, async (req, res) => {
// 	try {
// 		await sql`INSERT INTO Users (Id, Name, Email) VALUES (${req.body.user_id}, ${req.body.name}, ${req.body.email});`;
// 		res.status(200).send('<h1>User added successfully</h1>');
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).send('Error adding user');
// 	}
// });

// app.get('/allUsers', async (req, res) => {
// 	try {
// 		const users = await sql`SELECT * FROM Users;`;
// 		if (users && users.rows.length > 0) {
// 			let tableContent = users.rows
// 				.map(
// 					(user) =>
// 						`<tr>
//                         <td>${user.id}</td>
//                         <td>${user.name}</td>
//                         <td>${user.email}</td>
//                     </tr>`
// 				)
// 				.join('');

// 			res.status(200).send(`
//                 <html>
//                     <head>
//                         <title>Users</title>
//                         <style>
//                             body {
//                                 font-family: Arial, sans-serif;
//                             }
//                             table {
//                                 width: 100%;
//                                 border-collapse: collapse;
//                                 margin-bottom: 15px;
//                             }
//                             th, td {
//                                 border: 1px solid #ddd;
//                                 padding: 8px;
//                                 text-align: left;
//                             }
//                             th {
//                                 background-color: #f2f2f2;
//                             }
//                             a {
//                                 text-decoration: none;
//                                 color: #0a16f7;
//                                 margin: 15px;
//                             }
//                         </style>
//                     </head>
//                     <body>
//                         <h1>Users</h1>
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>User ID</th>
//                                     <th>Name</th>
//                                     <th>Email</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 ${tableContent}
//                             </tbody>
//                         </table>
//                         <div>
//                             <a href="/">Home</a>
//                             <a href="/uploadUser">Add User</a>
//                         </div>
//                     </body>
//                 </html>
//             `);
// 		} else {
// 			res.status(404).send('Users not found');
// 		}
// 	} catch (error) {
// 		console.error(error);
// 		res.status(500).send('Error retrieving users');
// 	}
// });

app.listen(3000, () => console.log('Server ready on port 3000.'));

module.exports = app;
