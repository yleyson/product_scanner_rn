using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALings
{
    public class Register
    {
        public string pass { get; set; }
        public string user_name { get; set; }
        public string user_mail { get; set; }

        public Register(string pass, string user_name, string user_mail)
        {
            this.pass = pass;
            this.user_name = user_name;
            this.user_mail = user_mail;
        }
    }
}
