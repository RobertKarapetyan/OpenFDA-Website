// Chat Component
const chatComponent = {
    template: ` <div class="chat-box">
                   <p>
                    {{content}} 
                   </p>
               </div>`,
    props: ['content']
}

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
        drugName: '',
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
            if (!this.drugName)
                return

            socket.emit('send-search', { search: this.drugName, user: this.user })
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

socket.on('successful-join', user => {
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
        app.password = user.password
    }

    app.users.push(user)
})

socket.on('failed-join', element => {
    app.errorMessage = element
})

socket.on('successful-validation', user => {
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
        app.password = user.password
    }
    app.users.push(user)
})

socket.on('failed-validation', element => {
    app.errorMessage = element
})

socket.on('successful-search', content => {
    app.drugName = content.search
    app.records = content.records
})