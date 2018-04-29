using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PersistenceLayer.Models;
using PersistenceLayer.CRUD;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        // GET api/values
        [HttpGet]
        public object Get()
        {
            return UsersCRUD.GetUsers();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        [HttpPut]
        public void Put([FromBody]User user)
        {
            UsersCRUD.AddUser(user);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
