const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

//Idea Service
class IdeaService {
    constructor(){
        this.ideas = [];
    }

    async find(){
        return this.ideas;
    }

    async create(data){
      const idea = {
        id: this.ideas.length,
        text: data.text,
        tech: data.tech,
        viewer: data.viewer
      }

      idea.time = moment().format('h:mm:ss a');

      this.ideas.push(idea);
      return idea;
    }
}

const app = express(feathers());

//Parse json
app.use(express.json());

//config socket.io realtime apis
app.configure(socketio());

//enable rest services
app.configure(express.rest())

//register service
app.use('ideas', new IdeaService());

//New connection connects to the stream channel
app.on('connection', conn => app.channel('stream').join(conn))

//publish events to stream
app.publish(data => app.channel('stream'));

//create env variable to store port nos.
const PORT = process.env.PORT || 3030;

//listen to the server for the port
app.listen(PORT).on('listening', () => console.log(`Realtime server running on port ${PORT}`));

// app.service('ideas').create({
//     text: 'Build a cool app',
//     tech: 'Node.js',
//     viewer: 'John Doe'  
// });