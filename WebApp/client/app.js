// Components
/**
    5/1/2018 added style to the Record button
 **/
const recordsComponent = {
    template: ` <div class="chat-box">
                    <ul>
                        <li
                            v-for="item in content"
                            :key="item.id"
                        >                            
                            <button v-on:click="item['selected'] = !item['selected']" type="submit" class="btn-small waves-effect waves-light" >
                                {{ item.name }}
                            </button>
                            <br/> <br/>
                        </li>
                    </ul>
               </div>`,
    props: ['content']  
}
/**
    END -- 5/1/2018 added style to the Record button
 **/

/**
    5/1/2018 make user.avatar with style
 **/
const welcomeComponent = {
    template: `<div style="text-align:center">
                <h5>Welcome</h5>
                <img class="image is-24x24" width="150px" v-bind:src="user.avatar" style="border-radius:29%;" >
                <br/>
                <span>{{user.name}}</span>
                </div>`,
    props: ['user']
}
/**
    END -- 5/1/2018 make user.avatar with style
 **/

// Vue Startup + Socket Handling
const socket = io()
const app = new Vue({
    el: '#chat-app',
    data: {
        loggedIn: false,
        userName: '',
        user: {},
        drugName: '',
        errorMessage: '', 
        password: '', 
        list: [], 
        recentSearches: []
    },
    methods: {
        joinUser: function () {
            if (!this.userName)
                return

            const user = {
                userName: this.userName, 
                password: this.password
            }

            socket.emit('join-user', user)
        },
        search: function () {
            if (!this.drugName)
                return

            this.recentSearches.push(this.drugName)

            socket.emit('send-search', { search: this.drugName, user: this.user })
        }, 
        validateUser: function () {
            const user = {
                userName: this.userName, 
                password: this.password
            }
            socket.emit('validate-user', user)
        }
    },
    components: {
        'records-component': recordsComponent,
        'welcome-component': welcomeComponent,
    }
})

socket.on('successful-join', user => {
    if (user.name === app.userName) {
        app.user = user
        app.loggedIn = true
        app.password = user.password
    }
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
})

socket.on('failed-validation', element => {
    app.errorMessage = element
})

socket.on('successful-search', content => {
    app.drugName = content.search

    console.log(content.records)
    console.log()

    let i = 0
    const list = []
    content.records.forEach(element => {
        const search = {
            id: 0, 
            record: [], 
            name: '',
            selected: false, 
            text: ''
        }
        search.id = i++
        search.record = element
        search.name = 'Record ' + i

        /** 5/1/2018 added a bullet for each element **/
        search.text += "<h3>" + search.name  + "</h3>"
        search.record.forEach(element => {
            search.text += "<p>"+ "&nbsp;" + "&#9678;" + "&nbsp;" + element + "</p>"
        })
        /** END -- 5/1/2018 added a bullet for each element **/
        list.push(search)  
    })

    app.list = list
    app.records = content.records
})