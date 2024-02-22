# iCUBEFARM Project submission


## Setting up the Backend

### Install Dependencies

1. **Python 3.11** - Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

- Python 3.11 upward is required

2. **Virtual Environment** - I recommend working within a virtual environment whenever using Python for projects. This keeps your dependencies for each project separate and organized. Instructions for setting up a virual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

3. **PIP Dependencies** - Once your virtual environment is setup and running, install the required dependencies make sure you are on the `Server` directory then run the commands below:

- **Start and activate your virtual environment**

```bash
# Mac and Linux users

python3 -m venv env
source env/bin/activate

# Windows users
> py -3 -m venv env
> env\Scripts\activate

# Windows git bash users
python3 -m venv env
source env/bin/activate
```

Run This command to install the required project dependencies e.g Django

```bash
pip install -r requirements.txt
```

#### Key Pip Dependencies

- [Django](https://www.djangoproject.com/) Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design. Built by experienced developers, it takes care of much of the hassle of web development, so you can focus on writing your app without needing to reinvent the wheel. It’s free and open source.

### Set up the Database

```bash
python manage.py makemigrations
python manage.py migrate
```

### Run the Server

After successfully setting up and installing the dependencies and setting up the Database start your backend Django server by running the command below from the `/server/` directory.

Create a .env file in the root level of the project to contain GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET and SECRET_KEY. A default value has been added to ensure the project run, but the google social authentication cant be tested if actualy google credentials were not provided. However, the app can still be tested with email and password authentication.


NB: Email verification was not added to reduce, but in a real world application, email verification will be added.

```bash
python manage.py runserver
```

The server should start on port 8000 provided no other process is running on port 8000 on the machine

# Backend Endpoints


GET / => Swagger Documentation UI
POST /auth/login/  => Login endpoint
POST /auth/signup/  => Signup endpoint
POST /api/token/  => Generate token for user
POST /api/token/refresh  => Generate token for user from refresh token
GET /api/v1/todos/ => Get all todos for current user
POST /api/v1/todos/ => Create todo for crrent 
GET /api/v1/single_todos/:id => Retrieve  todo with given id if found
PATCH /api/v1/single_todos/:id => Update  todo with given id if found
DELETE /api/v1/single_todos/:id => Delete  todo with given id if found


## Setting up the Frontend

Navigate to the frontend directory and Run This command to install the required project dependencies e.g Next Js

```bash
npm install
```

Create a .env.local file at the root level of the project to hold the GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET which will enable the frontend to communicate with the google authentication API


start development server with the following command

```bash
npm run dev
```

The server should start on port 3000 provided no other process is running on port 3000 on the machine