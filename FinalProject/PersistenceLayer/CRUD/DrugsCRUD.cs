using System;
using System.Collections.Generic;
using System.Text;
using static PersistenceLayer.Program;
using PersistenceLayer.Models;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace PersistenceLayer.CRUD
{
    public class DrugsCRUD
    {
        public static void AddDrug(Drug drug, int userId)
        {
            using (var db = new FinalProjectContext())
            {
                var users = db.Users.
                    Where(x => (x.UserId == userId));
                List<User> users__ = new List<User>();
                foreach (User x in users) users__.Add(x);
                User user = users__.ElementAt(0);

                drug.Time = DateTime.Now;
                drug.User = user;

                db.Add(drug);
                db.SaveChanges();
            }
        }

        public static List<Drug> GetDrugs()
        {
            List<Drug> drugs = new List<Drug>();

            using (var db = new FinalProjectContext())
            {
                var collection = db.Drugs.Include(t => t.User);

                foreach (Drug item in collection)
                    drugs.Add(item);
                db.SaveChanges();
            }

            return drugs;
        }

    }
}