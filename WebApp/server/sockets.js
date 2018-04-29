const persistence = require('./Persistence')
const fetch = require('../FetchCommands')

module.exports = (server) => 
{
    const
        io = require('socket.io')(server),
        moment = require('moment')

    let users = []
    const messages = []

    io.on('connection', socket => 
    {
        // 1. Make sure the username is unique 
        // 2. Save the user into database 
        // 3. Emite successful join if unique
        // 4. Otherwise, emit failed
        socket.on('join-user', user => 
        {            
            let users = persistence.
                get_request("http://localhost:63075/api/users/")

            // 1. Make sure the username is unique 
            let isDuplicate = false
            
            users.forEach(element => 
            {
                if (element.name.toUpperCase() === user.userName.toUpperCase()) 
                    isDuplicate = true
            })
            
            if (isDuplicate == false)
            {
                const memeber = {
                    id: socket.id,
                    name: user.userName,
                    matched: isDuplicate, 
                    avatar: `https://robohash.org/${user.userName}?set=set3`, 
                    Password: user.password 
                }
                
                //users.push(memeber)

                // 2. Save the user into database 
                persistence.
                    put_request("http://localhost:63075/api/users/", memeber)
    
                io.emit('successful-join', memeber)
            }
            else
            {
                // 4. Otherwise, emit failed
                io.emit('failed-join', "Choose a different name please")
            }
        })

        // 1. Make sure the user is in the database
        // 2. Emit successful validation if user
        // 3. Otherwise, emit failed validation
        socket.on('validate-user', user =>
        {
            let users = persistence.get_request("http://localhost:63075/api/users/")

            // 1. Make sure the user is in the database
            let isUser = false

            users.forEach(element => {
                if (isUser == false && element.password == user.password &&
                    element.name === user.userName) {
                    isUser = true
                }
            })

            if (isUser)
            {
                const memeber = {
                    id: socket.id,
                    name: user.userName,
                    matched: isUser, 
                    avatar: `https://robohash.org/${user.userName}?set=set3`, 
                    Password: user.password 
                }
                // 2. Emit successful validation if user
                io.emit('successful-validation', memeber)
            }
            else
            {
                // 3. Otherwise, emit failed validation
                io.emit('failed-validation', "Wrong Login Info")
            }
        })

        socket.on('send-message', data => {

            let records = []

            fetch.records(data.message).then((results) => {

                results.forEach(record => {
                    let inividual_reactions = []
                    record.patient.reaction.forEach(element => {
                        inividual_reactions.push(element.reactionmeddrapt)
                    })
                    records.push(inividual_reactions)
                })

                const content = {
                    user: data.user,
                    message: data.message,
                    date: moment(new Date()).format('MM/DD/YY h:mm a'),
                    avatar: `https://robohash.org/${data.user.name}?set=set3`,
                    records: records
                }
                messages.push(content)

                let obj = {
                    Name: data.message
                }

                let users = persistence.get_request("http://localhost:63075/api/users/")

                console.log()
                console.log(users)
                console.log(data.user)

                let id = 1
                users.forEach(element => {
                    if (element.name == data.user.name)
                        id = element.userId
                })

                persistence.put_request("http://localhost:63075/api/drugs/" + id, obj)


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



