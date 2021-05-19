## Johnify

* A responsive music web app (like Spotify)

### Technologies used:
* back-end:
* * Database: sqlite3
* * REST API: Python (Django rest framework)
* front-end:
* * ReactJs (npx create-react-app)

### Requirements that the project covers
* Anyone who visits the web app can create an account or continue as an anonymous user

* Unauthorized users can:
    * Explore the `top` albums and tracks in the `home page`
    * Visit an `album's page` where they can see the basic information about the album and its tracks and listen to its tracks
    * Visit a `track's page` and see the basic information about the track and listen to it
    * Visit a page where they can see all the `albums`
    * Visit a page where they can see and listen to all the `tracks`
    * Visit a page where they can `search` for:
        * an album or for a track, typing its title in a search bar
        * all the tracks of a specific music kind (like rock, pop, etc)
    * Visit a `music kind`'s page, where they can see and listen to all the tracks of the certain kind
    * Visit every `user's profile` page, where if the user is an artist, they can see all of its tracks and albums and listen to them

* Authorized users have also the ability to:
    * Keep a `favourites` list
    * Add or remove tracks and albums from their favourites
    * Have instant access to their favourite albums and tracks through their `favourites page`
    * Specify if they want to declare their account as an `artist's account`
    * `Artists` have the ability to `upload albums and tracks`, using images as cover
    * Have their own `profile page` to keep track of their albums and tracks


### Directories structure:
Back-end and front-end were developed as seperate modules.

1) back-end: Contains the back-end code of the `Django` project
    * johnify: the django project directory
    * music: the django app directory
    * media: the directory where the user uploaded images are kept
    * db.sqlite3: the database file
    * requirements.txt: python packages to be installed
    
2) front-end: Contains the front-end code of the `React` app
    * public
    * src
    * package-lock.json
    * package.json
    
### Installing and running the project locally:

1) back-end:
 - [x] Download the source code of the repo's `back-end` directory 
 - [x] Move to the `back-end` direcory and:
    - [x] Install all the packages in the requirements.txt file
    - [x] Run: <b>python3 manage.py makemigrations music</b>
    - [x] Run: <b>python3 manage.py migrate</b>
    - [x] Maybe you will have to update the `ALLOWED_HOSTS` list of `johnify/settings.py` so that it contains your address
    - [x] Run <b>python3 manage.py runserver</b> and wait for the server to start running

2) front-end:
    - [x] Install `npm` if it is not installed in your system
    - [x] Download the source code of the repo's `front-end` directory
    - [x] Move to the `front-end` directory and:
        - [x] Run <b>npm install</b> to install all the necessary dependencies declared in the `package.json` and `package-lock.json` files
        - [x] Run <b>npm start</b> and wait for the server to start running
        - [x] The front-end is up in the address: http://localhost:3000
        - Important note:
            - If you wish to change the address of the front-end, you will also need to update the `CORS_ALLOWED_ORIGINS` and `CSRF_COOKIE_DOMAIN` fields of the `back-end/johnify/settings.py` file to allow the `front-end` module to communicate with the `back-end`
---

* Developer: Giannis Athanasiou
* Github username: John-Atha
* Email: giannisj3@gmail.com