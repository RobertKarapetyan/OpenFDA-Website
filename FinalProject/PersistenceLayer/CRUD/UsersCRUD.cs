using System;
using System.Collections.Generic;
using System.Text;
using PersistenceLayer.Models;
using static PersistenceLayer.Program;

namespace PersistenceLayer.CRUD
{
    public class UsersCRUD
    {
        public static void AddUser(User user)
        {
            using (var db = new FinalProjectContext())
            {
                db.Add(user);
                db.SaveChanges();
            }
        }

        public static List<User> GetUsers()
        {
            List<User> users = new List<User>();

            using (var db = new FinalProjectContext())
            {
                var collection = db.Users;


                foreach (User item in collection)
                    users.Add(item);
                db.SaveChanges();
            }
            return users;
        }
    }
}
