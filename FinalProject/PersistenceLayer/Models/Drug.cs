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

    /*
            {
	            "Name": "Aspirin", 
	            "Time" : "4/26/2018 10:30:20 PM",
	            "User": 
	            {
		            "UserId" : 1, 
		            "Name" : "Robert"
	            } 
            } 
    */
}

