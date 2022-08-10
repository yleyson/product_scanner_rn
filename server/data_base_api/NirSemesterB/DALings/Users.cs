using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DALings
{
    public class Users
    {
        public int id { get; set; }
        public string user_name { get; set; }
        public string pass { get; set; }

        public string user_mail { get; set; }
        public Users(int id,string user_name, string pass,string user_mail)
        {
            this.id = id;
            this.user_name = user_name;
            this.pass = pass;
            this.user_mail = user_mail;
        }
        public Users(string user_name, string pass, string user_mail)
        {
            this.user_name = user_name;
            this.pass = pass;
            this.user_mail = user_mail;
        }
        public Users()
        {
        }

        public override string ToString()
        {
            return $"ID:{id}\nName:{user_name}\nPass:{pass}\nUser mail:{user_mail}";
        }
    }
}
