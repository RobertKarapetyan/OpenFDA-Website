// Chat Component
const chatComponent = {
    template: ` <div class="chat-box">
                   <p>
                    {{content}} 
                   </p>
               </div>`,
    props: ['content']
}

// Users Component
const usersComponent = {
    template: ` <div class="user-list">
                   <h6>Active Users ({{users.length}})</h6>
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
    template: ` 
    <h1 v-if="user.name != null">
    &nbsp Greetings  <br/>
    &nbsp <img class="image is-24x24" width="150px" v-bind:src="user.avatar"> <br/>
    &nbsp {{user.name}}
</h1>
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

            socket.emit('send-search', { search: this.message, user: this.user })
        }, 
        validateUser: function () {
            let obj = {
                userName: this.userName, 
                password: this.password
            }
            socket.emit('validate-user', obj)
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

socket.on('failed-validation', element => {
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

socket.on('successful-validation', user => {
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
        app.password = user.password
    }
    app.users.push(user)
})

socket.on('successful-search', content => {
    app.message = content.search
    app.messages.push(content)
    app.records = content.records
})
