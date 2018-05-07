// Chat Component
const chatComponent = {
    template: ` <div class="chat-box">   
                    There are <strong>{{content.length}}</strong> result(s) 

                    <table v-for=" records in content"> 
                        <tr  v-for="record in records">                              
                            <td style="text-align:left" > {{record}} </td>                         
                        </tr>                     
                </table>
               </div>`,
    props: ['content']
}

// Users Component
const usersComponent = {
    template: ` <div class="user-list">
                   <ul v-for="user in users">
                       <li>
                       <img class="image is-24x24" width="30px" v-bind:src="user.avatar">
                            <span>{{user.name}}</span>
                       </li>
                       <hr>
                   </ul>
               </div>`,
    props: ['users']
}

// Welcome Component
const welcomeComponent = {
    template: ` <div style="text-align:center">
    <h5>Greetings</h5>
    <img class="image is-12x12" width="80px" v-bind:src="user.avatar"> <br/>
    <span>{{user.name}}</span>
    </div>
 `,
    props: ['user']
}

const socket = io()
const app = new Vue({
    el: '#chat-app',
    data: {
        loggedIn: false,
        userName: '',
        user: {},
        users: [],
        message: '',
        messages: [], 
        errorMessage: '', 
        password: '', 
        records: []
    },
    methods: {
        joinUser: function () {
            if (!this.userName)
                return

            let obj = {
                userName: this.userName, 
                password: this.password
            }

            socket.emit('join-user', obj)
        },
        search: function () {
            if (!this.message)
                return
            
            socket.emit('send-message', { message: this.message, user: this.user })
        }, 
        validateUser: function () {
            let obj = {
                userName: this.userName, 
                password: this.password
            }
            socket.emit('validate-user', obj)
        }, 
        logout: function () {
            socket.emit('disconnect')
        }
    },
    components: {
        'users-component': usersComponent,
        'chat-component': chatComponent,
        'welcome-component': welcomeComponent
    }
})


// Client Side Socket Event
/* socket.on('refresh-messages', messages => {
    app.messages = messages
})
socket.on('refresh-users', users => {
    app.users = users
}) */

socket.on('failed-join', element => {
    app.errorMessage = element
})

socket.on('failed-join2', element => {
    app.errorMessage = element
})

socket.on('successful-join', user => {
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
        app.password = user.password
    }

    console.log(user)

    app.users.push(user)
})

socket.on('successful-join2', user => {
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
        app.password = user.password
    }
    app.users.push(user)
})

socket.on('successful-message', content => {
    app.message = content.message
    app.messages.push(content)
    app.records = content.records
})


