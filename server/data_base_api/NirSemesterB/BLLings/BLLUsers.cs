using DALings;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLLings
{
    public class BLLUsers
    {

        public static Product AddProduct(Product product)
        {
            return DALUsers.AddProduct(product);
        }

        public static string GetIngDesc(string ing_name)
        {
            return DALUsers.GetIngDesc(ing_name);
        }

        public static DataTable ListOfIngs(int id)
        {
            return DALUsers.GetAllIngs(id);
        }
        public static Users FindUserById(string pass,string user_mail)
        {
            //code security/ roles / algorithm / 
            return DALUsers.ShowUserById(pass,user_mail);
        }

        public static DataTable ListOfFavorites(int value)
        {
            //code security/ roles / algorithm / 
            return DALUsers.GetAllFavorites(value);
        }

        public static Register Register(Register value)
        {
            //code security/ roles / algorithm / 
            return DALUsers.AddUser(value);
        }

        public static GetProduct Product(string product_name)
        {
            return DALUsers.GetProductDetails(product_name);
        }

        public static LastProduct GetLastProductToAdd(int user_id)
        {
            return DALUsers.GetLastProduct(user_id);
        }

        public static int Delete(int product_code)
        {
            return DALUsers.DeleteProduct(product_code);
        }
        public static string AddImage(ImageToAdd image_to_add)
        {
            return DALUsers.AddImage(image_to_add);
        }
    }
}
