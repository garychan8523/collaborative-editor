# collaborative-editor
[cl.dedd.ca](cl.dedd.ca)
<br>multiple rooms collaborative editor with nodejs, express and socketio.
<br><br>example: [http://cl.dedd.ca/qyTcN](http://cl.dedd.ca/qyTcN)

## note
#####This is my first project on github :-)
This a little experiment, refinements are needed for deploy.
<br> Planned to add few more features, but maintenance may terminated at any time.

## to install
- git clone https://github.com/garychan8523/collaborative-editor.git
- npm install
- node app

## to use (user)
- ####[http://localhost:3000](http://localhost:3000)
  Homepage, a button for creating a new room (will direct to getroom.html and generate a new random room).
  
- ####[http://localhost:3000/getroom.html](http://localhost:3000/getroom.html)
  Generate a new random room id with 5 letters random string (I, l, o, O, 0 are excluded for the sake of urls), user will be direct to the url http://localhost:3000/(roomid) automatically.

- ####[http://localhost:3000/(roomid)](http://localhost:3000/(roomid))
  Get into the room with the specified room id, it only accept exactly five characters [a-zA-Z0-9] as room id, shorter will be considered invalid while the longer will be trim.

## to use (developer)
- ####[http://localhost:3000/index](http://localhost:3000/index)
  Getting in a room with any specific room id, it will prompt for room id.
  
- ####[http://localhost:3000/display](http://localhost:3000/display)
  Display current number of rooms, all rooms info and their contents respectively.
