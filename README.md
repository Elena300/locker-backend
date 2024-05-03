# locker-backend

App description: the chat application with the following functionality:
- user can register and later sign up using nickname and password
- user can find other users by nickname or pick from the list
- user can send direct message to another user, see all the messages in one chat, delete his own messages
- user can create a group and become it's admin with the right add and remove other users, delete the messages of other users.
  
## Technologies used at the backend:
- Express.js for routing and middleware
- JWT for secure authentication
- MongoDB as a database (remote version on Atlas server)
- Deployment: Heroku

## Already done
- Secure authentication with JWT
- Login and register routes and middleware functionality
- Data base connected

## To be done in routing:
- Display all the registered users, search by nickname, choose the chat
- DM to user
- Create user group, assign the creator as an admin
- user can delete his own messages in one-2-one chat and any message in the group where he is admin
  
