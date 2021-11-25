# Django-ReactJS Contact List

A Contacts list management app made with Python (Django) and ReactJS

## Set Up:
You need to have NodeJS and Python installed on your environment.

### Back-End
On your environment, install all python dependencies:
`pip install -t requirements.txt`

Also, you need to set up all the environment settings that will be used by Django. So, in root folder, copy the file **.env.example** to a file named **.env**. There you'll need to fill all the used environment parameters.

After all set up, you can run the initial migration for Django.

`python manage.py migrate`
to generate the schema migrations. Then,

`python manage.py loaddata contact_app/fixtures/seed.json`
to populate the database with an initial dump.

Then, you can run the server:

`python manage.py runserver`

### Front-End

Inside the **'ui/'**, install the frontend depencies. You can install the application using **npm**:
`npm install`

After the dependencies installed, edit the `proxy` parameter inside the *package.json* file. Fill with the host:port that you're running your Back-End (by default: `"proxy": "http://localhost:8000"`)

Then, you can run and access the application via web browser:
`npm start`

### API Requesting
With the app running on Back-end, you can also do http request via API:
First, provide an access token with a POST request on *http://localhost:8000/token/*, with the body:
```
{
    "username": <username>,
    "password": <password>
}
```
(you can create a new user on your host with `python manage.py createsuperuser`)

Then you can do all CRUD operations accessing *http://localhost:8000/api/contacts/* passing the response access token of the request below, by the header:
```
{
	'Authorization': 'Bearer <accesss_token>'
}
```


### Test
To run the API tests, you just need to execute:
`python manage.py test contact_app`
