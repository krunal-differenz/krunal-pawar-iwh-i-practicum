const express = require("express");
const axios = require("axios");

require('dotenv').config()

const app = express();

app.set('view engine', 'pug');

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/actors?properties=actor_name,actor_movie_name,actor_age,hs_object_id'
    const headers = {
        Authorization: `Bearer ${process.env.private_app_token}`,
        'Content-Type': 'application/json'
    }

    try {
        const response = await axios.get(contacts, { headers });
        const data = response.data.results;
        res.render('homepage', { title: 'homepage | Hubspot APIs', data });
    } catch (error) {
        console.log(error);
    }
});

app.get('/update', async (req, res) => {
    const id = req.query.id;

    const getContact = `https://api.hubapi.com/crm/v3/objects/actors/${id}?id&properties=actor_name,actor_movie_name,actor_age`;
    const headers = {
        Authorization: `Bearer ${process.env.private_app_token}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(getContact, { headers });
        const data = response.data;
        // res.json(data);
        res.render('update', { actorName: data.properties.actor_name, movieName: data.properties.actor_movie_name, age: data.properties.actor_age });
    } catch (err) {
        console.log(err);
    }
});


app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "actor_name": req.body.actorName,
            "actor_movie_name": req.body.movieName,
            "actor_age": req.body.age
        }
    }

    const id = req.query.id;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/actors/${id}?id`;
    const headers = {
        Authorization: `Bearer ${process.env.private_app_token}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.patch(updateContact, update, { headers });
        res.redirect('back');
    } catch (err) {
        console.log(err);
    }
});


// Route for rendering HTML form
app.get('/update-cobj', (req, res) => {
    // Render updates template
    res.render('updates', { pageTitle: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
  });

// Route for handling form submission


app.post('/update-cobj', async (req, res) => {
      const data = {
        properties: {
            "actor_name": req.body.actorName,
            "actor_movie_name": req.body.movieName,
            "actor_age": req.body.age
        }
    }

  
    try {
      const response = await axios.post(
        `https://api.hubspot.com/crm/v3/objects/2-26745068`,
        data,
        {
          headers: {
            Authorization: `Bearer ${process.env.private_app_token}`,
          },
        }
      );
      res.redirect('/'); // Redirect back to homepage after successful creation
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating record');
    }
  });

  app.get('/contacts', async (req, res) => {

    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('users', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }

});


app.listen(9090, () => console.log("Listing on http://localhost:9090"));