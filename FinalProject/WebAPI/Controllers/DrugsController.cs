using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PersistenceLayer.Models;
using PersistenceLayer.CRUD;
using static PersistenceLayer.Program;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    public class DrugsController : Controller
    {
        // GET api/values
        [HttpGet]
        public object Get()
        {
            return DrugsCRUD.GetDrugs();
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
        [HttpPut("{userId}")]
        public void Put(int userId, [FromBody]Drug drug)
        {
            DrugsCRUD.AddDrug(drug, userId);
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
