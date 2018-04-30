const persistence = require('./Persistence')
const fetch = require('../FetchCommands')

module.exports = (server) => 
{
    const
        io = require('socket.io')(server),
        moment = require('moment')

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

        // 1. Make a search call to the OpenFDA API
        // 2. Save the search results into records array
        // 3. Save the search info to database 
        // 4. Emit sucessful search
        socket.on('send-search', data => 
        {
            let records = []

             // 1. Make a search call to the OpenFDA API
            fetch.records(data.search).then((results) => {

                results.forEach(record => {
                    let inividual_reactions = []
                    record.patient.reaction.forEach(element => {
                        inividual_reactions.push(element.reactionmeddrapt)
                    })
                    // 2. Save the search results into records array
                    records.push(inividual_reactions)
                })

                // 3. Save the search info to database 
                let drug = {
                    Name: data.search
                }

                let users = persistence.get_request("http://localhost:63075/api/users/")

                let userId = 1
                users.forEach(element => {
                    if (element.name == data.user.name)
                        userId = element.userId
                })

                persistence.put_request("http://localhost:63075/api/drugs/" + userId, drug)

                // 4. Emit sucessful search
                const content = {
                    user: data.user,
                    search: data.search,
                    date: moment(new Date()).format('MM/DD/YY h:mm a'),
                    avatar: `https://robohash.org/${data.user.name}?set=set3`,
                    records: records
                }

                io.emit('successful-search', content)
            })
        })

        socket.on('disconnect', () => {
            let users = []
            users = users.filter(user => {
                return user.id != socket.id
            })

            io.emit('refresh-users', users)
        })
    })
}



