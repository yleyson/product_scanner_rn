using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALings
{
    public class Product
    {
        public string name { get; set; }
        public string image { get; set; }
        public string category { get; set; }
        public int user_id { get; set; }

        public List<Ingridents> ingridentities { get; set; }
        public Product(string name,string category, List<Ingridents> ingridentities,int user_id)
        {
            this.name = name;
            this.image = "";
            this.category = category;
            this.ingridentities = ingridentities;
            this.user_id = user_id;
        }

        public Product() { }


    }
}
