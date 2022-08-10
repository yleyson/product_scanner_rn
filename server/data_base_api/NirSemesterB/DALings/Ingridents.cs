using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALings
{
    public class Ingridents
    {
        public string name { get; set; }
        public string description { get; set; }

        public Ingridents(string name, string description)
        {
            this.name = name;
            this.description = description;
        }
    }
}
