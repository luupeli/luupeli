## Program logic in a nutshell

Here, in the root, you will find two directories, 'frontend' and 'backend'. We used to have two separate repositories for these directories, but everything's in our 'luupeli' repository now (although 'luupeli-backend' still exists).

**Back end**

In 'backend', you will find everything that's needed for adding stuff to our database. As an example, we have a database table for images used in the game that holds information about them, such as their id, their difficulty, the bone and animal associated with them, when they were created (added to the database) and when they were last modified, amongst other things.

In 'src/models' we have 'image.js', which shows all the information we're saving about each image.

In 'src/controllers', 'images.js' uses this model for CRUD (create, read, update and delete) operations. So, this class is responsible for altering the database, adding new images and updating or deleting existing ones, as well as fetching images for use ('read' operation).

This is how our controllers and models work in our back end directory. They exist for each of our database tables. We also have tests for aforementioned operations in src/tests, don't worry.

**Front end**

In 'frontend/src', we have various directories. 'games' is where you'll find all classes associated with the game itself, like its modes and some cool props that are rendered during it. 'menus' is for non-game stuff. It has the directories 'admin', 'gamescreens' and 'login', each containing appropriate pages. The services inside 'services' are our connection to the back end, providing useful functions that can easily be used in the front end. For example, 'Login.js' in 'src/menus/login' uses loginService by giving it the credentials provided by a user on the login page. loginService then posts these to the appropriate URL, and back end takes over, and determines whether or not posting them to this URL is valid, or if login is successful.

'Main.js' is where all our pages are imported, and it decides, based on path, which component to return for 'index.js' to render, or which page is to be shown to the user.
