using System;
using System.Collections.Generic;
using System.Text;

namespace PersistenceLayer.Models
{
    public class Drug
    {
        public int DrugId { get; set; }
        public string Name { get; set; }
        public DateTime Time { get; set; }
        public User User { get; set; }
    }
}

