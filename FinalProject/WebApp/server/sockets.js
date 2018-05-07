const persistence = require('./Persistence')
const fetch = require('../FetchCommands')
const dbUrl = require('./config')

module.exports = (server) => {
    const
        io = require('socket.io')(server),
        moment = require('moment')

    let users = []
    const messages = []

    // when the page is loaded in the browser the connection event is fired
    io.on('connection', socket => {

        /* // on making a connection - load in the content already present on the server
        socket.emit('refresh-messages', messages)
        socket.emit('refresh-users', users) */

        socket.on('join-user', user => {            
            let flag = false
            
            let users = persistence.get_request(dbUrl)

            let name = user.userName
            users.forEach(element => 
            {
                if (element.name.toUpperCase() === name.toUpperCase()) 
                    flag = true
            })
            
            if (flag == false)
            {
                const memeber = {
                    id: socket.id,
                    name: user.userName,
                    matched: flag, 
                    //avatar: `https://robohash.org/${user.userName}?set=set3`, 
                    avatar: `https://api.adorable.io/avatars/170/${user.userName}.png`,
                    Password: user.password 
                }
                
                users.push(memeber)

                persistence.put_request(dbUrl, memeber)
    
                io.emit('successful-join', memeber)
            }
            else
            {
                io.emit('failed-join', "User name is already exists, please choose a different name.")
            }
        })

        socket.on('validate-user', user =>
        {
            console.log("in a socket")

            let users = persistence.get_request(dbUrl)

            let flag = false
           
            console.log(users)
            console.log(user)

            users.forEach(element => {
                if (flag == false && element.password == user.password &&
                    element.name === user.userName) {
                    flag = true
                }
            })

            if (flag)
            {
                const memeber = {
                    id: socket.id,
                    name: user.userName,
                    matched: flag, 
                    //avatar: `https://robohash.org/${user.userName}?set=set3`, 
                    avatar: `https://api.adorable.io/avatars/170/${user.userName}.png`,
                    Password: user.password 
                }
                io.emit('successful-join2', memeber)
            }
            else
            {
                io.emit('failed-join2', "Invalid password")
            }
        })

        socket.on('send-message', data => {

            let records = []

            fetch.records(data.message).then((results) => {

                results.forEach(record => {
                    let inividual_reactions = []

                    /** Start KaYee's */
                    record.patient.reaction.forEach(element => {
                        inividual_reactions.push(element.reactionmeddrapt)                        
                    })
                    
                    const found = records.findIndex(element => element.toUpperCase() === element.reactionmeddrapt.toUpperCase())
                    if (!found) {
                        records.push(inividual_reactions)
                    }
                    /* End KaYee's */

                    /** Start from Robert's **/
                    //record.patient.reaction.forEach(element => {
                        
                    //    inividual_reactions.push(element.reactionmeddrapt)                        
                    //})
                    //records.push(inividual_reactions)
                    /** END from Robert's **/ 
                })

                const content = {
                    user: data.user,
                    message: data.message,
                    date: moment(new Date()).format('MM/DD/YY h:mm a'),
                    //avatar: `https://robohash.org/${data.user.name}?set=set3`,
                    avatar: `https://api.adorable.io/avatars/170/${data.user.name}.png`,
                    records: records
                }
                messages.push(content)
               
                let obj = {
                    Name: data.message
                }

                let users = persistence.get_request(dbUrl)

                console.log()
                console.log(users)
                console.log(data.user)

                let id = 1
                users.forEach(element => {
                    if (element.name == data.user.name)
                        id = element.userId
                })

                persistence.put_request(dbUrl + id, obj)

                io.emit('successful-message', content)
            })


        })
        socket.on('disconnect', () => {
            users = users.filter(user => {
                return user.id != socket.id
            })

            io.emit('refresh-users', users)
        })
    })
}



