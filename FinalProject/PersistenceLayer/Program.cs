using Microsoft.EntityFrameworkCore;
using System;
using PersistenceLayer.Models;

namespace PersistenceLayer
{
    public class Program
    {
        static void Main(string[] args)
        {
            //User user = new User();
            //user.Name = "Robert";
            //PersistenceLayer.CRUD.UsersCRUD.AddUser(user);
            //Console.WriteLine("Success!");
            //Console.ReadLine();

            //Console.WriteLine(DateTime.Now);
            //Console.ReadLine();

            Drug drug = new Drug
            {
                Name = "Aspirin",
                Time = DateTime.Now
            };
            PersistenceLayer.CRUD.DrugsCRUD.AddDrug(drug, 4);
            Console.WriteLine("Success!");
            Console.ReadLine();
        }

        public class FinalProjectContext : DbContext
        {
            public DbSet<User> Users { get; set; }
            public DbSet<Drug> Drugs { get; set; }

            protected override void OnConfiguring(
                DbContextOptionsBuilder optionsBuilder)

            {
                optionsBuilder.UseSqlServer(@"Server=(localdb)\ProjectsV13;
                    Database=FinalProject;Trusted_Connection=True");
            }
        }
    }
}
